import React from 'react';
import ReactDOM from 'react-dom';

import { setupCanvas } from '../utils.js';

const SUBDIV = 7;

const SEG_MID = .5;  // pixels

const FONT = "18px Arial";
const FONT_COLOR = "black";
const GRID_COLOR = "#dbdbdb";
const SELECTED_COLOR = "#f442c5";

const Mouse = {
    x: 0,
    y: 0
};


class Odometer {
    constructor (size, thickness) {
        this.size = size;
        this.thickness = thickness;

        // make segments
        this.segments = [[0, this.size]];
        for (let i = 0; i < SUBDIV; i++) {
            let new_segments = [];
            for (let seg of this.segments) {
                let w = seg[1] - seg[0];
                new_segments.push([seg[0], seg[0]+(w-SEG_MID)/2]);
                new_segments.push([seg[0]+(w+SEG_MID)/2, seg[1]]);
            }
            this.segments = new_segments;
        };

        this.selected = undefined;
    }

    seg_to_coord (seg) {
        let c = [];
        let l = 0, r = this.size;
        for (let k = 0; k < SUBDIV; k++) {
            let w = r - l;
            let x = (w+SEG_MID)/2;
            let t = Number(seg[1] > l + x);
            c.push(t);
            l += t * x;
            r -= (1-t) * x;
        };
        return c;
    }

    coord_to_seg (coord) {
        let i = 0;
        let L = 2**SUBDIV;
        for (let k = 0; k < SUBDIV; k++) {
            i += coord[k] * L / (2**k);
        };
        return this.segments[i];
    }

    coord_to_text (coord) {
        let t = "(";
        for (let i = 0; i < coord.length; i++) {
            t += coord[i] + ", ";
        };
        t += "...)"
        return t;
    }

    update (ctx, abs_x, abs_y) {
        for (let seg of this.segments) {
            let rel_x = Mouse.x - abs_x;
            if (rel_x >= seg[0] && rel_x <= seg[1]) {
                this.selected = seg;
                return;
            }
        };
        this.selected = undefined;
    }

    render (ctx, abs_x, abs_y) {
        for (let seg of this.segments) {
            ctx.fillStyle = (seg === this.selected) ? SELECTED_COLOR : GRID_COLOR;
            ctx.fillRect(abs_x+seg[0], abs_y-this.thickness, seg[1]-seg[0], this.thickness);
        };

        if (this.selected) {
            ctx.fillStyle = FONT_COLOR;
            ctx.font = FONT;
            let c = this.seg_to_coord(this.selected);
            ctx.fillText(this.coord_to_text(c), abs_x + 0, abs_y + 25);
        }
    }
};


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.animate = this.animate.bind(this);

        this.odometer = new Odometer(900, 40);
    }

    render() {
        return (<>
            <canvas className={"fullscreen"} ref={this.canvas} ></canvas>
        </>);
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
        
        window.requestAnimationFrame(this.animate);
    }

    animate() {
        const [cvs, ctx, w, h] = this.getCanvasInfo();
        let abs_x = (w - this.odometer.size)/2,
            abs_y = h/2;
        
        // clear background
        ctx.clearRect(0, 0, w, h);

        // update odometer
        this.odometer.update(ctx, abs_x, abs_y);

        // draw odometer
        this.odometer.render(ctx, abs_x, abs_y);

        window.requestAnimationFrame(this.animate);
    }
}


ReactDOM.render(
    <Main />,
    document.getElementById('app')
);
