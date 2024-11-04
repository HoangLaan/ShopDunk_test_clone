import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import _ from 'lodash';
import { Empty, Tooltip } from 'antd';

import { getListPromotion } from 'pages/websiteDirectory/helpers/call-api';
import { renderDiscountValue } from 'pages/websiteDirectory/helpers/utils';

import GiftModal from './GiftModal';

const ContentRender = styled.span`
  margin-left: ${(props) => props.levelRecursive};
`;

const Wrapper = styled.div`
  @keyframes loading {
    to {
      background-position-x: -30%;
    }
  }
  .loader {
    background-color: #ededed;
    height: 18px;
    border-radius: 7px;
    width: 100%;
  }
  td .loader {
    background-color: #ededed;
    background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 60%
      )
      #ededed;
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1s loading ease-in-out infinite;
  }
`;

const PromotionModal = ({ onClose, onConfirm }) => {
  const { watch, setValue } = useFormContext();
  const [selectedPromotionOffers, setSelectedPromotionOffers] = useState([]);
  const [dataSelect, setDataSelect] = useState(watch('promotion_offers') ?? []);
  const [loading, setLoading] = useState(false);
  const [promotionList, setPromotionList] = useState([]);
  // const [offerList, setOfferList] = useState([]);
  const [isPlusoint, setIsPluspoint] = useState(false);

  const getData = useCallback(() => {
    const products = watch('products') || {};
    const total_money = watch('total_money') || 0;
    const member_id = watch('member_id');
    const dataleads_id = watch('dataleads_id');
    const data_payment = watch('data_payment');

    if (total_money && products && Object.keys(products).length && (member_id || dataleads_id)) {
      setLoading(true);
      getListPromotion({
        products: Object.keys(products)
          .map((key) => products[key])
          .filter((p) => !p?.is_promotion_gift),
        shipping_fee: 20000,
        member_id,
        dataleads_id,
        store_id: watch('store_id'),
        business_id: watch('business_id'),
        order_status_id: watch('order_type_id'),
        data_payment,
      })
        .then((res) => {
          setPromotionList(res);
          setValue('promotion_apply', res);
          // setOfferList(res.reduce((acc, curr) => acc.concat(curr.offers), []));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [watch, setValue]);

  useEffect(getData, [getData]);

  const onChangeSelect = useCallback(
    (selected) => {
      const promotionIds = _.uniq(selected.map((p) => p.promotion_id));
      setIsPluspoint(
        !(promotionList.findIndex((p) => promotionIds.includes(p.promotion_id) && !p.is_reward_point) > -1),
      );

      setSelectedPromotionOffers(selected);
    },
    [promotionList],
  );

  useEffect(() => {
    onChangeSelect(dataSelect);
  }, [onChangeSelect, dataSelect]);

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '270px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '74rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const columns = useMemo(
    () => [
      {
        header: 'Tên chương trình/khuyến mại',
        accessor: 'promotion_name',
        formatter: (p) => (p?.promotion_offer_id ? p?.promotion_offer_name : <b>{p?.promotion_name}</b>),
        classNameHeader: 'bw_text_center',
        expanded: true,
        colSpan: (p) => (p?.promotion_offer_id ? 1 : 2),
      },
      {
        header: 'Khuyến mại',
        formatter: (p) => renderDiscountValue(p),
        classNameHeader: 'bw_text_center',
        hiddenCell: (p) => (p?.promotion_offer_id ? 0 : 1),
      },
      {
        header: 'Mô tả',
        colSpan: () => 1,
        formatter: (p) =>
          p?.description ? (
            <Tooltip title={<b>{p?.description}</b>}>
              <b>{p?.description?.length > 63 ? p?.description.slice(0, 60) + '...' : p?.description}</b>
            </Tooltip>
          ) : (
            <b>-</b>
          ),
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Áp dụng cùng các khuyến mại khác',
        accessor: 'payment_status_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          !p?.promotion_offer_id ? (
            p?.is_apply_with_other_promotion ? (
              <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
            ) : (
              <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
            )
          ) : (
            ''
          ),
      },
    ],
    [],
  );

  const colSpan = useMemo(() => {
    const spanSelect = 1;
    return spanSelect + (columns ?? []).length;
  }, [columns]);

  const selectedPromotion = useMemo(() => {
    return dataSelect
      .reduce((acc, curr) => {
        if (acc.findIndex((offer) => curr.promotion_id === offer.promotion_id) === -1) {
          acc.push(curr);
        }
        return acc;
      }, [])
      .reduce((acc, curr) => {
        const findIndex = promotionList.findIndex((p) => p.promotion_id === curr.promotion_id);
        if (findIndex >= 0) {
          acc.push(promotionList[findIndex]);
        }
        return acc;
      }, []);
  }, [dataSelect, promotionList]);

  const isApplyWithOtherPromotion = useMemo(() => {
    return selectedPromotion.reduce((acc, curr) => {
      if (!curr.is_apply_with_other_promotion) {
        acc = false;
      }
      return acc;
    }, true);
  }, [selectedPromotion]);

  const hiddenRowSelect = useCallback(
    (obj) => {
      const isSelected = selectedPromotion.findIndex((p) => p.promotion_id === obj.promotion_id) > -1;
      const promotion = promotionList.find((p) => p.promotion_id === obj.promotion_id);
      if (selectedPromotion?.length > 0) {
        if (isApplyWithOtherPromotion) {
          if (promotion.is_apply_with_other_promotion) {
            return false;
          }
          return true;
        }
        if (isSelected) {
          return false;
        }
        return true;
      }
      return false;
    },
    [selectedPromotion, promotionList, isApplyWithOtherPromotion],
  );

  // const totalChecked = useMemo(() => {
  //   if (
  //     offerList.filter((o) => {
  //       if (typeof hiddenRowSelect === 'function') {
  //         return !hiddenRowSelect(o);
  //       } else {
  //         return true;
  //       }
  //     }).length === 0
  //   ) {
  //     return false;
  //   }

  //   const dataFilter = dataSelect.filter((o) =>
  //     offerList.some((p) => {
  //       return (
  //         String(o.promotion_offer_id) === String(p.promotion_offer_id) &&
  //         String(o.promotion_id) === String(p.promotion_id)
  //       );
  //     }),
  //   );

  //   if (
  //     dataFilter.length ===
  //     offerList.filter((o) => {
  //       if (typeof hiddenRowSelect === 'function') {
  //         return !hiddenRowSelect(o);
  //       } else {
  //         return true;
  //       }
  //     }).length
  //   ) {
  //     return true;
  //   }

  //   return false;
  // }, [offerList, dataSelect, hiddenRowSelect]);

  // const handleCheckAll = useCallback(() => {
  //   const _dataSelect = [...dataSelect];
  //   if (totalChecked) {
  //     for (let j of offerList) {
  //       const findIndex = _dataSelect.findIndex((o) => {
  //         return (
  //           String(o.promotion_offer_id) === String(j.promotion_offer_id) &&
  //           String(o.promotion_id) === String(j.promotion_id)
  //         );
  //       });
  //       if (findIndex >= 0) {
  //         _dataSelect.splice(findIndex, 1);
  //       }
  //       setDataSelect(_dataSelect);
  //     }
  //   } else {
  //     for (let j of offerList) {
  //       const findIndex = _dataSelect.findIndex((o) => {
  //         return (
  //           String(o.promotion_offer_id) === String(j.promotion_offer_id) &&
  //           String(o.promotion_id) === String(j.promotion_id)
  //         );
  //       });
  //       if (findIndex < 0) {
  //         _dataSelect.push(j);
  //       }
  //       setDataSelect(_dataSelect);
  //     }
  //   }
  // }, [totalChecked, dataSelect, offerList]);

  const renderData = useCallback(
    (valueRender, keyRender) => {
      let _dataSelect = [...dataSelect];

      return (
        <TrTable
          colSpan={colSpan}
          keyRender={keyRender}
          _dataSelect={_dataSelect}
          dataSelect={dataSelect}
          setDataSelect={setDataSelect}
          columns={columns}
          valueRender={valueRender}
          hiddenRowSelect={hiddenRowSelect}
        />
      );
    },
    [columns, dataSelect, colSpan, hiddenRowSelect],
  );

  const jsx_tbody =
    promotionList?.length > 0 ? (
      <tbody>{promotionList?.map((value, key) => renderData(value, key))}</tbody>
    ) : (
      <tbody>
        <tr>
          <td colSpan={colSpan}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
          </td>
        </tr>
      </tbody>
    );

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      <div className='bw_modal_container bw_w1200' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Chọn khuyến mại</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal} />
        </div>
        <div className='bw_main_modal'>
          <Wrapper className='bw_box_card'>
            <div className='bw_row bw_mt_2 bw_mb_2 bw_align_items_center'>
              <div className='bw_col_6'>
                {Boolean(dataSelect.length) > 0 && (
                  <div className='bw_show_record'>
                    <p className='bw_choose_record'>
                      <b>{dataSelect.length}</b> đang chọn{' '}
                      <a
                        href='/'
                        id='data-table-select'
                        onClick={(e) => {
                          e.preventDefault();
                          setDataSelect([]);
                        }}>
                        Bỏ chọn
                      </a>
                    </p>
                  </div>
                )}
              </div>
              <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'></div>
            </div>
            <div className='bw_table_responsive'>
              <table className='bw_table'>
                <thead>
                  <tr style={{ whiteSpace: 'none' }}>
                    <th className='bw_sticky bw_check_sticky'>
                      {/* không thể chọn cùng lúc khi check "áp dụng cùng khuyến mại khác" */}
                      {/* {Boolean(offerList.filter((o) => !hiddenRowSelect?.(o)).length) && (
                        <label className='bw_checkbox'>
                          <input type='checkbox' onChange={() => handleCheckAll()} checked={totalChecked} />
                          <span></span>
                        </label>
                      )} */}
                    </th>

                    {columns
                      ?.filter((value) => !value.hidden)
                      .map((p, o) => (
                        <th key={o} className={p?.classNameHeader ? p?.classNameHeader : ''}>
                          {p?.header}
                        </th>
                      ))}
                  </tr>
                </thead>

                {loading ? (
                  <tbody>
                    {Array.from(Array(10).keys())?.map(() => {
                      return (
                        <tr className='tr'>
                          {Array.from(Array(colSpan).keys())?.map(() => {
                            return (
                              <td className='td'>
                                <div className='loader'></div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  jsx_tbody
                )}
              </table>
            </div>
          </Wrapper>
        </div>
        <div className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={() => {
              onConfirm(selectedPromotionOffers, isPlusoint);
            }}>
            <span className='fi fi-rr-check' /> Chọn khuyến mại
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const TrTable = ({
  colSpan,
  keyRender,
  _dataSelect,
  dataSelect,
  setDataSelect,
  columns,
  valueRender,
  levelRecursive,
  hiddenRowSelect,
}) => {
  const [openExpaned, setOpenExpaned] = useState(true);
  const [dataExpaned, setDataExpaned] = useState(undefined);
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const marginRecursive = levelRecursive ? `${levelRecursive * 5 + 10}px` : '10px';

  const jsx_render = () => {
    if (openExpaned) {
      if (Array.isArray(dataExpaned) && dataExpaned.length > 0) {
        return dataExpaned.map((valueR) => {
          return (
            <TrTable
              colSpan={colSpan}
              keyRender={keyRender}
              _dataSelect={_dataSelect}
              setDataSelect={setDataSelect}
              columns={columns}
              valueRender={valueR}
              levelRecursive={(levelRecursive ? levelRecursive : 0) + 1}
              hiddenRowSelect={hiddenRowSelect}
            />
          );
        });
      } else {
        // return (
        //   <tr>
        //     <td colSpan={colSpan}>
        //       <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
        //     </td>
        //   </tr>
        // );
        return '';
      }
    }
  };

  const findIndex = useMemo(() => {
    return _dataSelect.findIndex((o) => {
      return (
        String(o.promotion_offer_id) === String(valueRender.promotion_offer_id) &&
        String(o.promotion_id) === String(valueRender.promotion_id)
      );
    });
  }, [_dataSelect, valueRender]);

  const onChangeGift = useCallback(
    (selected) => {
      const newSelected = selected?.filter((o) => o.quantity > 0) || [];

      setDataSelect((prev) => {
        // tìm offer đang chọn
        const find = prev?.findIndex(
          (o) => o.promotion_id === valueRender.promotion_id && o.promotion_offer_id === valueRender.promotion_offer_id,
        );

        if (find >= 0) {
          //tìm và sửa lại các offer đã chọn
          prev[find].gifts = prev[find].gifts.map((o) => {
            const findGift = newSelected.findIndex((p) => p.product_gift_id === o.product_gift_id);
            if (findGift >= 0) {
              return { ...newSelected[findGift], is_picked: 1 };
            }
            return o;
          });
        }
        return prev;
      });

      setOpenGiftModal(false);
    },
    [setDataSelect, valueRender.promotion_id, valueRender.promotion_offer_id],
  );

  const oldSelectedGift = useMemo(() => {
    return dataSelect?.find(
      (o) => o.promotion_id === valueRender.promotion_id && o.promotion_offer_id === valueRender.promotion_offer_id,
    )?.gifts;
  }, [dataSelect, valueRender.promotion_id, valueRender.promotion_offer_id]);

  useEffect(() => {
    if (!dataExpaned) {
      setDataExpaned(valueRender?.offers);
    }
  }, [dataExpaned, valueRender?.offers]);

  return (
    <>
      <tr key={keyRender} className={findIndex >= 0 ? 'bw_checked' : ''}>
        <td className='bw_sticky bw_check_sticky'>
          {valueRender?.defend_key ? (
            <label
              style={{
                marginRight: '2px',
                display: `${
                  !levelRecursive || (typeof hiddenRowSelect === 'function' && hiddenRowSelect(valueRender))
                    ? 'none'
                    : ''
                }`,
              }}
              className='bw_checkbox'>
              <input
                type='checkbox'
                checked={findIndex >= 0}
                key={keyRender}
                onChange={() => {
                  if (findIndex >= 0) {
                    _dataSelect.splice(findIndex, 1);
                    setDataSelect(_dataSelect);
                  } else {
                    setDataSelect([..._dataSelect, valueRender]);

                    if (valueRender.is_fixed_gift) {
                      setOpenGiftModal(true);
                    }
                  }
                }}
              />
              <span></span>
            </label>
          ) : null}
        </td>

        {columns
          ?.filter((value) => !value.hidden)
          .map((column, key) => {
            const className = column?.classNameBody ? column?.classNameBody : '';

            if (typeof column?.hiddenCell === 'function' && column?.hiddenCell(valueRender, keyRender)) {
              return '';
            }

            if (column.formatter) {
              return (
                <td
                  style={column?.style}
                  className={className}
                  key={`${keyRender}${key}`}
                  colSpan={typeof column?.colSpan === 'function' ? column?.colSpan(valueRender, keyRender) : 1}>
                  {column.expanded && (
                    <ContentRender
                      style={{
                        display: `${levelRecursive ? 'none' : ''}`,
                      }}
                      levelRecursive={marginRecursive}
                      onClick={() => {
                        setOpenExpaned(!openExpaned);
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                  <span>{column?.formatter(valueRender, keyRender)}</span>
                </td>
              );
            } else if (column.accessor) {
              return (
                <td
                  style={column?.style}
                  className={className}
                  key={`${keyRender}${key}`}
                  colSpan={typeof column?.colSpan === 'function' ? column?.colSpan(valueRender, keyRender) : 1}>
                  {column.expanded && (
                    <ContentRender
                      style={{
                        display: `${levelRecursive ? 'none' : ''}`,
                      }}
                      levelRecursive={marginRecursive}
                      onClick={() => {
                        setOpenExpaned(!openExpaned);

                        if (!dataExpaned) {
                          setDataExpaned(valueRender?.offers);
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                  {valueRender[column.accessor]}
                </td>
              );
            } else {
              return (
                <td
                  style={column?.style}
                  className={className}
                  key={`${keyRender}${key}`}
                  colSpan={typeof column?.colSpan === 'function' ? column?.colSpan(valueRender, keyRender) : 1}>
                  {column.expanded && (
                    <ContentRender
                      style={{
                        display: `${levelRecursive ? 'none' : ''}`,
                      }}
                      levelRecursive={marginRecursive}
                      onClick={() => {
                        setOpenExpaned(!openExpaned);

                        if (!dataExpaned) {
                          setDataExpaned(valueRender?.offers);
                        }
                      }}
                      className={`fi fi-rr-${openExpaned ? 'minus' : 'plus'}-small bw_show_child`}></ContentRender>
                  )}
                </td>
              );
            }
          })}

        {openGiftModal && (
          <GiftModal
            onClose={() => {
              setOpenGiftModal(false);
            }}
            onConfirm={onChangeGift}
            giftList={valueRender?.gifts}
            oldSelectedGift={oldSelectedGift}
          />
        )}
      </tr>
      {jsx_render()}
    </>
  );
};

export default PromotionModal;
