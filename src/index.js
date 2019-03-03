import React from 'react';
import ReactDOM from 'react-dom';
import Markdown from 'react-markdown';

import Main from './components.js';
import * as pages from './pages';


// Build markdown elements from files in `./pages`.
const PageMap = {}
Object.entries(pages)
    .forEach(([filename, source]) => {
        const split = filename.match(/[^0-9]/i).index;
        const name = filename.slice(split);
        PageMap[name] = {
            name: name,
            index: Number(filename.slice(0, split)),
            content: <Markdown source={source} />
        }
    });


ReactDOM.render(
    <Main map={PageMap} />,
    document.getElementById('app')
);
