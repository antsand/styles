/** Small display lexer, not a parser. No dependencies or code execution.
 * Every source character survives. Unknown languages remain escaped plain text.
 * Nested interpolation/heredocs are intentionally not parsed as sublanguages.
 */
const sets = {
 math: '', output: '', json: 'true false null',
 python: 'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield',
 c: 'auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while _Bool _Complex _Atomic',
 php: 'abstract and array as break callable case catch class clone const continue declare default die do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval exit extends final finally fn for foreach function global goto if implements include include_once instanceof interface isset list match namespace new null or print private protected public readonly require require_once return static switch throw trait try unset use var while xor yield true false',
 bash: 'if then else elif fi for while until do done case esac in function select time coproc'
};
const keywords=Object.fromEntries(Object.entries(sets).map(([k,v])=>[k,new Set(v.split(' '))]));
const builtins=new Set('print len range enumerate zip int float str list dict set tuple bool sum min max abs round open super isinstance type torch printf malloc free memcpy sizeof echo cd export source read set unset local declare readonly exec exit test pwd return'.split(' '));
export const escapeCode = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function normalizeCodeLanguage(value='') {
 const aliases={py:'python',python:'python',c:'c',h:'c',php:'php',bash:'bash',sh:'bash',shell:'bash',shellscript:'bash',math:'math',equations:'math',output:'output',console:'output',json:'json'};
 return aliases[String(value).trim().toLowerCase()] || null;
}
export function highlightCode(source, language) {
 const lang=normalizeCodeLanguage(language);
 if(!lang || source.length>200000) return escapeCode(source);
 // Sticky matching avoids skipping unknown characters, including Unicode.
 const string=lang==='python' ? /(?:[rRuUbBfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/y : /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/y;
 const rules=[];
 if(lang==='c'||lang==='php') rules.push(['cmt',/\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\r\n]*/y]);
 if(lang!=='c') rules.push(['cmt',/#[^\r\n]*/y]);
 if(lang==='c') rules.push(['kw',/#[ \t]*[a-zA-Z_]\w*/y]);
 if(lang==='php') rules.unshift(['kw',/<\?(?:php|=)?|\?>/y]);
 rules.push(['str',string]);
 if(lang==='math'||lang==='output') {
  rules.push(['kw',/(?:∇[A-Za-z]+|d[A-Z][A-Za-z]*|[∂δΔ])/y]);
  rules.push(['op',/[ᵀ⊙×−→←√Σ]/y]);
  rules.push(['attr',/[α-ωΑ-Ω₀-₉]+/y]);
 }

 if(lang==='bash'||lang==='php') rules.push(['attr',/\$(?:\{[^}\r\n]*\}|[a-zA-Z_]\w*|[0-9@*#?$!_-])/y]);
 rules.push(['num',/\b(?:0[xX][\da-fA-F]+|0[bB][01]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?)[uUlLfF]*\b/y]);
 rules.push(['word',/[a-zA-Z_]\w*/y],['op',/[+*%=!<>|&~^:/@-]+/y]);
 if(lang==='json') {
  // JSON keys are quoted strings followed by a colon; never parse/evaluate values.
  rules.splice(0,rules.length,
   ['str',/"(?:\\[\s\S]|[^"\\])*"/y],
   ['num',/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
   ['word',/[a-zA-Z_]\w*/y],['op',/[{}\[\]:,]/y]);
 }
 let output='',i=0;
 while(i<source.length){let found=false;
  for(const [kind,rx] of rules){rx.lastIndex=i;const m=rx.exec(source);if(!m)continue;
   let token=kind;const text=m[0];
   if(kind==='word') token=keywords[lang].has(lang==='php'?text.toLowerCase():text)?'kw':builtins.has(text)||/^\s*\(/.test(source.slice(i+text.length))?'fn':null;
   if(kind==='word' && lang==='math') token=/^[A-Z]+$/.test(text)||/^\s*\(/.test(source.slice(i+text.length))?'fn':'var';
   if(kind==='word' && lang==='output') token=/^(?:PASS|FAIL|True|False)$/.test(text)?'kw':/^(?:loss|before|after|Step)$/.test(text)?'fn':/^[ABWX]$/.test(text)?'attr':null;
   if(lang==='json' && kind==='str' && /^\s*:/.test(source.slice(i+text.length))) token='fn';
   if(lang==='json' && kind==='word') token=keywords.json.has(text)?'kw':null;
   output+=token?`<span class="syn-${token}">${escapeCode(text)}</span>`:escapeCode(text);i+=text.length;found=true;break;
  }
  if(!found){output+=escapeCode(source[i]);i++;}
 }
 return output;
}
export const highlightPython = source => highlightCode(source,'python');
