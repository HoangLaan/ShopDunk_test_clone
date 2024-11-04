import CDRSPage from "pages/CDRs/CDRsPage";

const cdrsRoute = [
  {
    path: '/cdrs',
    exact: true,
    name: 'Danh sách CDRS',
    function: 'SYS_CDRS_VIEW',
    component: CDRSPage,
  },
];

export default cdrsRoute;
