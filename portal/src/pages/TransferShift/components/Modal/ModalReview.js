import BWButton from 'components/shared/BWButton/index';
import Modal from 'components/shared/Modal/index';
import { Avatar, Input } from 'antd';
import { showToast } from 'utils/helpers';
import { updateReview } from 'services/transfer-shift.service';
import { useState } from 'react';
import BodyModalStyled from 'pages/TransferShift/utils/styled';
import unnamed from 'assets/bw_image/unnamed.png';
const { TextArea } = Input;

const ModalReview = ({ open, onClose, item }) => {
  const [content, setContent] = useState('');
  const onSubmit = async (status) => {
    try {
      await updateReview({
        review_note: content,
        is_review: status,
        transfer_shift_review_list_id: item.transfer_shift_review_list_id,
      });
      showToast.success(`Cập nhật duyệt thành công`);
      onClose?.(true);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };
  return (
    <Modal open={open} onClose={onClose} header={'Duyệt chuyển ca'} witdh={'60%'}>
      <BodyModalStyled>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_12 bw_mb_2'>
              <h1 style={{ fontWeight: '700' }}>Thông tin chuyển ca</h1>
            </div>
            <div className='bw_col_12 '>
              <div className='bw_row bw_mb_2'>
                <div className='bw_col_3'>Loại yêu cầu chuyển ca:</div>
                <div className='bw_col_9 bw_text_custom'>{item.transfer_shift_type_name}</div>
              </div>
              <div className='bw_row bw_mb_2'>
                <div className='bw_col_3'>Ngày chuyển ca:</div>
                <div className='bw_col_9 bw_text_custom'>{`${item.date_from} - ${item.date_to}`}</div>
              </div>
              <div className='bw_row bw_mb_2'>
                <div className='bw_col_3'>Ca hiện tại:</div>
                <div className='bw_col_3'>
                  {' '}
                  <span className='bw_text_custom'>{item.current_shift_name}</span>
                </div>
                <div className='bw_col_3'>
                  {' '}
                  Miền : <span className='bw_text_custom'>{item.current_business_name}</span>{' '}
                </div>
                <div className='bw_col_3'>
                  Cửa hàng : <span className='bw_text_custom'>{item.current_store_name}</span>
                </div>
              </div>
              <div className='bw_row bw_mb_2'>
                <div className='bw_col_3'>Ca chuyển:</div>
                <div className='bw_col_3 bw_text_custom'>{item.new_shift_name}</div>
                <div className='bw_col_3'>
                  Miền : <span className='bw_text_custom'>{item.business_name}</span>
                </div>
                <div className='bw_col_3'>
                  Cửa hàng : <span className='bw_text_custom'>{item.store_name}</span>
                </div>
              </div>
              <div className='bw_row bw_mb_2'>
                <div className='bw_col_3'>Lý do:</div>
                <div className='bw_col_9'>{item.reason}</div>
              </div>
            </div>
          </div>
          <div className='bw_row'>
            <div className='bw_col_12 bw_mb_2'>
              <h1 style={{ fontWeight: '700' }}>Thông tin chuyển ca</h1>
            </div>
            <div className='bw_col_12'>
              <div className='bw_row'>
                <div className='bw_col_2 bw_information_review'>
                  <span className='bw_text_center'>{item.review_level_name}</span>
                  <Avatar
                    size={80}
                    className='ant-avatar antd-pro-components-global-header-index-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image'
                    src={item?.avatar_image || unnamed}
                    alt='avatar'
                    style={{ marginRight: 10 }}
                  />
                  <span className='bw_text_center'>{item.review_user_name}</span>
                </div>
                <div className='bw_col_10'>
                  <TextArea
                    maxLength={250}
                    style={{ height: 120, marginBottom: 24 }}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder='Ghi chú'
                  />
                </div>
                <div className='bw_col_12 bw_group_btn'>
                  <BWButton
                    content={'Duyệt'}
                    type={'success'}
                    disabled={!item.is_review}
                    style={{ marginRight: '10px' }}
                    onClick={() => onSubmit(1)}></BWButton>
                  <BWButton
                    content={'Không Duyệt'}
                    disabled={!item.is_review}
                    type={'danger'}
                    onClick={() => onSubmit(0)}></BWButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BodyModalStyled>
    </Modal>
  );
};
export default ModalReview;
