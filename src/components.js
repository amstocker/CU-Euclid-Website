import React from 'react';

import Header from "./header.js";
import style from "./style.less";


export class Nav extends React.Component {
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
        const link = `#${this.props.dest}`;
        return (
            <div className={style.link}>
                <a href={link}>{this.props.dest}</a>
            </div>
        );
    }
}

export class Page extends React.Component {
    render() {
        return (
            <div className={style.page}>
                {this.props.page.content}
            </div>
        );
    }
}

/*
 * <Main />
 */
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.stateFromHash();
        
        // Handle back button
        window.onpopstate = this.popstateHandler.bind(this);
    }

    stateFromHash() {
        const hash = window.location.hash;
        return {
            page: this.props.map[hash.slice(1)] || this.props.map.Home
        };
    }

    popstateHandler() {
        this.setState(this.stateFromHash());
    }

    render() {
        return (
            <div className={style.main}>
                <Header />
                <div className={style.content}>
                    <Nav pages={Object.values(this.props.map)} />
                    <Page page={this.state.page} />
                </div>
            </div>
        );
    }
}
