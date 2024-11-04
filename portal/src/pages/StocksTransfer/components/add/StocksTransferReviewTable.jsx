import BWImage from 'components/shared/BWImage/index';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notification } from 'antd';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion/index';
import { approvedReviewList } from 'pages/StocksTransfer/helpers/call-api';
import { showToast } from 'utils/helpers';

const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
    margin: 1.8px 0;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
`;

const renderReview = (valueRender = {}, useCallback) => {
  //Class "bw_red" cho trang thai khong duyet

  if (valueRender?.is_reviewed == 1 || valueRender?.is_auto_review) {
    return (
      <>
        <td className='bw_text_center bw_green'>Đã duyệt</td>
        <td>{valueRender?.is_auto_review ? 'Duyệt tự dộng' : valueRender?.review_note || 'Không có nội dung'}</td>
      </>
    );
  } else if (valueRender?.is_reviewed == 2 && valueRender?.is_can_review) {
    return (
      <>
        <td className='bw_text_center'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            style={{ marginRight: 8 }}
            onClick={() => useCallback('is_reviewed', 1)}>
            Duyệt
          </button>
          <button type='button' className='bw_btn bw_btn_danger' onClick={() => useCallback('is_reviewed', 0)}>
            Không duyệt
          </button>
        </td>
        <td>
          <textarea
            placeholder='Nội dung'
            className='bw_inp'
            onChange={({ target: { value } }) => useCallback('review_note', value)}></textarea>
        </td>
      </>
    );
  } else if (valueRender?.is_reviewed == 0) {
    return (
      <>
        <td className='bw_text_center bw_red'>Không duyệt</td>
        <td>{valueRender?.is_auto_review ? 'Duyệt tự dộng' : valueRender?.review_note || 'Không có nội dung'}</td>
      </>
    );
  } else {
    return (
      <>
        <td className='bw_text_center'>Chưa duyệt</td>
        <td></td>
      </>
    );
  }
};

const StocksTransferReviewTable = ({ disabled = true }) => {
  const { id } = useParams();
  const methods = useFormContext();

  const [stocksTransferType, setStocksTransferType] = useState([]);

  useEffect(() => {
    if (methods.watch('stocks_transfer_review_list')) {
      setStocksTransferType(methods.watch('stocks_transfer_review_list'));
    }
  }, [methods.watch('stocks_transfer_review_list')]);

  const handleApprove = (idx, key, value) => {
    let _new_stocksTransferType = [...stocksTransferType];
    // Lấy giá trị tại thời điểm đó
    if (key === 'review_note') {
      _new_stocksTransferType[idx][key] = value;

      setStocksTransferType(_new_stocksTransferType);
    } else if (key === 'is_reviewed' && !_new_stocksTransferType[idx]['review_note']) {
      showToast.error('Nội dung duyệt là bắt buộc.');
    } else {
      let params = {
        ..._new_stocksTransferType[idx],
        is_reviewed: value,
        stocks_transfer_id: id,
      };
      approvedReviewList(params)
        .then(() => {
          _new_stocksTransferType[idx][key] = value;

          setStocksTransferType(_new_stocksTransferType);
          showToast.success('Cập nhật duyệt phiếu chuyển kho thành công.');
        })
        .catch((error) => {
          showToast.error('Lỗi không thể duyệt phiếu chuyển kho.');
        });
    }
  };

  const handleChangeReviewList = (value, stocks_review_level_id) => {
    // offwork_review_list
    let _stocks_review_list = methods.watch('stocks_transfer_review_list');

    if (_stocks_review_list && _stocks_review_list.length) {
      // Lấy vị trí thay đổi
      let idx = _stocks_review_list.findIndex((_stocks) => _stocks?.stocks_review_level_id == stocks_review_level_id);

      if (idx > -1) {
        _stocks_review_list[idx].review_user = value;
      }
    }

    methods.setValue('stocks_transfer_review_list', _stocks_review_list);
  };

  return (
    <React.Fragment>
      {!(
        (methods.watch('is_reviewed') && stocksTransferType.length === 0) ||
        methods.watch('is_auto_review_stock_transfer')
      ) ? (
        <BWAccordion title='Duyệt' id='bw_review' isRequired={true}>
          <table className='bw_table'>
            <thead>
              <th className='bw_sticky bw_check_sticky bw_text_center' style={{ width: '5%' }}>
                STT
              </th>
              <th className='bw_text_center' style={{ width: '20%' }}>
                Mức duyệt
              </th>
              <th className='bw_text_center' style={{ width: '30%' }}>
                Người duyệt
              </th>
              {disabled ? (
                <>
                  <th className='bw_text_center' style={{ width: '20%' }}>
                    Trạng thái duyệt
                  </th>
                  <th style={{ width: '25%' }}>Nội dung duyệt</th>
                </>
              ) : null}
            </thead>
            <tbody>
              {stocksTransferType && stocksTransferType.length ? (
                stocksTransferType.map((_userRl, idx) => {
                  return (
                    <tr key={_userRl?.stocks_review_level_id}>
                      <td className='bw_sticky bw_check_sticky bw_text_center'>{idx + 1}</td>
                      <td>{_userRl?.stocks_review_level_name}</td>

                      {disabled ? (
                        <>
                          <td>
                            <div className='bw_inf_pro'>
                              <BWImage src={_userRl?.default_picture_url} />
                              {_userRl?.review_user_fullname}
                            </div>
                          </td>
                          {_userRl?.is_auto_review ? (
                            <>
                              <td className='bw_text_center bw_green'>Đã duyệt</td>
                              <td>Tự động duyệt</td>
                            </>
                          ) : disabled && !_userRl.is_can_review && _userRl.is_reviewed == 2 ? (
                            <>
                              <td className='bw_text_center '>Chưa duyệt</td>
                              <td className='bw_text_center bw_green'></td>
                            </>
                          ) : (
                            renderReview(_userRl, (key, value) => {
                              handleApprove(idx, key, value);
                            })
                          )}
                        </>
                      ) : (
                        <td>
                          {_userRl?.is_auto_review ? (
                            <span>Tự động duyệt</span>
                          ) : (
                            <SelectStyle
                              suffixIcon={<CaretDownOutlined />}
                              bordered={false}
                              allowClear={true}
                              placeholder={'-- Chọn --'}
                              optionFilterProp='children'
                              value={_userRl?.review_user || null}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              options={_userRl?.users || []}
                              disabled={disabled}
                              onChange={(value) => {
                                handleChangeReviewList(value, _userRl?.stocks_review_level_id);
                              }}
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className='bw_text_center'>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </BWAccordion>
      ) : (
        <div className='bw_items_frm' id='bw_confirm'>
          <div className='bw_collapse bw_mt_2 bw_active'>
            <div className='bw_collapse_title'>
              <span className='fi fi-rr-angle-small-down'></span>
              <h3>
                Duyệt <span className='bw_red'></span>
              </h3>
            </div>
            <div className='bw_collapse_panel'>
              <div className='bw_row'>
                <div className='bw_col_12'>
                  <div className='bw_frm_box'>
                    <b className='bw_blue'>Hình thức phiếu chuyển kho được duyệt tự động.</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default StocksTransferReviewTable;
