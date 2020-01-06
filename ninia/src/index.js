// entry point of the application 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './container/App';
import { Provider } from 'react-redux';
import store from "./store"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')); // App component rendered into the root div 


