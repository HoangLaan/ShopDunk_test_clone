import DashboardPage from 'pages/Dashboard/DashboardPage';
import User from 'pages/User/User';

const dashboardRoute = [
  {
    path: '/',
    exact: true,
    name: 'Trang chủ',
    function: 'DASHBOARD_VIEW',
    component: DashboardPage,
  },
];

export default dashboardRoute;
