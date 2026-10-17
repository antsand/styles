import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('SVG lightbox pans on drag and zooms on wheel', async (t) => {
    const profile = await mkdtemp(join(tmpdir(), 'antsand-lightbox-'));
    const chrome = spawn('google-chrome', [
        '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions', '--allow-file-access-from-files',
        '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1280,900', 'about:blank'
    ], { stdio: 'ignore' });
    t.after(async () => {
        if (chrome.exitCode === null) {
            chrome.kill();
            await once(chrome, 'exit');
        }
        await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    });

    let port;
    for (let attempt = 0; attempt < 50; attempt++) {
        try {
            port = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
            break;
        } catch { await sleep(100); }
    }
    assert.ok(port, 'Chrome DevTools did not start');
    const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const { webSocketDebuggerUrl } = targets.find((target) => target.type === 'page' && target.url === 'about:blank');
    const socket = new WebSocket(webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });
    t.after(() => socket.close());

    let id = 0;
    const pending = new Map();
    socket.addEventListener('message', ({ data }) => {
        const reply = JSON.parse(data);
        if (!pending.has(reply.id)) return;
        const { resolve, reject } = pending.get(reply.id);
        pending.delete(reply.id);
        if (reply.error) reject(new Error(reply.error.message));
        else resolve(reply.result);
    });
    const cdp = (method, params = {}) => new Promise((resolve, reject) => {
        const messageId = ++id;
        pending.set(messageId, { resolve, reject });
        socket.send(JSON.stringify({ id: messageId, method, params }));
    });
    const evaluate = async (expression) => {
        const reply = await cdp('Runtime.evaluate', { expression, returnByValue: true });
        if (reply.exceptionDetails) throw new Error(reply.exceptionDetails.text);
        return reply.result.value;
    };

    await cdp('Page.navigate', { url: `file://${fileURLToPath(new URL('./image-lightbox-smoke.html', import.meta.url))}` });
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
        ready = await evaluate("document.querySelector('#result')?.textContent?.startsWith('PASS')");
        if (ready) break;
        await sleep(100);
    }
    assert.ok(ready, `Lightbox fixture did not load: ${JSON.stringify(await evaluate("({url:location.href, result:document.querySelector('#result')?.textContent, body:document.body?.innerText?.slice(0,120)})"))}`);

    const before = await evaluate(`(() => {
        const box = document.querySelector('.antsand-image-lightbox');
        const bounds = box.querySelector('.antsand-image-lightbox__stage').getBoundingClientRect();
        return { panY: box.__antsandImageLightbox.panY, zoom: box.__antsandImageLightbox.zoom,
            x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    })()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: before.x, y: before.y, button: 'left', clickCount: 1 });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: before.x, y: before.y - 120, button: 'left', buttons: 1 });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: before.x, y: before.y - 120, button: 'left', clickCount: 1 });
    const afterDrag = await evaluate("document.querySelector('.antsand-image-lightbox').__antsandImageLightbox.panY");
    assert.ok(afterDrag < before.panY - 50, `Drag did not pan: ${before.panY} -> ${afterDrag}`);

    await cdp('Input.dispatchMouseEvent', { type: 'mouseWheel', x: before.x, y: before.y, deltaX: 0, deltaY: -120 });
    const afterWheel = await evaluate("document.querySelector('.antsand-image-lightbox').__antsandImageLightbox.zoom");
    assert.ok(afterWheel > before.zoom, `Wheel did not zoom: ${before.zoom} -> ${afterWheel}`);
});
