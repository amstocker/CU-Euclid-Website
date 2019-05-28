import React from 'react';
import hljs from 'highlight.js/lib/highlight.js';
import python from 'highlight.js/lib/languages/python';
       hljs.registerLanguage('python', python);

import Background from "./background.js";


export class Header extends React.Component {
    render() {
        return (
            <div className={"header"} >
                <img src="./me.jpg"></img>
                <div className={"info"} >
                    {"Andrew Stocker"}<br></br>
                </div>
                <a href={"mailto:andrew.stocker@colorado.edu"} >{"email"}</a>
                <a href={"https://github.com/amstocker"} target="_blank" >{"github"}</a>
                <a href={"https://megamaster.bandcamp.com/"} target="_blank" >{"bandcamp"}</a>
            </div>
        );
    }
}

export class Nav extends React.Component {
    render() {
        return (
            <div className={"nav"}>
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
            <div className={"link"}>
                <a href={link}>{this.props.dest}</a>
            </div>
        );
    }
}

export class Page extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    highlightCodeSyntax() {
        this.ref.current.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    componentDidMount() { this.highlightCodeSyntax(); }
    componentDidUpdate() { this.highlightCodeSyntax(); }
    
    render() {
        return (
            <div ref={this.ref} className={"page"}>
                {this.props.page.content}
            </div>
        );
    }
}


// <Main />
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
            <div className={"content"} >
                <Background />
                <div className={"side"} >
                    <Header />
                    <Nav pages={Object.values(this.props.map)} />
                </div>
                <Page page={this.state.page} />
            </div>
        );
    }
}
