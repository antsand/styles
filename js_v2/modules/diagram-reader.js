import {graphReference,nodeReference,hierarchy} from './diagram-guide.js';
import {edgeGeometry,shapeLabel,parameterMark} from './diagram-edge.js';
// Reader for the v1 public operator pack. Graphs contain data, never executable markup.
const ns = 'http://www.w3.org/2000/svg';
function svg(name, attributes) {
    const node = document.createElementNS(ns, name);
    for (const [key,value] of Object.entries(attributes)) node.setAttribute(key,value);
    return node;
}
async function load(name) {
    const url = new URL('/diagram-assets/ml/v1/' + name + '.json', location.origin);
    url.search = new URL(import.meta.url).search;
    const response = await fetch(url, {cache:'no-cache'});
    if (!response.ok) throw Error('Unavailable asset');
    return response.json();
}
async function start() {
    const [catalog, pack] = await Promise.all([load('catalog'), load('graphs')]);
    const symbols = new Map(catalog.map(s => [s.id,s.src]));
    const params = new URLSearchParams(location.hash.slice(1));
    if (location.hash.length > 150000) throw Error('Oversized snapshot');
    const snapshot = params.has('draft') ? JSON.parse(params.get('draft')) : pack;
    if (snapshot.version !== 1 || (params.has('draft') && snapshot.graphs.length > 32)) throw Error('Unsupported diagram');
    const graphs = new Map(snapshot.graphs.map(g => [g.id,g]));
    const history = [params.get('graph') || 'head'];
    if (!graphs.has(history[0])) throw Error('This graph is missing from the diagram library.');
    const back = document.querySelector('#parent');
    const names = [graphs.get(history[0])?.title];
    const screen = document.querySelector('#screen');
    const screenLabel = screen.querySelector('span');
    function screenState() {
        const active = Boolean(document.fullscreenElement);
        const label = active ? 'Exit full screen' : document.fullscreenEnabled ? 'Full screen' : 'Open full view';
        screenLabel.textContent = label;
        screen.setAttribute('aria-label', label);
        screen.setAttribute('aria-pressed', String(active));
    }
    screenState();
    document.addEventListener('fullscreenchange', screenState);
    screen.onclick = async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else if (document.fullscreenEnabled) {
            try { await document.documentElement.requestFullscreen(); }
            catch { screenLabel.textContent = 'Open full view'; screen.setAttribute('aria-label','Open full view'); screen.onclick = openView; }
        } else openView();
    };
    function openView() {
        const url = new URL(location.href);
        const selection = new URLSearchParams(params);
        selection.set('graph',history.at(-1));
        selection.delete('node');
        url.hash = selection.toString();
        window.open(url, '_blank', 'noopener');
    }
    function jump(i) {
        history.length=i+1;names.length=i+1;render();
    }
    function enter(n) {
        history.push(n.child);names.push(n.label);render();back.focus();
    }
    function render() {
        const g = graphs.get(history.at(-1));
        if (!g || g.nodes.length > 256 || g.edges.length > 1024) throw Error('Invalid diagram');
        const positions = new Map(g.nodes.map(n => [n.id,n]));
        const canvas = svg('svg',{viewBox:`0 0 ${g.width || 690} 280`,role:'group','aria-label':g.title});
        const defs = svg('defs',{});
        const marker = svg('marker',{id:'arrow',viewBox:'0 0 8 8',refX:7,refY:4,markerWidth:5,markerHeight:5,orient:'auto'});
        marker.append(svg('path',{d:'M0 0L8 4L0 8',fill:'#658079'}));defs.append(marker);canvas.append(defs);
        for (const [from,to] of g.edges) {
            const a=positions.get(from), b=positions.get(to);
            const edge=edgeGeometry(g,a,b);
            canvas.append(svg('path',{d:edge.path,fill:'none',stroke:'#658079','stroke-width':1.7,'marker-end':'url(#arrow)'}));
            if(edge.label)canvas.append(shapeLabel(svg,edge));
        }
        for (const n of g.nodes) {
            if (!symbols.has(n.symbol) || !Number.isFinite(n.x) || !Number.isFinite(n.y)) throw Error('Invalid operator');
            const tile=svg('g',{transform:`translate(${n.x} ${n.y})`});
            if (graphs.has(n.child) && !history.includes(n.child)) {
                tile.setAttribute('role','button');tile.setAttribute('tabindex','0');tile.setAttribute('aria-label','Explore '+n.label);
                tile.append(svg('rect',{x:-25,y:-25,width:50,height:50,rx:6,fill:'white',stroke:'#647973','stroke-dasharray':'2 3'}));
                tile.onclick=()=>enter(n);
                tile.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();tile.onclick();}};
            }
            if (!tile.onclick) {
                tile.setAttribute('tabindex','0');tile.setAttribute('role','button');tile.setAttribute('aria-label','Inspect '+n.label);
                tile.setAttribute('aria-pressed','false');
                tile.onclick=()=>{
                    for(const other of canvas.querySelectorAll('[aria-pressed]'))other.setAttribute('aria-pressed','false');
                    tile.setAttribute('aria-pressed','true');
                    nodeReference(document.querySelector('[data-reference]'),g,n);
                };
                tile.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();tile.onclick();}};
            }
            tile.append(svg('image',{href:symbols.get(n.symbol),x:-20,y:-20,width:40,height:40}));
            parameterMark(svg,tile,n.parameters);
            const label=svg('text',{y:41,'text-anchor':'middle','font-size':13});label.textContent=n.label;
            tile.append(label);canvas.append(tile);
        }
        canvas.style.minWidth=(g.width || 690)+'px';
        document.querySelector('#drawing').replaceChildren(canvas);
        document.querySelector('#title').textContent=g.title+(g.phase?' · '+g.phase:'');
        document.querySelector('#caption').textContent=g.description+(g.nodes.some(n=>graphs.has(n.child))?' Select a dotted tile to explore inside.':'');
        hierarchy(document.querySelector('[data-hierarchy]'),graphs,history,names,jump,enter);
        graphReference(document.querySelector('[data-reference]'),g);
        back.hidden=history.length===1;
    }
    back.onclick=()=>{jump(history.length-2);document.querySelector('#drawing [role=button]')?.focus();};
    render();
    const initialNode=graphs.get(history[0]).nodes.find(n=>n.id===params.get('node'));
    if(initialNode)nodeReference(document.querySelector('[data-reference]'),graphs.get(history[0]),initialNode);
}
// Shared links on the same document can switch the graph or embedded draft.
window.addEventListener('hashchange', () => location.reload());
start().catch(error=>{
    const caption=document.querySelector('#caption');
    caption.textContent='Could not load this diagram. '+error.message+' ';
    const retry=document.createElement('button');
    retry.type='button';retry.textContent='Retry';retry.onclick=()=>location.reload();
    caption.append(retry);
});
