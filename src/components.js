import React from 'react';

import Nav from "./nav.js";
import Page from "./page.js";
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
            page: this.props.map[hash.slice(1)] || this.props.map.Home
        };
    }

    popstateHandler() {
        this.setState(this.stateFromHash());
    }

    render() {
        return (
            <div className={style.main}>
                <Nav pages={Object.values(this.props.map)} />
                <Page page={this.state.page} />
            </div>
        );
    }
}
