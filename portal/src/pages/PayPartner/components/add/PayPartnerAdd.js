import FormSection from 'components/shared/FormSection/index';
import PayPartnerInformation from './PayPartnerInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import ContractInformation from './ContractInformation';
import BeneficiaryAccount from './BeneficiaryAccount';

const PartnerPaymentAdd = ({ disabled }) => {
  const detailForm = [
    {
      id: 'information',
      component: PayPartnerInformation,
      title: 'Thông tin đối tác',
      fieldActive: ['pay_partner_code', 'pay_partner_full_name', 'pay_partner_name', 'note'],
    },
    {
      id: 'contract_information',
      title: 'Thông tin hợp đồng',
      component: ContractInformation,
      fieldActive: ['refun_day'],
    },
    {
      id: 'acccount',
      title: 'Tài khoản thụ hưởng',
      component: BeneficiaryAccount,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];
  return <FormSection detailForm={detailForm} disabled={disabled} noActions></FormSection>;
};
export default PartnerPaymentAdd;
