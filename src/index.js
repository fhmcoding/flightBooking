import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import PagesRoute from './pagesRoute'
import {BrowserRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import flightStore from './stores/flights/flightStore'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={flightStore}>
        <BrowserRouter >
        <PagesRoute />
        </BrowserRouter>
    </Provider>
);

reportWebVitals();
