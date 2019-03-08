import React from 'react';
import randomColor from 'randomcolor';

import { setupCanvas } from './utils.js';


export const N = 500;

// current mouse location
export const Mouse = {
    x: undefined,
    y: undefined
};

// forces
export const CURSOR = 4;
export const RESTORE = 2;
export const DRAG = 0.025;
export const G = -0.01;



class Symbol {
    constructor(w, h) {
        /*
         * Random unicode from Math Operators block:
         *  https://en.wikipedia.org/wiki/Mathematical_operators_and_symbols_in_Unicode
         */
        //this.symbol = String.fromCharCode(0x2200 + Math.random() * (0x22FF-0x2200+1));
        this.r = Math.floor(Math.random() * 20 + 2);
        this.color = randomColor({
            luminosity: 'light',
            hue: 'green'
        });
        this.x = Math.floor(Math.random() * w);
        this.y = Math.floor(4*h/5 + Math.random() * h/5);
        this.dx = 0;
        this.dy = 0;
    }

    update(w, h) {
        let mx = this.x - Mouse.x,
            my = this.y - Mouse.y,
            md = Math.hypot(mx, my),
            fs = Math.min(CURSOR / (md*md), 5),
            fl = CURSOR / (md);        
        
        // force from mouse
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

        // gravity
        this.dy -= G;

        // finally update position
        this.x += this.dx;
        this.y += this.dy;
    }

    render(ctx) {
        //ctx.fillText(this.symbol, this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
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
        window.addEventListener("mousemove", (e) => {
            e.preventDefault();   
            e.stopPropagation();
            Mouse.x = parseInt(e.clientX);
            Mouse.y = parseInt(e.clientY);
        });
        
        this.symbols = Array.from(
            {length: N},
            () => new Symbol(w, h)
        );
        
        window.requestAnimationFrame(this.animate);
    }

    animate() {
        const [cvs, ctx, w, h] = this.getCanvasInfo();
        
        // update all
        if (Mouse.x && Mouse.y)
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
