import { TYPES_VAT } from './constants';



const vatTypes = [
  {
    label: 'Tất cả',
    class: '',
    value: TYPES_VAT.ALL,
  },
  {
    label: 'Có VAT',
    class: 'bw_label_success',
    value: TYPES_VAT.HAVEVAT,
  },
  {
    label: 'Không VAT',
    class: 'bw_label_danger',
    value: TYPES_VAT.NOTVAT,
  },
];

export {  vatTypes };
