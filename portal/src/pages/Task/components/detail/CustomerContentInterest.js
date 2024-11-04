import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion';
import { updateInterestContent } from 'services/task.service';
import { showToast } from 'utils/helpers';
import union from 'lodash/union';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import BWButton from 'components/shared/BWButton';
import ICON_COMMON from 'utils/icons.common';

function CustomerContentInterest({ task_detail_id, interest_content_list }) {
  const methods = useForm();

  const interestContentOptions = useGetOptions(optionType.interestContent, {
    valueAsString: true
  });

  useEffect(() => {
    methods.reset({ interest_content_list });
  }, [interest_content_list]);

  const onSubmit = async (payload) => {
    try {
      const _list = (payload?.interest_content_list || []).map(x => x.value)
      const _interest_content = union((_list).filter((x) => Boolean(x))).join('|');
      await updateInterestContent({ task_detail_id, interest_content: _interest_content });
      showToast.success('Cập nhật thành công');
    } catch (error) {
      showToast.error(error?.message);
    }
  };

  return (
    <BWAccordion title='Nội dung quan tâm'>
      <FormProvider {...methods}>
        <form>
          <div className='bw_row'>
            <div className='bw_col_12 bw_flex bw_justify_content_right' style={{ marginTop: -40 }}>
              <BWButton
                content="Thêm nội dung"
                outline={true}
                icon={ICON_COMMON.add}
                onClick={() => window._$g.rdr('/interest-content')}
              />
            </div>
            <div className='bw_col_12'>
              <FormItem label='Nội dung quan tâm'>
                <FormSelect
                  list={interestContentOptions}
                  field='interest_content_list'
                  mode='multiple'
                  onChange={(value) => {
                    methods.clearErrors('interest_content_list');
                    methods.setValue('interest_content_list', value.map(x => ({ id: x, value:x  })))
                    methods.handleSubmit(onSubmit)()
                  }}
                />
              </FormItem>
            </div>
          </div>
        </form>
      </FormProvider>
    </BWAccordion>
  );
}

export default CustomerContentInterest;
