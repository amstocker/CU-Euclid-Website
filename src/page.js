import React from 'react';
import style from './style.less';


export default class extends React.Component {
    render() {
        return (
            <div className={style.page}>
                {this.props.page.content}
            </div>
        );
    }
}
