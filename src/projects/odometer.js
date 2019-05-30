import React from 'react';
import ReactDOM from 'react-dom';

import { setupCanvas, interpolateHex } from '../utils.js';

const N = 9;  // number of subdivisions

const SEG_MID = 1;  // pixels

const FONT = "18px Arial";
const FONT_COLOR = "black";
const GRID_COLOR = "#dbdbdb";
const SELECTED_COLOR = "#f442c5";

const GRID_SIZE = 900;
const GRID_WIDTH = 50;
const BASIS_WIDTH = 8;
const BASIS_SPACING = 2;

const ACTION_ITERS = 10;
const ACTION_COLORS = Array
    .from(Array(ACTION_ITERS).keys())
    .map((i) => interpolateHex(SELECTED_COLOR, GRID_COLOR, i*(1/ACTION_ITERS)));

const Mouse = {
    x: 0,
    y: 0
};


class Odometer {
    constructor (size, thickness) {
        this.size = size;
        this.thickness = thickness;
        this.segments = [[0, this.size]];
        this.bases = [this.segments];
        for (let i = 0; i < N; i++) {
            let new_segments = [];
            for (let seg of this.segments) {
                let w = seg[1] - seg[0];
                new_segments.push([seg[0], seg[0]+(w-SEG_MID)/2]);
                new_segments.push([seg[0]+(w+SEG_MID)/2, seg[1]]);
            }
            this.segments = new_segments;
            this.bases.push(this.segments);
        };
        this.selected = 0;
    }

    seg_to_coord (seg) {
        return Math.floor((seg[0]/this.size) * (2**N))
    }

    pos_to_coord (x) {
        return Math.floor((x/this.size) * (2**N));
    }

    coord_to_seg (coord) {
        return this.segments[coord];
    }

    coord_to_text (coord) {
        let t = "(";
        for (let i = N - 1; i >= 0; i--) {
            t += ((coord & 1 << i) >> i)  + ", ";
        };
        t += "...)"
        return t;
    }

    group_action (x) {
        let mask = 1 << (N-1);
        while (mask) {
            let carry = x & mask;
            x = x ^ mask;
            mask = carry >> 1;
        }
        return x;
    }

    update (ctx, abs_x, abs_y) {
        let rel_x = Mouse.x - abs_x;
        if (rel_x < 0) {
            this.selected = 0;
        } else if (rel_x >= this.size) {
            this.selected = 2**N - 1;
        } else {
            this.selected = this.pos_to_coord(rel_x);
        };
    }

    render (ctx, abs_x, abs_y) {
        for (let i = 0; i < this.segments.length; i++) {
            let seg = this.segments[i];
            ctx.fillStyle = (i == this.selected) ? SELECTED_COLOR : GRID_COLOR;
            ctx.fillRect(
                abs_x+seg[0],
                abs_y-this.thickness,
                seg[1]-seg[0],
                this.thickness);
        };
        for (let j = 1; j < N; j++) {
            let base = this.bases[N-j];
            for (let i = 0; i < base.length; i++) {
                let seg = base[i];
                if (this.selected >> j == i) {
                    ctx.fillStyle = SELECTED_COLOR;
                } else {
                    ctx.fillStyle = GRID_COLOR;
                };
                ctx.fillRect(
                    abs_x + seg[0],
                    abs_y + BASIS_SPACING + (j - 1) * (BASIS_SPACING + BASIS_WIDTH),
                    seg[1]-seg[0],
                    BASIS_WIDTH);
            };
        };
        ctx.fillStyle = FONT_COLOR;
        ctx.font = FONT;
        ctx.fillText(
            this.coord_to_text(this.selected),
            abs_x + 0,
            abs_y - this.thickness - 10);
    }
};


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.animate = this.animate.bind(this);

        this.odometer = new Odometer(GRID_SIZE, GRID_WIDTH);
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
            abs_y = 1/3*h;
        
        ctx.clearRect(0, 0, w, h);
        this.odometer.update(ctx, abs_x, abs_y);
        this.odometer.render(ctx, abs_x, abs_y);

        window.requestAnimationFrame(this.animate);
    }
}


ReactDOM.render(
    <Main />,
    document.getElementById('app')
);
