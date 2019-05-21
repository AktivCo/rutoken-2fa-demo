import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { IntlProvider, addLocaleData } from 'react-intl';
import locale from 'react-intl/locale-data/ru';

import Header from './Header';
import CheckLogin from './CheckLogin';

import { createStore } from './store';

addLocaleData(locale);

const Main = () =>
    (
        <Header>
            <CheckLogin />
        </Header>
    );

const App = createStore(Main);

ReactDOM.render(
    <IntlProvider locale="ru">
        <App />
    </IntlProvider>,
    document.getElementById('app'),
);
