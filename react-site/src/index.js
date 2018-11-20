import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DataPanel from './components/DataPanel.js';
import ControlsPanel from './components/ControlsPanel.js';
import TopLikersGraph from './components/TopLikersGraph.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ControlsPanel />, document.getElementById('controls-panel'));
ReactDOM.render(<DataPanel />, document.getElementById('data-panel'));
ReactDOM.render(<TopLikersGraph />, document.getElementById('top-likers-graph'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();