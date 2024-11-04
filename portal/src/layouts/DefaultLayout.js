import React, { Suspense, useMemo } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from 'routers';
import VoidIp from 'pages/VoidIp/VoidIp';
import SideBar from './sidebar/SideBar';
import NavHeader from './NavHeader';
import FooterImg from '../assets/bw_image/footer.png';
import CheckAccess from 'navigation/CheckAccess';
import i__addOrder from 'assets/bw_image/i__orderAdd.svg';

function DefaultLayout() {
  const { collapsedSideBar: collapsed } = useSelector((state) => state.global);

  const jsx_render = useMemo(() => {
    return (
      <Suspense fallback={null}>
        <Switch>
          {routes.map((route) => {
            return (
              route.component && (
                <Route
                  key={new Date().getTime()}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  component={route.component}
                />
              )
            );
          })}
          <Redirect from='/' to='/404' />
        </Switch>
      </Suspense>
    );
  }, [routes]);

  return (
    <div className={`bw_contain ${collapsed ? 'bw_close_nav' : ''}`}>
      <SideBar />
      <div className='bw_main'>
        <NavHeader />
        {jsx_render}
        <div
          style={{ position: 'relative', width: '100%' }}
          className='bw_flex bw_align_items_center bw_justify_content_between bw_ft'>
          <p>Copyright © 2023 Blackwind Software Solutions</p>
          <p>
            <a href='#!'>
              <img style={{ height: 20 }} src={FooterImg} alt='2' />
            </a>
          </p>
        </div>
      </div>
      <CheckAccess permission='SL_ORDER_ADD'>
        <div onClick={() => window._$g.rdr(`/orders/add`)} className='bw_btn_call_order'>
          <a className='bw_btn_call'>
            <img src={i__addOrder} alt='' />
          </a>
        </div>
      </CheckAccess>
      <VoidIp />
    </div>
  );
}

export default withRouter(DefaultLayout);
