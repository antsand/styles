// Accessible native MathML for the fixed teaching equations in diagram cards.
function m(type,...children) {
    const el=document.createElementNS('http://www.w3.org/1998/Math/MathML',type);
    el.append(...children);
    return el;
}
const sym=s=>m('mi',s);
const op=s=>m('mo',s);
const trans=s=>m('msup',sym(s),m('mi','T'));
const partial=s=>m('mfrac',m('mrow',op('∂'),sym('L')),m('mrow',op('∂'),sym(s)));
const eq=(lhs,...rhs)=>m('math',lhs,op('='),...rhs);
const indexed=(s,i)=>m('msub',sym(s),sym(i));
const sum=()=>m('munder',op('∑'),sym('j'));
export function projectionMath(input,weight,output,frozen) {
    const back=[eq(sym('G'),partial(output)),eq(partial(input),sym('G'),sym(weight))];
    if(!frozen)back.push(eq(partial(weight),trans('G'),sym(input)));
    return {forward:[eq(sym(output),sym(input),trans(weight))],back};
}
export function attentionMath(kind) {
    if(kind==='scores')return {forward:[eq(sym('S'),sym('Q'),trans('K'))],back:[eq(sym('G'),partial('S')),eq(partial('Q'),sym('G'),sym('K')),eq(partial('K'),trans('G'),sym('Q'))]};
    if(kind==='out')return {forward:[eq(sym('C'),sym('A'),sym('V'))],back:[eq(sym('G'),partial('C')),eq(partial('A'),sym('G'),trans('V')),eq(partial('V'),trans('A'),sym('G'))]};
    const exp=i=>m('msup',sym('e'),m('mrow',indexed('z',i),op('−'),sym('m')));
    return {forward:[eq(sym('m'),m('munder',m('mi','max'),sym('j')),indexed('z','j')),eq(indexed('a','i'),m('mfrac',exp('i'),m('mrow',sum(),exp('j'))))],back:[eq(sym('c'),sum(),indexed('a','j'),indexed('g','j')),eq(m('mfrac',m('mrow',op('∂'),sym('L')),m('mrow',op('∂'),indexed('z','i'))),indexed('a','i'),op('('),indexed('g','i'),op('−'),sym('c'),op(')'))]};
}
