import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DataPanel from './components/DataPanel.js';
import ControlsPanel from './components/ControlsPanel.js';
import TopLikersGraph from './components/TopLikersGraph.js';

ReactDOM.render(<ControlsPanel />, document.getElementById('controls-panel'));
ReactDOM.render(<DataPanel />, document.getElementById('data-panel'));
ReactDOM.render(<TopLikersGraph />, document.getElementById('top-likers-graph'));