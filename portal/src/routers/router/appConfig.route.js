import React from 'react';

const AppConfigPage = React.lazy(() => import('pages/AppConfig/AppConfigPage'));

const appConfigRoute = [
    {
        path: '/app-config',
        exact: true,
        name: 'Cài đặt hệ thống',
        function: 'MD_AREA_VIEW',
        component: AppConfigPage,
    },
];

export default appConfigRoute;

