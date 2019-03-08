import React from 'react';
import randomColor from 'randomcolor';

import { setupCanvas } from './utils.js';


export const N = 100;
export const Center = (w, h) => [60, 60];

// current mouse location
export const Mouse = {
    x: 0,
    y: 0
};

// forces
export const MOUSE = 4;
export const RESTORE = 2;
export const DRAG = 0.025;
export const CENTER = 0.01;


class Symbol {
    constructor(w, h) {
        /*
         * Random unicode from Math Operators block:
         *  https://en.wikipedia.org/wiki/Mathematical_operators_and_symbols_in_Unicode
         */
        //this.symbol = String.fromCharCode(0x2200 + Math.random() * (0x22FF-0x2200+1));
        this.r = Math.random() * 15 + 2;
        this.color = randomColor({
            luminosity: 'light',
            //hue: 'green'
        });

        const [cx, cy] = Center(w, h);
        this.x = cx + Math.random();
        this.y = cy + Math.random();
        this.dx = 0;
        this.dy = 0;
    }

    update(w, h) {
        const mx = this.x - Mouse.x,
              my = this.y - Mouse.y,
              md = Math.max(Math.hypot(mx, my), 0.1),
              fs = Math.min(MOUSE / (md*md), 5),
              fl = MOUSE / (md);
        
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
        const [cx, cy] = Center(w, h),
              dcx = this.x - cx,
              dcy = this.y - cy,
              dc = Math.max(Math.hypot(dcx, dcy), 0.1);
        this.dx -= CENTER * (dcx/dc);
        this.dy -= CENTER * (dcy/dc);

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
        Mouse.x = w;
        Mouse.y = h;
        
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
