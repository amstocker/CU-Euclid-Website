import React from 'react';
import ReactDOM from 'react-dom';

import Nav from "./nav.js";
import Page, { PageMap } from "./page.js";
import style from "./style.less";




export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.stateFromHash();
        
        // To pass to Nav
        this.clickHandler = this.clickHandler.bind(this);
        
        // Handle back button
        window.onpopstate = this.popstateHandler.bind(this);
    }

    stateFromHash() {
        const hash = window.location.hash;
        return this.stateFromDest(
            hash ? hash.slice(1) : ''
        );
    }

    popstateHandler() {
        this.setState(this.stateFromHash());
    }

    stateFromDest(dest) {
        const page = PageMap[dest];
        return {
            page: page || PageMap.Home
        };
    }

    clickHandler(dest) {
        window.location.hash = dest;
        this.setState(this.stateFromDest(dest));
    }

    render() {
        return (
            <div className={style.main}>
                <Nav clickHandler={this.clickHandler} />
                <Page page={this.state.page} />
            </div>
        );
    }
}
