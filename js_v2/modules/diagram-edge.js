// Shared graph coordinates for the authoring canvas and embedded reader.
export function edgeGeometry(graph, a, b) {
    const key = a.id + ':' + b.id;
    const side = a.x <= b.x ? 1 : -1;
    const mid = (a.x + b.x) / 2;
    const bypass = graph.bypass?.includes(key);
    return {
        path: bypass ? `M${a.x} ${a.y-24} Q${mid} -45 ${b.x} ${b.y-24}` :
            `M${a.x+23*side} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${b.x-24*side} ${b.y}`,
        x:mid, y:bypass?15:(a.y+b.y)/2-9, label:graph.shapes?.[key]
    };
}
export function shapeLabel(svg, edge) {
    const text=svg('text',{x:edge.x,y:edge.y,'text-anchor':'middle','font-size':10,fill:'#526674',stroke:'white','stroke-width':3,'paint-order':'stroke','marker-end':'none'});
    text.textContent=edge.label;
    return text;
}

// A composite can contain both learned projections and fixed arithmetic.
export function parameterMark(svg, tile, kind) {
    if (!['learned','fixed'].includes(kind)) return;
    const learned = kind === 'learned';
    const mark = svg('g', {transform:'translate(22 -22)', 'pointer-events':'none'});
    const title = svg('title', {});
    title.textContent = learned ? 'Contains learned parameters' : 'No learned parameters';
    const disc = svg('circle', {r:8,fill:learned?'#85621c':'#516763',stroke:'white'});
    const letter = svg('text', {y:3,'text-anchor':'middle','font-size':9,'font-weight':700,fill:'white'});
    letter.textContent = learned ? 'W' : 'ƒ';
    mark.append(title,disc,letter);
    tile.append(mark);
}
