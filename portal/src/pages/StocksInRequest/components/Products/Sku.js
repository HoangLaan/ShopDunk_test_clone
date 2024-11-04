import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from 'components/shared/BWFormControl//ErrorMessage';
import { checkImeiCode, updateImei } from 'services/stocks-in-request.service';
import debounce from 'lodash/debounce';
import { ISIMPORTED, STOCKINTYPEID } from '../utils/constants';
import Loading from 'components/shared/Loading';
import { showToast } from 'utils/helpers';

function Sku({ keyProduct, showModal, disabled }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [skus, setSkus] = useState(watch(`${keyProduct}.skus`) || []);
  const inputRefs = useRef([]);
  const [keyword, setKeyword] = useState(undefined);
  const [identity, setIdentity] = useState(undefined);
  const [isExistsImei, setIsExistsImei] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isExistsImeiSystem, setIsExistsImeiSystem] = useState(false);
  const quantity = watch(`${keyProduct}.quantity`);
  useEffect(() => {
    if (skus?.length === 0) {
      const updateSkus = [...skus];
      if (quantity) {
        for (let index = 1; index <= +quantity; index++) {
          updateSkus.push({ id: index, sku: '', note: '' });
        }
      }
      setSkus(updateSkus);
    }
  }, [quantity]);

  useEffect(() => {
    const initialSkusValue = watch(`${keyProduct}.skus`);
    if (initialSkusValue) {
      setValue('imeiProduct', initialSkusValue)
    }
  }, [watch, keyProduct])

  const OnSubmitSku = () => {
    if (watch('is_imported') === ISIMPORTED && watch('stocks_in_type_id') === STOCKINTYPEID) {
      const skusChange = skus.filter(item => {
        const oldItem = watch('imeiProduct').find(oi => oi.id === item.id);
        return oldItem && oldItem.sku !== item.sku;
      }).map(i => {
        const oldItem = watch('imeiProduct').find(oi => oi.id === i.id);
        return {
          ...i,
          old_sku: oldItem.sku
        };
      })
      //call api
      setLoading(true);
      updateImei({ skus: skusChange, stocks_in_type_id: watch('stocks_in_type_id') }).then(() => {
        setLoading(false)
        showToast.success('Cập nhật Imei thành công');
        showModal(false);
      }).catch((err) => {
        setLoading(false)
        showToast.error(err.message);
      })
    } else {
      //Check trùng imei

      const value = skus.map((item) => item.sku);
      const duplicates = value.filter((item, index) => index !== value.indexOf(item) && item);

      if (duplicates && duplicates.length > 0) {
        setIsExistsImei(duplicates);
        return;
      }
      setIsExistsImei([]);
      if (!isExistsImeiSystem) {
        setValue(`${keyProduct}.skus`, skus);
        showModal(false);
      }
    }
  };

  const onChangeSku = (value, index, key) => {
    setIsExistsImei([]);
    setIsExistsImeiSystem(false);
    let _skus = [...skus];
    _skus[index][key] = value;
    setSkus(_skus);
  };

  // const fetchCheckImeiCode = useCallback(() => {
  //   if (keyword) {
  //     let message = 'Trùng mã Imei trong hệ thống';
  //     let _skus = [...skus];
  //     _skus[identity]['error'] = '';
  //     checkImeiCode({ imei: keyword }).then((response) => {
  //       if (response) {
  //         setIsExistsImeiSystem(true);
  //         _skus[identity]['error'] = message;
  //       } else {
  //         setIsExistsImeiSystem(false);
  //       }
  //       setSkus(_skus);
  //     });
  //   }
  // }, [keyword]);

  // Xử lý sự kiện khi người dùng nhấn Enter
  const handleEnter = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Tìm ô nhập liệu tiếp theo
      const nextIdx = idx + 1;
      if (nextIdx < inputRefs.current.length) {
        inputRefs.current[nextIdx].focus();
      }
    }
  };

  // useEffect(fetchCheckImeiCode, [fetchCheckImeiCode]);

  const handleSearch = useMemo(() => {
    const loadKeyWord = (event) => {
      setKeyword(event.target.value);
    };
    return debounce(loadKeyWord, 700);
  }, [keyword]);

  return (
    <>
    <div className='bw_modal bw_modal_open ' id='bw_pop2' style={{ marginLeft: '50px' }}>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>Danh sách mã Imei của sản phẩm</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={() => showModal(false)} />
        </div>
        <div className='bw_main_modal'>
          <div className='bw_box_card bw_mt_1'>
            <div className='bw_table_responsive'>
              <table className='bw_table'>
                <thead>
                  <tr>
                    <th className='bw_sticky bw_check_sticky'>STT</th>
                    <th className>IMEI</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {skus &&
                    skus?.length > 0 &&
                    skus.map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <td className='bw_sticky bw_check_sticky'>{idx + 1}</td>
                          <td>
                            <input
                              type='text'
                              className='bw_inp bw_mt_1 bw_mb_1'
                              value={item.sku}
                              disabled={disabled}
                              onChange={(e) => {
                                e.preventDefault();
                                onChangeSku(e.target.value, idx, 'sku');
                                setIdentity(idx);
                                handleSearch(e);
                              }}
                              onKeyDown={(e) => handleEnter(e, idx)}
                              ref={(inputRef) => (inputRefs.current[idx] = inputRef)}
                            />
                          </td>
                          <td>
                            <input
                              type='text'
                              className='bw_inp bw_mt_1 bw_mb_1'
                              value={item?.note || ''}
                              disabled={disabled}
                              onChange={(e) => {
                                e.preventDefault();
                                onChangeSku(e.target.value, idx, 'note');
                              }}
                            />
                          </td>
                          <td>
                            <ErrorMessage message={item?.error} />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isExistsImei && isExistsImei.length > 0 ? (
          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ fontWeight: 'bold' }}>
              Cảnh báo IMEI : <span style={{ color: 'red' }}>{isExistsImei.join(' , ')}</span> trùng nhau .
            </h2>
          </div>
        ) : null}

        <div className='bw_footer_modal'>
          {disabled ? null : (
            <button type='button' className='bw_btn bw_btn_success bw_close_modal' onClick={OnSubmitSku}>
              <span className='fi fi-rr-check' /> Cập nhật
            </button>
          )}
          <button
            type='button'
            className='bw_btn_outline bw_close_modal'
            onClick={() => {
              showModal(false);
            }}>
            Đóng
          </button>
        </div>
      </div>
      
    </div>
    {loading && <Loading />}
    </>
  );
}

export default Sku;
