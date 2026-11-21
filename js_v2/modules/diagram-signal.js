// Small deterministic examples. Direct Fourier sums keep the plotted math inspectable.
const tau=2*Math.PI;
const seq=(n,fn)=>Array.from({length:n},(_,i)=>fn(i));
const hann=(i,n)=>(1-Math.cos(tau*i/n))/2;
const tone=(i,f)=>Math.sin(tau*i*f/1024);
function transform(row,k){
    let re=0, im=0;
    row.forEach((v,i)=>{const a=tau*i*k/row.length;re+=v*Math.cos(a);im-=v*Math.sin(a);});
    return [re,im];
}
const spectrum=row=>seq(row.length/2+1,k=>Math.hypot(...transform(row,k))/row.length);
const frequency=['Tone frequency',32,320,8,96,'Hz'];
const frame=['Frame length',16,96,8,64,'samples'];
const hop=['Hop',4,64,4,16,'samples'];
function gridDFT(rows){
    const n=rows.length;
    const horizontal=rows.map(row=>seq(n,k=>transform(row,k)));
    return seq(n,y=>seq(n,x=>{
        let re=0,im=0;
        for(let j=0;j<n;j++){
            const [a,b]=horizontal[j][(x+n/2)%n], angle=tau*j*((y+n/2)%n)/n;
            re+=a*Math.cos(angle)+b*Math.sin(angle);im+=b*Math.cos(angle)-a*Math.sin(angle);
        }
        return Math.hypot(re,im)/(n*n);
    }));
}
const modes={
 window:['Window a frame','A window is a set of sample weights. A Hann taper softens both edges before a Fourier transform.',[frequency,frame,['Frame start',0,96,1,20,'samples']],([f,n,start])=>{
    const samples=seq(n,i=>tone(i+start,f)),w=seq(n,i=>hann(i,n));
    return [line('Input samples',samples),line('Hann weights',w,0,1),line('Input × window',samples.map((v,i)=>v*w[i])), 'At 1,024 samples/s this frame spans '+(1000*n/1024).toFixed(1)+' ms.'];
 }],
 dft:['1D Fourier transform','One windowed frame becomes a set of frequency bins. An FFT computes the same discrete Fourier transform more efficiently.',[frequency,frame],([f,n])=>{
    const x=seq(n,i=>tone(i,f)*hann(i,n));return [line('Windowed frame',x),line('Magnitude · 0 to 512 Hz',spectrum(x),0,.3),'Bin spacing = sample rate ÷ frame length = '+(1024/n).toFixed(1)+' Hz. Try a tone between bins.'];
 }],
 stft:['Short-time Fourier transform','Move the window across the signal and compute a spectrum at each stop. One column is one frame; frequency increases upwards.',[frame,hop,['Frequency after midpoint',96,384,16,256,'Hz']],([n,h,f])=>{
    const x=seq(384,i=>i<192?tone(i,64):tone(i-192,f));
    const cols=seq(1+Math.floor((x.length-n)/h),j=>spectrum(seq(n,i=>x[j*h+i]*hann(i,n))));
    const rows=seq(cols[0].length,k=>cols.map(c=>Math.max(0,1+20*Math.log10(Math.max(c[c.length-1-k],1e-8)/.25)/60)));
    return [line('Signal · 0 to 375 ms',x),heat('Spectrogram · 0–512 Hz, time →',rows),cols.length+' frames. A smaller hop places columns closer together; a longer window narrows the frequency bins. Brightness spans 60 dB.'];
 }],
 mel:['Mel filter bank','A filter pools several Fourier power bins into one energy value. Move across bands to see the weights change.',[frequency,['Mel band',1,12,1,4,'of 12']],([f,b])=>{
    const n=128,power=spectrum(seq(n,i=>tone(i,f)*hann(i,n))).map(v=>v*v);
    const edges=seq(14,i=>700*((1+512/700)**(i/13)-1));
    const weights=power.map((_,k)=>Math.max(0,Math.min((k*8-edges[b-1])/(edges[b]-edges[b-1]),(edges[b+1]-k*8)/(edges[b+1]-edges[b]))));
    const energy=weights.reduce((s,v,i)=>s+v*power[i],0);
    return [line('Input power · 0 to 512 Hz',power,0,.07),line('Selected band weights · same frequency axis',weights,0,1),'Weighted energy: '+energy.toPrecision(3)+'. Teaching bank: 12 unnormalized HTK-Mel triangles. Whisper uses its configured filter bank.'];
 }],
 ola:['Overlap-add reconstruction','An inverse Fourier transform returns each frame to time samples. This example starts with those samples and isolates the window and overlap step.',[hop],([h])=>{
    const n=64,count=256,sum=Array(count).fill(0),env=Array(count).fill(0);
    for(let start=0;start<=count-n;start+=h)for(let i=0;i<n;i++){
        const w=hann(i,n)**2;env[start+i]+=w;sum[start+i]+=tone(start+i,48)*w;
    }
    const restored=sum.map((v,i)=>env[i]>1e-10?v/env[i]:0);
    return [line('Overlap envelope · sum of squared windows',env,0,Math.max(1,...env)),line('Normalized output',restored),'64-sample frames, '+h+'-sample spacing. '+env.filter(v=>v<=1e-10).length+' samples have no window support and are shown as zero. Ming’s actual decoder uses 3,528 and 882.'];
 }],
 conv1d:['1D convolution','Slide a normalized box filter across a noisy step and sum the weighted neighbors. Wider kernels smooth more samples together.',[['Kernel radius',0,12,1,2,'samples']],([r])=>{
    const x=seq(100,i=>(i<50?-.45:.45)+.25*Math.sin(i*1.7));
    const y=x.map((_,i)=>seq(2*r+1,j=>x[Math.min(99,Math.max(0,i+r-j))]).reduce((a,b)=>a+b,0)/(2*r+1));
    return [line('Input signal',x),line('Filtered signal',y),(2*r+1)+' equal taps, replicated endpoints. Radius zero gives the input back.'];
 }],
 conv2d:['2D convolution','The same weighted sum can slide across rows and columns. Watch the boundary spread as the square kernel widens.',[['Kernel radius',0,5,1,1,'pixels']],([r])=>{
    const n=24,x=seq(n,y=>seq(n,i=>i>5&&i<17&&y>5&&y<18?1:0));
    const y=x.map((row,j)=>row.map((_,i)=>{
        let sum=0;for(let v=-r;v<=r;v++)for(let u=-r;u<=r;u++)sum+=x[j-v]?.[i-u]||0;
        return sum/(2*r+1)**2;
    }));
    return [heat('Input image',x),heat('Filtered image',y),(2*r+1)+' × '+(2*r+1)+' equal taps; zero padding outside the image.'];
 }],
 dft2d:['2D Fourier transform','Transform across the rows, then down the columns. A cosine grating produces two symmetric peaks around the zero-frequency center.',[['Horizontal frequency',0,7,1,3,'cycles/image'],['Vertical frequency',0,7,1,1,'cycles/image']],([u,v])=>{
    const n=24,x=seq(n,y=>seq(n,i=>Math.cos(tau*(u*i+v*y)/n)));
    return [heat('Spatial pattern',x.map(row=>row.map(a=>(a+1)/2))),heat('Fourier magnitude · zero centered',gridDFT(x).map(row=>row.map(a=>Math.min(1,2*a)))), 'Frequency offsets: ('+u+', '+v+') and ('+(-u)+', '+(-v)+'). Set both to zero for a constant image.'];
 }]
};
const ns='http://www.w3.org/2000/svg';
function element(tag,text){const n=document.createElement(tag);if(text)n.textContent=text;return n;}
function svg(tag,attrs){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;}
function line(title,values,lo=-1,hi=1){return {title,values,lo,hi};}
function heat(title,rows){return {title,rows};}
function plot(data){
    const fig=element('figure');fig.append(element('figcaption',data.title));
    if(data.rows){
        const canvas=element('canvas'),rows=data.rows;
        canvas.width=rows[0].length;canvas.height=rows.length;
        const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(canvas.width,canvas.height);
        rows.flat().forEach((v,i)=>{v=Math.min(1,Math.max(v,0));pixels.data.set([25+205*v,53+145*v,64+42*v,255],4*i);});
        ctx.putImageData(pixels,0,0);canvas.setAttribute('role','img');canvas.setAttribute('aria-label',data.title);
        canvas.className=rows.length===rows[0].length?'signal-grid':'signal-spectrum';fig.append(canvas);
    }else{
        const y=v=>54-48*(v-data.lo)/(data.hi-data.lo),w=300;
        const chart=svg('svg',{viewBox:'0 0 300 60',role:'img','aria-label':data.title});
        chart.append(svg('path',{d:'M0 '+y(0)+'H300',stroke:'#cadad6'}));
        const points=data.values.map((v,i)=>[w*i/(data.values.length-1),y(v)].join(',')).join(' ');
        chart.append(svg('polyline',{points,fill:'none',stroke:'#287468','stroke-width':1.8}));fig.append(chart);
    }
    return fig;
}
export function signalLab(container,initial='window'){
    if(!Object.hasOwn(modes,initial))return;
    const section=element('section');section.className='signal-lab';
    const picker=element('label','Explore a function '),select=element('select');
    for(const [key,[title]] of Object.entries(modes))select.add(new Option(title,key));
    select.value=initial;picker.append(select);
    const body=element('div');section.append(picker,body);container.append(section);
    function activate(){
        const [,description,fields,calculate]=modes[select.value];
        const controls=element('div'),charts=element('div'),note=element('p');
        charts.className='signal-panels';
        const values=fields.map(f=>f[4]);
        function draw(){const results=calculate(values);note.textContent=results.pop();charts.replaceChildren(...results.map(plot));}
        fields.forEach(([name,min,max,step,start,unit],idx)=>{
            const input=element('input'),label=element('label'),value=element('output');
            input.type='range';Object.assign(input,{min,max,step,value:start});
            input.setAttribute('aria-label',name);label.append(element('span',name),value,input);
            function update(){values[idx]=Number(input.value);value.textContent=input.value+' '+unit;input.setAttribute('aria-valuetext',value.textContent);}
            input.oninput=()=>{update();draw();};update();controls.append(label);
        });
        controls.className='signal-controls';body.replaceChildren(element('p',description),controls,charts,note);draw();
    }
    select.onchange=activate;activate();
}
