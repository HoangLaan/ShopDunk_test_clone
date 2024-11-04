import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

function Keypoints({ title, disabled }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormEditor disabled={disabled} field='keypoints' />
      </div>
    </BWAccordion>
  );
}

export default Keypoints;
