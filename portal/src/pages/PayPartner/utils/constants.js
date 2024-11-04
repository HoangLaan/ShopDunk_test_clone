export const ToastStyle = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const PERMISSION_PAY_PARTNER = {
  ADD: 'MD_PAYPARTNER_ADD',
  EDIT: 'MD_PAYPARTNER_EDIT',
  VIEW: 'MD_PAYPARTNER_VIEW',
  DELETE: 'MD_PAYPARTNER_DEL',
};

export const UNITMONEY = [
  {
    label: 'VND',
    value: 1,
  },
  {
    label: '$',
    value: 2,
  },
];
  
export const INIT = {
  keyword: null,
  created_date_from: null,
  created_date_to: null,
  is_active: 1,
};
