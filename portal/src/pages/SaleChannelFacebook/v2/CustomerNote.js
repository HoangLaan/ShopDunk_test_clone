import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormTags from './FormTags';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useSelector } from 'react-redux';

function CustomerNote() {
  const methods = useForm();
  const { facebookUser } = useSelector((state) => state.scfacebook);
  const notes = facebookUser?.notes || [];

  useEffect(() => {
    methods.reset({ note_list: notes || [] })
  }, [notes])


  return (
    <div className='bw_collapse bw_active'>
      <div className='bw_collapse_title'>
        <h3>Ghi chú</h3>
      </div>
      <FormProvider {...methods}>
        <div className='bw_collapse_panel bw_list_label bw_row'>
          <div className='bw_col_12'>
            <FormItem label='Ghi chú'>
              <FormTags field='note_list' />
            </FormItem>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

export default CustomerNote;
