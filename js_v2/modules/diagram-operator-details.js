import {projectionMath,attentionMath} from './diagram-math.js';
// Shapes below describe one example and one attention head; batch dimensions are omitted.
const kernelRoot='https://github.com/C-Kernel-Engine/C-Kernel-Engine/blob/bda8edbf125134ab9271c16c97c2e420df0677b4/src/kernels/';
const products=[
    ['Forward dot product','gemm_kernels.c#L206'],
    ['Input gradient GEMM','gemm_kernels.c#L398'],
    ['Weight gradient GEMM','gemm_kernels.c#L687']
];
function projection(name,meaning,input,rows,inner,outer,weight,output,frozen=false) {
    return {math:projectionMath(input,weight,output,frozen), gradientNote:frozen?'The base weight stays fixed.':`The weight gradient accumulates contributions across ${rows} token rows.`,meaning,inputs:`${input} [${rows}, ${inner}] · ${weight} [${outer}, ${inner}]`,output:`${output} [${rows}, ${outer}]`,
        forward:`${output} = ${input} ${weight}ᵀ`,
        reduction:`Each output entry sums ${inner} products along the input-feature axis.`,
        backward:`Given G = ∂L/∂${output}:  ∂L/∂${input} = G ${weight}`+
            (frozen?`. The base weight ${weight} stays fixed.`:`  ·  ∂L/∂${weight} = Gᵀ ${input}. The weight gradient sums contributions across ${rows} token rows.`),
        sources:products};
}
function details(graph,node) {
    if(graph.id==='head' && ['q','k','v'].includes(node.id)) {
        const roles={q:'Each token produces a query that will be compared with every key.',k:'Each token produces a key. Its dot product with a query measures how strongly that query matches the token.',v:'Each token produces a value. Attention weights mix these values into the output.'};
        const letter=node.id.toUpperCase();
        return projection(letter,roles[node.id]+' Here T is the number of tokens; the displayed projection omits bias.','X','T','768','64','W'+node.id,letter);
    }
    if(graph.id==='lora') {
        if(node.id==='w')return projection('Base','The original projection contributes the frozen branch.','X','T','d','m','W','Y₀',true);
        if(node.id==='a')return projection('Down','For each token, learn r combinations of its d features.','X','T','d','r','A','H');
        if(node.id==='b')return projection('Up','Mix the r adapter features into m output features.','H','T','r','m','B','U');
    }
    const namedAttention=['attention','prefill','decode'].includes(graph.id);
    const q=graph.id==='decode'?'1':'T',k=graph.id==='decode'?'P+1':'T';
    if(node.symbol==='softmax')return {math:attentionMath('weights'),gradientNote:'Here g is the upstream gradient for one row. Compute its dot product with the probabilities once and reuse it for every logit.',meaning:'For each query, turn the valid key scores into weights that sum to one.',inputs:namedAttention && node.id==='weights'?`Scaled scores Z [${q}, ${k}]`:'One row of K logits',output:namedAttention && node.id==='weights'?`Weights A [${q}, ${k}]`:'K probabilities, summing to 1',
        forward:'m = maxⱼ zⱼ   ·   aᵢ = exp(zᵢ − m) / Σⱼ exp(zⱼ − m)',
        reduction:'Find the maximum, then sum the shifted exponentials across valid keys in each row.',
        backward:'For upstream row g, compute c = Σⱼ aⱼgⱼ once. Each logit receives ∂L/∂zᵢ = aᵢ(gᵢ − c).',
        sources:[['Causal row softmax','softmax_kernels.c#L144'],['Causal backward · SIMD row reduction','softmax_kernels.c#L382']]};
    if(!namedAttention)return;
    if(node.id==='scores')return {math:attentionMath('scores'),meaning:'Compare each query with each available key.',inputs:`Q [${q}, 64] · K [${k}, 64]`,output:`Scores S [${q}, ${k}]`,forward:'S = QKᵀ',reduction:'Each query–key pair reduces 64 feature products to one score.',backward:'Given G = ∂L/∂S:  ∂L/∂Q = GK  ·  ∂L/∂K = GᵀQ.',sources:products.slice(0,1)};
    if(node.id==='out')return {math:attentionMath('out'),meaning:'Use each attention row to mix the value vectors.',inputs:`A [${q}, ${k}] · V [${k}, 64]`,output:`Context C [${q}, 64]`,forward:'C = AV',reduction:'For each query and output feature, sum weighted values across key positions.',backward:'Given G = ∂L/∂C:  ∂L/∂A = GVᵀ  ·  ∂L/∂V = AᵀG.',sources:[['Matrix product','gemm_kernels.c#L398']]};
}
function tag(type,text) {
    const node=document.createElement(type);node.textContent=text;return node;
}
export function operatorDetails(container,graph,node) {
    const d=details(graph,node);
    if(!d)return false;
    const guide=container.querySelector('a');
    container.replaceChildren();
    container.classList.add('operator-detail');
    const heading=identity(node.symbol,node.label);
    const ports=document.createElement('dl');
    for(const [term,value] of [['Inputs',d.inputs],['Output',d.output]]) {
        const cell=document.createElement('div');cell.append(withIcon('dt',term),tag('dd',value));ports.append(cell);
    }
    const forward=mathSection('Forward pass',d.math.forward);
    const gradient=mathSection('Backward pass',d.math.back);
    if(d.gradientNote)gradient.append(tag('p',d.gradientNote));
    const sources=tag('div','');sources.className='kernel-sources';sources.append(withIcon('strong','Related CKE source'));
    for(const [label,path] of d.sources) {
        const link=tag('a',label+' ↗');link.href=kernelRoot+path;link.target='_blank';link.rel='noopener';sources.append(link);
    }
    container.append(heading,tag('p',d.meaning),ports,forward,section('Reduction',d.reduction),gradient);
    if(node.symbol==='softmax') {
        const example=section('One attention row','Scores [2, 1, 0] become [0, −1, −2] after subtracting the maximum. Exponentiate and divide by 1 + e⁻¹ + e⁻².');
        const bars=tag('div','');bars.className='diagram-probabilities';
        for(const [i,value] of [66.52,24.47,9.00].entries()){
            const row=tag('div','');const meter=document.createElement('meter');
            meter.min=0;meter.max=100;meter.value=value;meter.setAttribute('aria-label','Key '+(i+1));
            row.append(tag('span','Key '+(i+1)),meter,tag('code',value.toFixed(2)+'%'));bars.append(row);
        }
        example.append(bars);container.append(example,section('Inside the CKE causal backward kernel','Its AVX-512 branch accumulates 16 FP32 products per vector, reduces the lanes to one row dot product, then adds the scalar tail. A second pass applies aᵢ(gᵢ − c). This is one compiled implementation of the row derivative.'));
    }
    container.append(sources);
    if(guide)container.append(guide);
    return true;
}

