import {signalLab} from './diagram-signal.js';
import {projectionExample} from './diagram-projection-example.js';
import {addReading} from './diagram-reading.js';
import {operatorDetails,graphSummary} from './diagram-operator-details.js';
// Editorial references describe logical operations, independently of runtime dispatch.
const base = 'https://c-kernel-engine.github.io/C-Kernel-Engine/';
const attention = ['Attention mechanisms','concepts.html#attention','Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V'];
const projection = ['GEMM memory layout','gemm-memory-layout.html','Y = XWᵀ for a projection with weights stored as [out, in].'];
const architecture = ['Transformer architecture','concepts.html#architecture'];
const activation = ['Activation functions','concepts.html#activations'];
const norm = ['Normalization','concepts.html#normalization'];
const lora = ['LoRA graph authoring','v8-clef-decision-head.html#lora-fp32-authoring','Y = XWᵀ + (α/r)(XAᵀ)Bᵀ'];
const references = new Map(Object.entries({
    bert:architecture,block:architecture,encoder:architecture,multi:attention,head:attention,
    attention,selfattention:attention,prefill:attention,decode:attention,qproj:projection,kproj:projection,
    vproj:projection,outputproj:projection,matmul:projection,gemm:projection,linear:projection,
    gelu:activation,silu:activation,relu:activation,ffn:activation,rmsnorm:norm,layernorm:norm,
    lora,rope:['Rotary position embeddings','concepts.html#rope'],
    softmax:['Attention probabilities','concepts.html#attention','pᵢ = exp(zᵢ − max z) / Σⱼ exp(zⱼ − max z)'],
    moe:['Router and expert kernels','v8-moe-expert-kernels.html#moe-building-blocks'],
    map:['How to read a kernel map','kernel-maps.html#field-reference']
}));
function element(tag,text) {
    const el=document.createElement(tag);
    el.textContent=text;
    return el;
}
export function reference(container,key,caption) {
    container.replaceChildren();
    container.classList.remove('operator-detail');
    const entry=references.get(key);
    if (!entry) return;
    const [title,path,math]=entry;
    if(caption)container.append(element('strong',caption));
    if(math)container.append(element('code',math));
    const link=element('a',title+' ↗');
    link.href=base+path;link.target='_blank';link.rel='noopener';
    container.append(link);
}
const frontendNotes = {
    audio_wav_decode:['Read the RIFF/WAVE container, unpack signed 16-bit PCM samples and average the channels into a mono waveform. Each sample is an amplitude at one instant.','WAV bytes','Mono samples','wave','The height of the curve is amplitude. One cycle of a 440 Hz tone takes about 2.27 ms.'],
    audio_resample:['Place the waveform on the 16,000-sample-per-second grid used by Whisper. The circuit specifies windowed-sinc interpolation when the rates differ.','Mono samples at the source rate','Mono samples at 16 kHz'],
    audio_pad_or_truncate:['Fit the sample stream to the requested extent by keeping its prefix and filling unused positions with zeros.','Mono samples','Fixed-length samples'],
    audio_stft_tables:['Prepare the window and sinusoidal coefficients used to analyze many successive frames.','Transform settings','Reusable transform tables'],
    audio_stft:['Slide a 400-sample Hann window along the 16 kHz waveform, advancing 160 samples each time. Each frame spans 25 ms. Squaring the Fourier magnitudes gives power in bins spaced 40 Hz apart.','Windowed audio frames','Power by frequency bin and frame','spectrum','This frame contains two tones. Peaks at 440 and 1,200 Hz show where its energy sits.'],
    audio_mel_filters:['Build overlapping triangular filters that pool frequency bins into perceptual bands. Lower bands cover narrower frequency ranges.','Frequency-bin grid','Mel filter bank'],
    audio_log_mel:['For each frame, weight and sum the power bins in each Mel band. A logarithm compresses the energy range so quiet features remain visible alongside loud ones. Whisper then normalizes the log features.','Power spectrum and Mel filters','Log-Mel features by band and frame','mel','Each column is one frame. The higher stripe appears halfway through when the second tone joins. Brighter colors mean more energy.'],
    audio_feature_window:['Select the feature frames for an encoder window and zero-pad the tail when needed. Windowing keeps a long recording aligned with the encoder input.','Normalized log-Mel frames','Encoder feature window']
};
export function whisperNote(container, op) {
    const note=Object.hasOwn(frontendNotes,op) && frontendNotes[op];
    if(!note)return false;
    const [meaning,input,output,plot,caption]=note;
    container.append(element('p',meaning),element('code',input+' → '+output));
    if(plot){
        const fig=element('figure',''), img=document.createElement('img');
        img.src='/diagram-assets/cke/whisper-'+plot+'.svg';
        img.alt=caption; img.style.cssText='display:block;width:100%;max-width:34rem;height:auto';
        fig.style.margin='.6rem 0';
        fig.append(img,element('figcaption','Synthetic two-tone example. '+caption));
        container.append(fig);
    }
    const labs={audio_stft:'stft',audio_log_mel:'mel',audio_mel_filters:'mel',audio_stft_tables:'window'};
    if(labs[op])signalLab(container,labs[op]);
    const article=element('a','How audio becomes words · ShivasNotes ↗');
    article.href='https://www.shivasnotes.com/blog/5973/How-Audio-Becomes-Words-Whisper-s-Kernels-Step-By-Step-On-A-CPU';
    container.append(article);
    const circuit=element('a','Whisper frontend circuit · CKE ↗');
    circuit.href='https://github.com/C-Kernel-Engine/C-Kernel-Engine/blob/e61edf9a3262ce28c962bf719d9b48f361ac3b9d/version/v8/circuits/whisper_audio_frontend.json';
    container.append(circuit);
    return true;
}

