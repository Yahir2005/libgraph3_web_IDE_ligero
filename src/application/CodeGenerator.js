export class CodeGenerator {
    static generate(components) {
        if (components.length === 0) return '    // No hay componentes\n';
        let lines = [];

        components.forEach(comp => {
            const { x, y, width, height, text, type, command, varName, color, fontSize } = comp;
            const x1 = Math.round(x), y1 = Math.round(y);
            const x2 = Math.round(x + width), y2 = Math.round(y + height);

            switch (type) {
                case 'boton':
                    lines.push(`    if (button(${x1}, ${y1}, ${x2}, ${y2}, "${text}")) {`);
                    if (command) {
                        command.split('\n').forEach(cmd => lines.push(`        ${cmd}`));
                    } else {
                        lines.push(`        setcolor(YELLOW);\n        outtextxy(${x1}, ${y2 + 10}, "Click!");`);
                    }
                    lines.push(`    }`);
                    break;
                case 'campo':
                    lines.push(`    setfillstyle(SOLID_FILL, ${color === 'WHITE' ? 'WHITE' : color});`);
                    lines.push(`    bar(${x1}, ${y1}, ${x2}, ${y2});`);
                    lines.push(`    setcolor(BLACK);\n    rectangle(${x1}, ${y1}, ${x2}, ${y2});`);
                    lines.push(`    outtextxy(${x1 + 6}, ${y1 + 12}, "${text}");`);
                    break;
                case 'texto':
                    lines.push(`    setcolor(${color});\n    settextstyle(DEFAULT_FONT, HORIZ_DIR, ${fontSize});`);
                    lines.push(`    outtextxy(${x1}, ${y1}, "${text}");`);
                    break;
                case 'rectangulo':
                    lines.push(`    setcolor(${color});\n    rectangle(${x1}, ${y1}, ${x2}, ${y2});`);
                    break;
                case 'circulo':
                    const r = Math.round(width / 2);
                    lines.push(`    setcolor(${color});\n    circle(${x1 + r}, ${y1 + Math.round(height / 2)}, ${r});`);
                    break;
                case 'linea':
                    lines.push(`    setcolor(${color});\n    line(${x1}, ${y1}, ${x2}, ${y2});`);
                    break;
                case 'pixel':
                    lines.push(`    putpixel(${x1}, ${y1}, ${color});`);
                    break;
            }
            lines.push('');
        });

        return lines.join('\n');
    }
}