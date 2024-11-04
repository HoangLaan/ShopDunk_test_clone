import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RedirectHelper from 'pages/RedirectHelper/RedirectHelper';
import VerifyAccess from 'navigation/VerifyAccess';

import 'styles/App.css';
import 'react-toastify/dist/ReactToastify.css';

const Login = React.lazy(() => import('pages/LoginPage'));
const Logout = React.lazy(() => import('pages/LoginPage/LogoutPage'));
const Page500 = React.lazy(() => import('pages/PageError/Page500'));

function AppRouter() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
      <React.Suspense fallback={null}>
        <RedirectHelper
          ref={(ref) => {
            ref && (window._$g.rdr = ref && ref.go);
          }}
        />
        <Switch>
          <Route exact path='/500/:error?' name={window._$g._('Page 500')} component={Page500} />
          <Route exact path='/login' name={window._$g._('Login Page')} component={Login} />
          <Route exact path='/logout' name={window._$g._('Logout Page')} component={Logout} />
          <Route path='/' render={() => <VerifyAccess />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
