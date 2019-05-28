import React from 'react';
import ReactDOM from 'react-dom';

import { setupCanvas, interpolateHex } from '../utils.js';

const SUBDIVS = 7;

const SEG_MID = 1;  // pixels

const FONT = "18px Arial";
const FONT_COLOR = "black";
const GRID_COLOR = "#dbdbdb";
const SELECTED_COLOR = "#f442c5";

const GRID_SIZE = 900;
const GRID_WIDTH = 50;
const BASIS_WIDTH = 20;
const BASIS_SPACING = 2;

const ACTION_ITERS = 20;
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

        // make segments
        this.segments = [[0, this.size]];
        this.bases = [this.segments];
        for (let i = 0; i < SUBDIVS; i++) {
            let new_segments = [];
            for (let seg of this.segments) {
                let w = seg[1] - seg[0];
                new_segments.push([seg[0], seg[0]+(w-SEG_MID)/2]);
                new_segments.push([seg[0]+(w+SEG_MID)/2, seg[1]]);
            }
            this.segments = new_segments;
            this.bases.push(this.segments);
        };
        
        this.selected = undefined;
    }

    seg_to_coord (seg) {
        let c = [];
        let l = 0, r = this.size;
        for (let k = 0; k < SUBDIVS; k++) {
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
        for (let k = 0; k < SUBDIVS; k++) {
            i += coord[k] * 2**(SUBDIVS-k-1);
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

    group_action (seg) {
        let coord = this.seg_to_coord(seg);
        if (coord[0]) {
            let carry = true, k = 1;
            coord[0] = 0;
            while (carry) {
                if (coord[k]) {
                    k++;
                    if (k == SUBDIVS) {
                        return new Array(SUBDIVS).fill(0);
                    };
                } else {
                    coord[k] = 1;
                    carry = false;
                };
            };
        } else {
            coord[0] = 1;
        }
        return this.coord_to_seg(coord);
    }

    update (ctx, abs_x, abs_y) {
        let rel_x = Mouse.x - abs_x;
        if (rel_x < 0 || rel_x > this.size) {
            this.selected = undefined;
            return;
        }
        for (let seg of this.segments) {
            if (rel_x >= seg[0] && rel_x <= seg[1]) {
                this.selected = seg;
                return;
            }
        };
    }

    render (ctx, abs_x, abs_y) {
        // draw Cantor grid
        ctx.fillStyle = GRID_COLOR;
        for (let seg of this.segments) {
            ctx.fillRect(abs_x+seg[0], abs_y-this.thickness, seg[1]-seg[0], this.thickness);
        };

        // draw base sets
        for (let j = 1; j < SUBDIVS + 1; j++) {
            let base = this.bases[j];
            for (let seg of base) {
                if (this.selected
                     && this.selected[0] >= seg[0]
                     && this.selected[1] <= seg[1])
                {
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

        // draw iterations of group action of selected element and nbhd filter
        if (this.selected) {
            let seg = this.selected;
            for (let i = 0; i < ACTION_ITERS; i++) {
                ctx.fillStyle = ACTION_COLORS[i];
                ctx.fillRect(abs_x+seg[0], abs_y-this.thickness, seg[1]-seg[0], this.thickness);
                seg = this.group_action(seg);
            };


        };

        // draw label
        if (this.selected) {
            ctx.fillStyle = FONT_COLOR;
            ctx.font = FONT;
            let c = this.seg_to_coord(this.selected);
            ctx.fillText(this.coord_to_text(c), abs_x + 0, abs_y - this.thickness - 10);
        };
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
