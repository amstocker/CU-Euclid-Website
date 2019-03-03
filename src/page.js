import React from 'react';
import style from './style.less';


export const PageMap = {
    Home: {
        name: "Home",
        content: "Hello"
    },
    Teaching: {
        name: "Teaching",
        content: <a href="#Home">test</a>
    }
};


export default class extends React.Component {
    render() {
        return (
            <div className={style.page}>
                {this.props.page.content}
            </div>
        );
    }
}
