// Editorial cross-references shared by the diagram reader and the CKE map browser.
const articles = {
    matrix: ['5943/Prefill-vs-Decode-in-CKE-Why-One-Model-Needs-GEMM-GEMV-and-Two-Execution-Plans','Why prefill uses GEMM and decode often uses GEMV'],
    softmax: ['5898/Softmax-The-Probability-Engine','How softmax turns scores into probabilities'],
    attention: ['5903/Attention-The-Core-Of-The-Transformer','How queries, keys and values form attention'],
    lora: ['6014/LoRA-QLoRA-Inside-the-Update','Where the low-rank update enters the projection']
};
export function addReading(container, ...keys) {
    const matches = keys.map(key => {
        if (/gem[mv]|^(matmul|linear|[qkv]proj|outputproj|prefill|decode)$/.test(key)) return 'matrix';
        if (/softmax/.test(key)) return 'softmax';
        if (/attention/.test(key)) return 'attention';
        if (key === 'lora') return 'lora';
    });
    const topic = matches.find(Boolean);
    if (!topic) return;
    const [path,title] = articles[topic];
    const link = document.createElement('a'), label = document.createElement('small');
    label.textContent = 'Read on ShivasNotes';
    link.className = 'diagram-reading';
    link.href = 'https://www.shivasnotes.com/blog/'+path;
    link.target = '_blank'; link.rel = 'noopener';
    link.append(label,document.createTextNode(title+' ↗'));
    container.append(link);
}
