import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import '../../styles.scss'
function CostApply({ keyProduct, showModal, disabled}) {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  let [costApplyList, setCostApplyList] = useState([]);
  useEffect(() => {
    let costApplyList = [];
    if (watch(`${keyProduct}.cost_apply_list`)) {
      (watch(`${keyProduct}.cost_apply_list`) || []).map((item) => {
        costApplyList[item.id] = item;
      });
      setCostApplyList(costApplyList);
    }
  }, []);
  const onChangeListSelect = (event, value) => {
    if (costApplyList[value]) {
      delete costApplyList[value];
    } else {
      let item = (watch('cost_type_list') || []).find((item) => item.id === value);
      if (item) {
        costApplyList[value] = item;
      }
    }
    costApplyList = { ...costApplyList };
    setCostApplyList(costApplyList);
  };

  const checkedAll = (checked) => {
    let costApplyList = [];
    if (checked) {
      (watch('cost_type_list') || []).map((item) => {
        costApplyList[item.id] = item;
      });
    }
    setCostApplyList(costApplyList);
  };

  const handleApplyCost = () => {
    setValue(`${keyProduct}.cost_apply_list`, Object.values(costApplyList));
    showModal(false);
  };
  return (
    <div className='bw_modal bw_modal_open ' id='bw_pop2' style={{ marginLeft: '50px' }}>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>Chi phí</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={() => showModal(false)} />
        </div>
        <div className='bw_main_modal'>
          <div className='bw_box_card bw_mt_1'>
            <div className='bw_table_responsive' id='cost_apply'>
              <table className='bw_table'>
                <thead>
                  <tr>
                    <th className='bw_sticky bw_check_sticky'>
                      <label className='bw_checkbox bw_text_center' style={{ marginRight: 0 }}>
                        <input
                          type='checkbox'
                          disabled={disabled}
                          checked={Object.keys(costApplyList).length === watch('cost_type_list').length}
                          onChange={({ target }) => {
                            checkedAll(target.checked);
                          }}
                        />
                        <span />
                      </label>
                    </th>
                    <th className>Loại chi phí</th>
                    <th>Đơn giá</th>
                    <th>Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  {watch(`cost_type_list`) &&
                    watch(`cost_type_list`)?.length > 0 &&
                    watch(`cost_type_list`).map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <td className='bw_sticky bw_check_sticky'>
                            <label className='bw_checkbox bw_text_center' style={{ marginRight: 0 }}>
                              <input
                                type='checkbox'
                                disabled={disabled}
                                checked={!!costApplyList[item.id]}
                                //value={item.id}
                                onChange={(e) => {
                                  onChangeListSelect(e, item.id);
                                }}
                              />
                              <span />
                            </label>
                          </td>
                          <td>{item.cost_name}</td>
                          <td className='price_text_right'>{new Intl.NumberFormat().format(item.cost_value ?? 0)} đ</td>
                          <td>{item.description}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {/* <div className='bw_row bw_mt_2 bw_show_table_page'>
              <div className='bw_col_6'>
                <p>Show 10/120 records</p>
              </div>
              <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
                <div className='bw_nav_table'>
                  <button>
                    <span className='fi fi-rr-angle-small-left' />
                  </button>
                  <input type='number' defaultValue={1} step={1} />
                  <span className='bw_all_page'>/ 20</span>
                  <button className='bw_active'>
                    <span className='fi fi-rr-angle-small-right' />
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className='bw_footer_modal'>
          {!disabled ? (
            <button type='button' className='bw_btn bw_btn_success bw_close_modal' onClick={handleApplyCost}>
              <span className='fi fi-rr-check' /> Chọn
            </button>
          ) : null}

          <button type='button' className='bw_btn_outline bw_close_modal' onClick={() => showModal(false)}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CostApply;
