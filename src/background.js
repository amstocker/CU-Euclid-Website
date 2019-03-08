import React from 'react';
import { setupCanvas } from './utils.js';


const N = 3000;
const MOUSE_FORCE = 5;
const RESTORE = 1;
const DRAG = 0.025;
const VAR = 0;

const MOUSE = {
    x: 0,
    y: 0
};

const mouseListener = (e) => {
    MOUSE.x = parseInt(e.clientX);
    MOUSE.y = parseInt(e.clientY);
}


class Symbol {
    constructor(w, h) {
        /*
         * Random unicode from Math Operators block:
         *  https://en.wikipedia.org/wiki/Mathematical_operators_and_symbols_in_Unicode
         */
        this.symbol = String.fromCharCode(0x2200 + Math.random() * (0x22FF-0x2200+1));
        this.x = Math.floor(Math.random() * w);
        this.y = Math.floor(Math.random() * h);
        this.dx = Math.floor(2 * VAR * Math.random() - VAR)
        this.dy = Math.floor(2 * VAR * Math.random() - VAR)
    }

    update(w, h) {
        let mx = this.x - MOUSE.x,
            my = this.y - MOUSE.y,
            md = Math.hypot(mx, my),
            fs = MOUSE_FORCE / (md*md),
            fl = MOUSE_FORCE / (md);
        
        // reppellent force from mouse
        this.dx += (fs-fl) * (mx/md);
        this.dy += (fs-fl) * (my/md);

        // restorative force from boundaries
        if (this.x < 0) this.dx += RESTORE;
        if (this.x > w) this.dx -= RESTORE;
        if (this.y < 0) this.dy += RESTORE;
        if (this.y > h) this.dy -= RESTORE;
        
        // drag force
        this.dx -= DRAG * this.dx;
        this.dy -= DRAG * this.dy;

        // finally update position
        this.x += this.dx;
        this.y += this.dy;
    }

    render(ctx) {
        ctx.fillText(this.symbol, this.x, this.y);
    }
}


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.animate = this.animate.bind(this);
        this.symbols = [];
    }

    render() {
        return (
            <div className={"background"} >
                <canvas ref={this.canvas} ></canvas>
            </div>
        );
    }

    getCanvasInfo() {
        let cvs = this.canvas.current,
            ctx = setupCanvas(cvs),
            w = cvs.offsetWidth,
            h = cvs.offsetHeight;
        return [cvs, ctx, w, h];
    }

    componentDidMount() {
        const [ , , w, h] = this.getCanvasInfo();

        // init mouse
        MOUSE.x = w/2;
        MOUSE.y = 0;
        window.addEventListener("mousemove", mouseListener);
        
        this.symbols = Array.from(
            {length: N},
            () => new Symbol(w, h)
        );
        
        window.requestAnimationFrame(this.animate);
    }

    animate() {
        const [cvs, ctx, w, h] = this.getCanvasInfo();
        
        // update all
        for (let sym of this.symbols) sym.update(w, h);

        // fill background
        ctx.fillStyle = "#ECEDEF";
        ctx.fillRect(0, 0, w, h);

        // render all
        ctx.fillStyle = "black";
        for (let sym of this.symbols) sym.render(ctx);

        window.requestAnimationFrame(this.animate);
    }
}
