import React from 'react';
import style from './style.less';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ctx: undefined
        };
    }

    componentDidMount() {
        this.setState({
            ctx: document.getElementById('canvas').getContext('2d')
        });
        window.requestAnimationFrame(this.draw);
    }

    render() {
        return (
            <canvas id="canvas" className={style.header} ></canvas>
        );
    }

    draw() {

    }
}