export function nodeReference(container,graph,node) {
    renderNodeReference(container,graph,node);
    const insertBefore = container.children[1] || null;
    for (const [kind, entry] of [['Semantic role',node.semanticRole],['Operation',node.operationDefinition]]) {
        if (typeof entry?.name !== 'string' || typeof entry.definition !== 'string') continue;
        const section=element('section','');
        section.append(element('h4',kind+': '+entry.name),element('p',entry.definition));
        container.insertBefore(section,insertBefore);
    }
}

function renderNodeReference(container,graph,node) {
    if(graph.id==='whisper-stage-1' && Object.hasOwn(frontendNotes,node.semanticOp)){
        container.classList.add('operator-detail');
        container.replaceChildren(element('h3',node.label));
        whisperNote(container,node.semanticOp);
        return;
    }
    if(graph.id==='signal' || ['window','dft','stft','mel','ola','conv1d','conv2d','dft2d'].includes(node.symbol)){
        container.classList.add('operator-detail');container.replaceChildren(element('h3',node.label));
        signalLab(container,node.symbol);return;
    }
    const key=graph.id==='lora' ? 'lora' : node.symbol;
    reference(container,node.operation && key==='block'?'map':key,node.label);
    if (operatorDetails(container,graph,node)) {
        if (graph.id==='head' && ['q','k','v'].includes(node.id)) projectionExample(container);
        addReading(container,key,node.symbol);
        return;
    }
    if (!container.childElementCount) container.append(element('strong',node.label),element('span','Operator: '+node.symbol));
    if (graph.id==='lora') {
        const formulas={x:'X ∈ ℝᵀˣᵈ',w:'Base output = XWᵀ',a:'H = XAᵀ   ·   [T, d] → [T, r]',b:'U = HBᵀ   ·   [T, r] → [T, m]',scale:'Adapter update = (α/r) U',add:'Y = XWᵀ + (α/r) U'};
        if(formulas[node.id])container.querySelector('code').textContent=formulas[node.id];
    }
    graphSummary(container,graph,node);
    if(graph.id==='ming3' && ['vae','out'].includes(node.id))signalLab(container,'ola');
    if(node.resultDescription)container.append(element('p',node.resultDescription));
    addReading(container,key,node.symbol);
}
export function graphReference(container,graph) {
    reference(container,graph.id,graph.title);
    graphSummary(container,graph);
    if(graph.id==='signal')signalLab(container,'window');
    if (['prefill','decode'].includes(graph.id)) projectionExample(container,graph.id==='decode');
    addReading(container,graph.id);
}
export function hierarchy(container,graphs,ids,names,jump,enter) {
    container.replaceChildren();
    const trail=element('div','');trail.className='diagram-trail';
    ids.forEach((id,i)=>{
        if(i)trail.append(element('span',' › '));
        const label=names[i] || graphs.get(id).title;
        if(i===ids.length-1)trail.append(element('strong',label));
        else {
            const link=element('button',label);
            link.type='button';link.onclick=()=>jump(i);trail.append(link);
        }
    });
    container.append(trail);
    const g=graphs.get(ids.at(-1));
    const groups=new Map();
    for(const n of g.nodes) {
        if(!graphs.has(n.child)||ids.includes(n.child))continue;
        if(!groups.has(n.child))groups.set(n.child,[]);
        groups.get(n.child).push(n);
    }
    if(!groups.size)return;
    const strip=element('div','');strip.className='diagram-parts';
    for(const nodes of groups.values()){
        const n=nodes[0];
        const button=element('button',nodes.length>1?n.label+' – '+nodes.at(-1).label+' · shared layout':n.label);
        button.type='button';button.onclick=()=>enter(n);
        strip.append(button);
    }
    container.append(strip);
}
