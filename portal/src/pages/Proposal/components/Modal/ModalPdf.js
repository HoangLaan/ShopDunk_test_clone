import Modal from 'components/shared/Modal/index';
import BWButton from 'components/shared/BWButton/index';
import { Fragment, useState } from 'react';
import { exportPDF } from 'services/proposal.service';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { cdnPath } from 'utils/index';
import { pdfType } from 'pages/Proposal/utils/constants';
const ModalPdf = ({ open, onClose }) => {
  const { watch } = useFormContext();
  const [type, setType] = useState(1);
  const onSubmit = async () => {
    exportPDF({ id: watch('proposal_id'), pdf_type: type }).then((response) => {
      let varUrl = response.path;
      const url = cdnPath(varUrl);
      const pdflink = document.createElement('a');
      pdflink.target = '_blank';
      pdflink.href = url;
      document.body.appendChild(pdflink);
      pdflink.click();
    });
    onClose?.();
  };
  return (
    <Modal
      header='Chọn loại phiếu in '
      witdh={'30%'}
      open={open}
      onClose={onClose}
      footer={
        <Fragment>
          <BWButton icon={'fi fi-rr-print'} type={'success'} content={'In'} onClick={() => onSubmit()} />
        </Fragment>
      }>
      <div className='bw_collapse'>
        <FormItem label='Loại phiếu in' isRequired>
          <FormSelect
            list={watch('is_review') === 1 ? pdfType : pdfType.filter((x) => x.value !== 2)}
            value={type}
            onChange={(e) => setType(e)}></FormSelect>
        </FormItem>
      </div>
    </Modal>
  );
};
export default ModalPdf;
