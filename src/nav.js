import React from 'react';
import style from './style.less';


export default class extends React.Component {
    render() {
        return (
            <div className={style.nav}>
                {this.props.pages
                    .sort((a, b) =>
                        a.index - b.index)
                    .map((page) =>
                        <Link dest={page.name} key={page.name} />)
                }
            </div>
        );
    }                
}

export class Link extends React.Component {
    render() {
        const link = '#' + this.props.dest;
        return (
            <div className={style.link}>
                <a href={link}>{this.props.dest}</a>
            </div>
        );
    }
}
