import { App } from './App.js';

const element = React.createElement;

const domContainer = document.querySelector('#diagramContainer');
ReactDOM.render(element(App), domContainer);

