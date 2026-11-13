import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const path=new URL('../js_v2/modules/syntax-highlight.js',import.meta.url);
const source=fs.readFileSync(path,'utf8');
const {highlightCode,highlightPython}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const plain=h=>h.replace(/<span class="syn-[a-z]+">|<\/span>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const fixtures={python:'"""doc\n# string"""\n# ∇A = zéro\nfor i in range(2):\n    print("<img src=x onerror=alert(1)>", 1e-6)\n',c:'#include <stdio.h>\n/* multi\nline */\nint main(void) { printf("hi"); return 0; }',bash:'#!/bin/bash\n# example\nfor f in "$HOME"; do echo ${f}; done\n',php:'<?php\n/* comment */\nfunction greet($name) { return "hi"; }\necho greet($user); ?>'};
for(const [lang,input] of Object.entries(fixtures))test(lang+' tokens preserve exact source and escape HTML',()=>{const html=highlightCode(input,lang);assert.equal(plain(html),input);assert.match(html,/syn-kw/);assert.match(html,/syn-cmt/);assert.match(html,/syn-str/);assert.ok(!html.includes('<img'));});
test('unknown, oversized, malformed and unicode inputs stay lossless',()=>{for(const input of ['🙂 α∇ こんにちは\r\n\t"unfinished', 'x'.repeat(200001), '<script>&hello</script>'])for(const lang of ['c','python','php','bash','text'])assert.equal(plain(highlightCode(input,lang)),input);assert.equal(highlightPython('print(1)'),highlightCode('print(1)','py'));});
test('matrix equations and recorded outputs retain Unicode and colour key notation',()=>{
 const equation='dV = Pᵀ dC\n∇X = DŴᵀ + sDBᵀAᵀ # frozen base\ndQ = dS K / √dₕ\n';
 const output='Step 1: loss before = 0.616344\ndA: [0.0, -1e-6]\nPASS: W unchanged = True\n';
 for(const [lang,input] of [['math',equation],['output',output]]){const html=highlightCode(input,lang);assert.equal(plain(html),input);assert.match(html,/syn-kw/);assert.match(html,/syn-fn/);}
 assert.match(highlightCode(equation,'math'),/syn-op/);
 assert.match(highlightCode(output,'output'),/syn-num/);
});
test('JSON distinguishes keys, values and literals without changing payload',()=>{
 const input='{\n  "quoted\\\"key": "<script> & ∇",\n  "n": -1.25e-6, "large": 9007199254740993,\n  "ok": true, "empty": null, "list": [false, "12"]\n}';
 const html=highlightCode(input,'json');assert.equal(plain(html),input);
 assert.match(html, /syn-fn/);assert.match(html, /syn-str/);assert.match(html, /syn-num">-1.25e-6/);assert.match(html,/syn-kw">true/);assert.ok(!html.includes('<script>'));
 assert.equal(plain(highlightCode('{"unterminated: [true,','json')),'{"unterminated: [true,');
});
