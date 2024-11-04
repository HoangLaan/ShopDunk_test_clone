import React from 'react';

const NewsInside = React.lazy(() => import('pages/NewsInside/pages/NewsInsidePage'));
const NewsInsideDetail = React.lazy(() => import('pages/NewsInside/pages/NewsInsideDetail'));

const newsInsideRoutes = [
  {
    path: '/news-inside',
    exact: true,
    name: 'Tin tức nội bộ',
    function: 'NEWS_NEWS_VIEW',
    component: NewsInside,
  },
  {
    path: '/news-inside/detail/:id',
    exact: true,
    name: 'Chi tiết tin tức nội bộ',
    function: 'NEWS_NEWS_VIEW',
    component: NewsInsideDetail,
  },
];

export default newsInsideRoutes;
