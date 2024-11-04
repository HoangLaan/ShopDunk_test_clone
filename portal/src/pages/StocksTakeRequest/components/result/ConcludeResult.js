import BWAccordion from 'components/shared/BWAccordion/index';
import Loading from 'components/shared/Loading/index';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { updateConcludeContent } from 'services/stocks-take-request.service';

const ConcludeResult = ({ title }) => {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const { stocks_take_request_id } = useParams();

  const onSubmit = () => {
    setLoading(true);
    updateConcludeContent(stocks_take_request_id, {
      conclude_content: methods.watch('conclude_content'),
    }).then((_) => {
      setLoading(false);
      methods.setValue('is_processed', 1);
    });
  };

  return (
    <BWAccordion title={title}>
      {/* <Loading/> */}
      <textarea
        className='bw_inp bw_text_s'
        disabled={methods.watch('is_processed')}
        onChange={(e) => {
          methods.setValue('conclude_content', e.target.value);
        }}>
        {methods.watch('conclude_content')}
      </textarea>
      {Boolean(methods.watch('is_processed')) && (
        <label className='bw_checkbox bw_mt_2'>
          <input type='checkbox' checked disabled />
          <span></span>
          Đã xử lý kiểm kê
        </label>
      )}
      {Boolean(!methods.watch('is_processed')) && (
        <div className='bw_btn_group bw_btn_grp bw_flex bw_align_items_center bw_justify_content_right bw_mt_2'>
          <a onClick={onSubmit} className='bw_btn_outline bw_btn_outline_success bw_open_modal '>
            <span className='fi fi-rr-inbox-in'></span> Lưu kết quả
          </a>
          {/* <a className='bw_btn bw_btn_success bw_open_modal'>
          <span className='fi fi-rr-plus'></span> Thêm
        </a> */}
        </div>
      )}
    </BWAccordion>
  );
};

export default ConcludeResult;
