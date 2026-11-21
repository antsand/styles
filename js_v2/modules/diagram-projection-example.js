// Logical tensor shapes for a small dense projection, independent of kernel dispatch.
function matrix(name, rows, columns, color) {
    const figure = document.createElement('figure');
    const label = document.createElement('figcaption');
    label.textContent = name + ' · ' + rows + ' × ' + columns;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 64 64');
    svg.setAttribute('aria-hidden','true');
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElementNS(ns,'rect');
            cell.setAttribute('x', String((64-columns*10)/2+col*10));
            cell.setAttribute('y', String((64-rows*10)/2+row*10));
            cell.setAttribute('width','8'); cell.setAttribute('height','8');
            cell.setAttribute('rx','1.4'); cell.setAttribute('fill',color);
            svg.append(cell);
        }
    }
    figure.append(svg,label);
    return figure;
}

export function projectionExample(container, initialDecode = false) {
    const card = document.createElement('section');
    card.className = 'projection-example';
    const title = document.createElement('h4');
    title.textContent = 'One projection, two token counts';
    const controls = document.createElement('div');
    controls.setAttribute('role','group'); controls.setAttribute('aria-label','Projection example');
    const expression = document.createElement('div');
    expression.className = 'projection-expression';
    const explanation = document.createElement('p');
    explanation.setAttribute('aria-live','polite');
    function select(decode) {
        const rows = decode ? 1 : 4;
        expression.replaceChildren(matrix('X',rows,6,'#4c8077'),'×',matrix('Wᵀ',6,3,'#7b82a1'),'=',matrix('Y',rows,3,'#aa7049'));
        explanation.textContent = decode
            ? 'Decode one token for one sequence. Its six features produce three outputs. With one input row, the projection can use a matrix–vector kernel (GEMV). Batched decode can use GEMM.'
            : 'Prefill four tokens together. Each row has six features and uses the same weights to produce three outputs. The four rows form one matrix–matrix product (GEMM).';
        [...controls.children].forEach((button,i) => button.setAttribute('aria-pressed',String(Boolean(i) === decode)));
    }
    for (const [idx,text] of ['Prefill · 4 tokens','Decode · 1 token'].entries()) {
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = text;
        button.onclick = () => select(Boolean(idx)); controls.append(button);
    }
    card.append(title,controls,expression,explanation);
    select(initialDecode);
    container.append(card);
}
