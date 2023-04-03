import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Modal from 'react-modal'
import { IntlProvider } from 'react-intl';
import  IntlWrapper  from './components/intlwrapper'
require('purecss')

ReactDOM.render(
    <IntlWrapper  locale="" defaultLocale="fr">
        <App />
    </IntlWrapper>
    , document.getElementById('root'));
Modal.setAppElement(document.getElementById('root'));
registerServiceWorker();
