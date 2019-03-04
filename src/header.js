import React from 'react';
import { setupCanvas } from './utils.js';


class Symbol {
    constructor(w, h) {
    }
    update() {
    }
    render(ctx) {
    }
}


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.animate = this.animate.bind(this);
    }

    render() {
        return (
            <div className={"header"} >
                <canvas ref={this.canvas} ></canvas>
            </div>
        );
    }

    componentDidMount() {
        this.animate();
        // setInterval(
        //     () => window.requestAnimationFrame(this.animate),
        //     1000
        // );
    }

    animate() {
        let canvas = this.canvas.current,
            ctx = setupCanvas(canvas),
            w = canvas.offsetWidth,
            h = canvas.offsetHeight;

        ctx.font = "36px";
        for (var i = 0; i < 1000; i++) {
            ctx.fillText(
                String.fromCharCode(0x2200 + Math.random() * (0x22FF-0x2200+1)),
                Math.floor(Math.random() * w),
                Math.floor(Math.random() * h)
            );
        };
    }
}
