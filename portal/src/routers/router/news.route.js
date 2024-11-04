import React from 'react';

const News = React.lazy(() => import('pages/News/News'));
const NewsAdd = React.lazy(() => import('pages/News/NewsAdd'));
const NewsEdit = React.lazy(() => import('pages/News/NewsEdit'));
const NewsDetail = React.lazy(() => import('pages/News/NewsDetail'));

const newsRoutes = [
  {
    path: '/news',
    exact: true,
    name: 'Danh sách bài viết',
    function: 'NEWS_NEWS_VIEW',
    component: News,
  },
  {
    path: '/news/add',
    exact: true,
    name: 'Thêm mới bài viết',
    function: 'NEWS_NEWS_ADD',
    component: NewsAdd,
  },
  {
    path: '/news/detail/:id',
    exact: true,
    name: 'Chi tiết bài viết',
    function: 'NEWS_NEWS_VIEW',
    component: NewsDetail,
  },
  {
    path: '/news/edit/:id',
    exact: true,
    name: 'Chỉnh sửa bài viết',
    function: 'NEWS_NEWS_EDIT',
    component: NewsEdit,
  },
];

export default newsRoutes;
