export const reviewStatusOptionProposal = [
  {
    label: 'Tất cả',
    value: 4,
  },
  {
    label: 'Đã duyệt',
    value: 1,
  },
  {
    label: 'Đang duyệt',
    value: 3,
  },
  {
    label: 'Chưa duyệt',
    value: 2,
  },
  {
    label: 'Không duyệt',
    value: 0,
  },
];

export const pdfType = [
  {
    label: 'Đề xuất',
    value: 1,
  },
  {
    label: 'Quyết định',
    value: 2,
  },
];

export const changeType = [
  {
    label: 'Phòng ban',
    value: 1,
  },
  {
    label: 'Vị trí',
    value: 2,
  },
  {
    label: 'Cấp bậc',
    value: 3,
  },
  {
    label: 'Chuyển công tác',
    value: 4,
  },
  {
    label: 'Lương',
    value: 5,
  },
];

export const render_review = (is_review) => {
  let title = '';
  let status = '';
  switch (is_review) {
    case 1:
      title = 'Đã duyệt';
      status = 'bw_label_outline_success';
      break;
    case 2:
      title = 'Đang duyệt';
      status = 'bw_label_outline_warning';
      break;
    case 0:
      title = 'Không duyệt';
      status = 'bw_label_outline_danger';
      break;
    default:
      title = 'Chưa duyệt';
      break;
  }
  return {
    title: title,
    status: status,
  };
};

export const configToast = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const initSearch = {
  keyword: null,
  proposal_type_id: null,
  department_id: null,
  created_date_from: null,
  created_date_to: null,
  effective_date_from: null,
  effective_date_to: null,
  is_review: null,
};
