import { useEffect, useState } from 'react';
import { matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import routes from '../routers';

const _ignoredRoutes = ['/', '/change-password'];

function useVerifyAccess(props) {
  const { user } = useAuth();
  const getUserAuth = () => {
    return user;
  };

  const verifyPermission = (permission, any = false) => {
    if (any) return true;
    const { functions = [] } = getUserAuth() || {};
    let _function = functions.find((_func) => {
      let funcUC = (_func + '').toUpperCase().trim();
      return funcUC === permission;
    });
    return !!_function;
  };

  const verify = (route, location) => {
    let user = getUserAuth() || null;
    let verify = null;
    let ignoredRoute = null;
    if (user && !user.isAdministrator) {
      if (!route && location) {
        route = routes.find((_route) => {
          let result = matchPath(location.pathname, _route);
          return !!result;
        });
      }

      if (route) {
        ignoredRoute = _ignoredRoutes.find((_pathname) => {
          let result = matchPath(_pathname, route);
          return !!result;
        });
      }

      if (route && !ignoredRoute) {
        let _function = verifyPermission(route.function, route.any);
        if (!_function) {
          verify = 'access_denined';
        }
      }
    }
    return verify || (user ? true : false);
  };

  return { verify, verifyPermission };
}

export default useVerifyAccess;
