import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

function Description({ title, disabled }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormEditor disabled={disabled} field='description' />
      </div>
    </BWAccordion>
  );
}

export default Description;
