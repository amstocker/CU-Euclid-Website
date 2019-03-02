import React from 'react';
import ReactDOM from 'react-dom';

import style from "./style.less";


export default class extends React.Component {
    render() {
        console.log(style.main);
        return (
            <div className={style.main}>
                <Nav />
                <Page />
            </div>
        );
    }
}

class Page extends React.Component {
    render() {
        return (
            <div className={style.page}>
                {"Hello!"}
            </div>
        );
    }
}

class Nav extends React.Component {
    render() {
        return (
            <div className={style.nav}>
                <a href="#first">First</a>
                <a href="#second">Second</a>
            </div>
        );
    }                
}

class NavLink extends React.Component {
    render() {
        return (
            <div>
            </div>
        );
    }
}
