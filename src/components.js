import React from 'react';
import ReactDOM from 'react-dom';

import Nav from "./nav.js";
import Page, { PageMap } from "./page.js";
import style from "./style.less";


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
            page: PageMap[hash.slice(1)] || PageMap.Home
        };
    }

    popstateHandler() {
        this.setState(this.stateFromHash());
    }

    render() {
        return (
            <div className={style.main}>
                <Nav />
                <Page page={this.state.page} />
            </div>
        );
    }
}
