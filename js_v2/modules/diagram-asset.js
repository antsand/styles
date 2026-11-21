// A normal reader link remains usable in an email or without the site bundle.
export function initDiagramAssets(root = document) {
    for (const link of root.querySelectorAll('a[data-antsand-diagram][href]')) {
        if (link.previousElementSibling?.classList.contains('ant-diagram-frame')) continue;
        const url = new URL(link.href);
        const local = ['localhost','127.0.0.1'].includes(location.hostname) &&
            ['localhost','127.0.0.1'].includes(url.hostname) && ['http:','https:'].includes(url.protocol);
        const trusted = url.protocol === 'https:' && ['www.antsand.com','www.antsand.ca','antsand.com','antsand.ca'].includes(url.hostname);
        if (url.pathname !== '/diagram-assets/view.html' || !(local || trusted || url.origin === location.origin)) continue;
        const frame = document.createElement('iframe');
        frame.title = link.textContent.trim() || 'Interactive diagram';
        frame.className = 'ant-diagram-frame';
        frame.loading = 'lazy';
        frame.allowFullscreen = true;
        frame.style.cssText = 'display:block;width:100%;height:clamp(330px,48vw,520px);border:0';
        const figure=link.closest('figure[data-antsand-diagram-figure]');
        const preview=figure?.querySelector(':scope > img');
        const previewDisplay = preview?.style.getPropertyValue('display') || '';
        const previewPriority = preview?.style.getPropertyPriority('display') || '';
        function showPreview(show) {
            if (!preview) return;
            preview.hidden = !show;
            preview.style.setProperty('display', show ? previewDisplay : 'none', show ? previewPriority : 'important');
        }
        if (url.origin === location.origin) {
            let observer;
            frame.addEventListener('load', () => {
                observer?.disconnect();
                showPreview(true);
                const main = frame.contentDocument?.querySelector('main');
                if (!main) return;
                const fit = () => {
                    showPreview(!main.querySelector('#drawing svg [role=button]'));
                    const height = Math.ceil(main.getBoundingClientRect().height);
                    if (height > 0) frame.style.height = height + 'px';
                };
                observer = new ResizeObserver(fit);
                observer.observe(main);
                fit();
            });
        }
        frame.src = url.href;
        const caption=link.closest('figcaption');
        if(figure && caption?.parentElement===figure){
            if(figure.querySelector(':scope > iframe.ant-diagram-frame'))continue;
            figure.insertBefore(frame,caption);
        } else link.before(frame);
    }
}
