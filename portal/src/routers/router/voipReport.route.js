import VoipReportPage from "pages/VoipReport/VoipReportPage";

const VoipReportRoute = [
  {
    path: '/voip-report',
    exact: true,
    name: 'Báo cáo cuộc gọi',
    function: 'SYS_VOIP_REPORT_VIEW',
    component: VoipReportPage,
  },
];

export default VoipReportRoute;
