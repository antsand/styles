// Row-major 2 × 2 matrices. Float64 teaching arithmetic.
function multiply([a,b,c,d],[e,f,g,h]) {
    return [a*e+b*g,a*f+b*h,c*e+d*g,c*f+d*h];
}
function orthogonalize(momentum) {
    const norm=Math.hypot(...momentum);
    if (!norm) return [0,0,0,0];
    let x=momentum.map(v=>v/(norm+1e-7));
    for(let i=0;i<5;i++){
        const a=multiply(x,[x[0],x[2],x[1],x[3]]);
        const aa=multiply(a,a);
        const correction=multiply(a.map((v,k)=>-4.775*v+2.0315*aa[k]),x);
        x=x.map((v,k)=>3.4445*v+correction[k]);
    }
    return x;
}
function el(tag,text){
    const node=document.createElement(tag);
    if(text)node.textContent=text;
    return node;
}
export function optimizerLab(container){
    const lab=el('section');lab.className='optimizer-lab';
    lab.append(el('h3','Try one update'),el('p','Two training examples, X = I₂. The starting weights are [[1, 0], [0, 1]]. Change the first target: the prediction error changes the gradient before any optimizer sees it.'));
    const controls=el('div');controls.className='optimizer-controls';lab.append(controls);
    function slider(name,min,max,step,value){
        const label=el('label',name+' '), output=el('output'), range=el('input');
        range.type='range';Object.assign(range,{min,max,step,value});range.setAttribute('aria-label',name);
        label.append(output,range);controls.append(label);
        range.oninput=()=>{output.textContent=range.value;draw();};output.textContent=value;
        return range;
    }
    const target=slider('First target',-2,3,0.1,0),rate=slider('Learning rate',0,0.5,0.01,0.1);
    const history=el('input');history.type='checkbox';history.checked=true;
    const toggle=el('label');toggle.append(history,document.createTextNode(' Include one previous gradient'));controls.append(toggle);
    history.onchange=draw;
    const grid=el('div');grid.className='optimizer-grid';lab.append(grid);
    lab.append(el('p','History replays G₁ = [[0, 1], [−1, 0]] into initially zero buffers. All branches start this step at the same W. AdamW uses β₁ = 0.9, β₂ = 0.999 and ε = 10⁻⁸. Muon uses EMA momentum 0.9 and five quintic Newton–Schulz iterations, with Nesterov and optional shape scaling off. Weight decay is zero throughout to isolate the update direction.'));
    function matrix(parent,name,values){
        const box=el('div');box.className='optimizer-matrix';box.append(el('strong',name));
        const cells=el('div');cells.className='optimizer-cells';
        for(const value of values){const cell=el('span',(Math.abs(value)<0.0005?0:value).toFixed(3));cell.dataset.sign=value>0.0005?'plus':value< -0.0005?'minus':'zero';cells.append(cell);}
        box.append(cells);parent.append(box);
    }
    function draw(){
        const w=[1,0,0,1], y=[Number(target.value),0.5,0.25,-1],g=w.map((v,i)=>v-y[i]);
        const old=history.checked?[0,1,-1,0]:[0,0,0,0],t=history.checked?2:1;
        const m=g.map((v,i)=>0.9*0.1*old[i]+0.1*v);
        const v=g.map((x,i)=>0.999*0.001*old[i]**2+0.001*x*x);
        const adam=m.map((x,i)=>x/(1-0.9**t)/(Math.sqrt(v[i]/(1-0.999**t))+1e-8));
        grid.replaceChildren();
        const input=el('div');input.className='optimizer-card';input.append(el('h4','Shared backward pass'));matrix(input,'Target Y',y);matrix(input,'Gradient G = W − Y',g);grid.append(input);
        for(const [title,u] of [['SGD',g],['AdamW',adam],['Muon',orthogonalize(m)]]){
            const card=el('div');card.className='optimizer-card';card.append(el('h4',title));matrix(card,'Direction U',u);matrix(card,'W′ = W − ηU',w.map((x,i)=>x-Number(rate.value)*u[i]));grid.append(card);
        }
    }
    draw();container.append(lab);
}
