
import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter, Match, Miss } from 'react-router';
import './css/style.css';
import StorePicker from './components/StorePicker';
import NotFound from './components/NotFound';
import App from './components/App';


const Root = () => {
  return (
    <BrowserRouter basename={'/react/catchoftheday'}>
      <div>
        <Match exactly pattern="/" component={StorePicker} />
        <Match pattern="/store/:storeId" component={App} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  );
};
render(<Root />, document.querySelector('#main'));
