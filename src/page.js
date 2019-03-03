import React from 'react';
import Markdown from 'react-markdown';

import style from './style.less';
import home_md from './pages/Home.md';
import teaching_md from './pages/Teaching.md';


export const PageMap = {
    Home: {
        name: "Home",
        content: <Markdown source={home_md} />
    },
    Teaching: {
        name: "Teaching",
        content: <Markdown source={teaching_md} />
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
