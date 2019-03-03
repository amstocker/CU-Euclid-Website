import React from 'react';

import { PageMap } from './page.js';
import style from './style.less';


export default class extends React.Component {
    render() {
        return (
            <div className={style.nav}>
                {Object.values(PageMap).map((page) =>
                    <Link dest={page.name} key={page.name} />
                )}
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
