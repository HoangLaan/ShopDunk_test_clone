import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'components/main/App';
import * as _ from 'global';
import { initFacebookSdk } from './pages/SaleChannelFacebook/utils/sdk';

initFacebookSdk().then(startApp);

function startApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}