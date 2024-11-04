import CDRSPage from "pages/CDRsSamCenter/CDRsPage";

const cdrsSamRoute = [
  {
    path: '/cdrs-sam-center',
    exact: true,
    name: 'Danh sách CDRS của SamCenter',
    function: 'SYS_CDRS_SAM_VIEW',
    component: CDRSPage,
  },
];

export default cdrsSamRoute;