function section(title,body,type='p') {
    const block=tag('section','');block.append(withIcon('h4',title),tag(type,body));return block;
}
const glyphs={
    Inputs:'M3 10h10m-4-4 4 4-4 4M16 4v12',
    Output:'M4 4v12m3-6h10m-4-4 4 4-4 4',
    'Forward pass':'M3 10h13m-5-5 5 5-5 5',
    Reduction:'M3 4l6 6-6 6m0-6h13m-3-3 3 3-3 3',
    'Backward pass':'M16 4v5a3 3 0 0 1-3 3H4m4-4-4 4 4 4',
    'Related CKE source':'M6 6l-4 4 4 4m8-8 4 4-4 4m-3-11-2 14',
    'One attention row':'M3 16V9m6 7V4m6 12v-5',
    'Inside the CKE causal backward kernel':'M5 5h10v10H5zM7 2v3m5-3v3M7 15v3m5-3v3M2 7h3m-3 5h3m10-5h3m-3 5h3'
};
function withIcon(type,title) {
    const heading=tag(type,title);
    const path=glyphs[title==='Outputs'?'Output':title];
    if(!path)return heading;
    const ns='http://www.w3.org/2000/svg';
    const icon=document.createElementNS(ns,'svg');
    icon.setAttribute('viewBox','0 0 20 20');icon.setAttribute('aria-hidden','true');
    icon.setAttribute('class','diagram-section-icon');
    const line=document.createElementNS(ns,'path');
    line.setAttribute('d',path);icon.append(line);heading.prepend(icon);
    return heading;
}
function mathSection(title,equations) {
    const block=tag('section','');
    block.append(withIcon('h4',title));
    const group=tag('div','');group.className='diagram-equations';
    group.append(...equations);block.append(group);
    return block;
}
function identity(symbol,title) {
    const header=tag('div','');header.className='diagram-identity';
    if (/^[a-z0-9_-]+$/.test(symbol)) {
        const icon=document.createElement('img');icon.src='/diagram-assets/ml/v1/'+symbol+'.svg';
        icon.alt='';icon.width=44;icon.height=44;header.append(icon);
    }
    header.append(tag('h3',title));return header;
}
export function graphSummary(container,graph,node=null) {
    const known={bert:['encoder','Token IDs [T]','Contextual states [T, 768]'],head:['head','Hidden states [T, 768]','Head context [T, 64]'],multi:['attention','Hidden states [T, 768]','Projected context [T, 768]'],block:['block','Hidden states [T, 768]','Updated states [T, 768]'],ffn:['mlp','Hidden states [T, 768]','Transformed states [T, 768]'],emb:['embedding','Token, position and segment IDs [T] each','Embeddings [T, 768]'],lora:['linear','Token features [T, d]','Adapted projection [T, m]'],attention:['attention','Q, K, V [T, 64] each','Context [T, 64]'],prefill:['attention','Q, K, V [T, 64] each','Context [T, 64]'],decode:['attention','Q [1, 64]; K, V [P+1, 64]','Context [1, 64]']};
    const spec=Object.hasOwn(known,graph.id)?known[graph.id]:null;
    const previous=[...container.children].filter(el=>el.matches('a,code'));
    const graphNodes=new Map(graph.nodes.map(n=>[n.id,n.label]));
    function connections(inbound) {
        return graph.edges.filter(e=>e[inbound?1:0]===node.id).map(([a,b])=>(graphNodes.get(inbound?a:b) || '')+(graph.shapes?.[a+':'+b]?' ['+graph.shapes[a+':'+b]+']':'')).join(' · ') || 'No connected port';
    }
    container.classList.add('operator-detail');
    container.replaceChildren(identity(node?.symbol || spec?.[0] || 'block',node?.label || graph.title));
    if(!node)container.append(tag('p',graph.description));
    const ports=tag('dl','');
    for(const [title,value] of [['Inputs',node?connections(true):graph.inputs || spec?.[1]],['Outputs',node?connections(false):graph.outputs || spec?.[2]]]){
        if(!value)continue;
        const cell=tag('div','');cell.append(withIcon('dt',title),tag('dd',value));ports.append(cell);
    }
    container.append(ports);
    if (!node && graph.nodes.length) {
        const outline=tag('details',''), list=tag('ul','');
        outline.className='diagram-outline';
        outline.append(tag('summary',graph.nodes.length+' nodes in this graph'));
        for (const item of graph.nodes) {
            const row=tag('li',''), icon=document.createElement('img');
            icon.src='/diagram-assets/ml/v1/'+encodeURIComponent(item.symbol)+'.svg';
            icon.width=22; icon.height=22; icon.alt='';
            row.append(icon,tag('span',item.label),tag('code',item.symbol));
            list.append(row);
        }
        outline.append(list); container.append(outline);
    }
    container.append(...previous);
}
