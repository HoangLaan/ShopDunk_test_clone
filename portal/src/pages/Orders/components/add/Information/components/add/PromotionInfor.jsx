import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { renderDiscountValue } from 'pages/Orders/helpers/utils';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import GiftModal from '../PromotionModel/GiftModal';
import _ from 'lodash';
import { Empty } from 'antd';

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

const PromotionInfor = ({ disabled, order_id, onConfirm, promotionList }) => {
    const { watch, setValue } = useFormContext();
    const [selectedPromotionOffers, setSelectedPromotionOffers] = useState([]);
    const [dataSelect, setDataSelect] = useState(watch('promotion_offers') ?? []);
    const [isPlusoint, setIsPluspoint] = useState(false);

    const onChangeSelect = useCallback(
        (selected) => {
            const promotionIds = _.uniq(selected.map((p) => p?.promotion_id));
            setIsPluspoint(
                !(promotionList.findIndex((p) => promotionIds.includes(p?.promotion_id) && !p?.is_reward_point) > -1),
            );

            setSelectedPromotionOffers(selected);
        },
        [promotionList],
    );

    useEffect(() => {
        onChangeSelect(dataSelect);
    }, [onChangeSelect, dataSelect]);

    useEffect(() => {
        if (selectedPromotionOffers || isPlusoint) {
            onConfirm(selectedPromotionOffers, isPlusoint)
        }
    }, [selectedPromotionOffers, isPlusoint]);

    const columns = useMemo(
        () => [
            {
                header: 'Tên chương trình/khuyến mại',
                accessor: 'promotion_name',
                formatter: (p) => (
                    p?.promotion_offer_id ?
                        p?.promotion_offer_name :
                        <b
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => window.open(`/promotions/detail/${p?.promotion_id}`, '_blank')}
                        >
                            {p?.promotion_name}
                        </b>
                ),
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
        ],
        [],
    );

    const colSpan = useMemo(() => {
        const spanSelect = 1;
        return spanSelect + (columns ?? []).length;
    }, [columns]);

    const selectedPromotion = useMemo(() => {
        return dataSelect
            ?.reduce((acc, curr) => {
                if (acc?.findIndex((offer) => curr?.promotion_id === offer?.promotion_id) === -1) {
                    acc.push(curr);
                }
                return acc;
            }, [])
            ?.reduce((acc, curr) => {
                const findIndex = promotionList?.findIndex((p) => p?.promotion_id === curr?.promotion_id);
                if (findIndex >= 0) {
                    acc.push(promotionList[findIndex]);
                }
                return acc;
            }, []);
    }, [dataSelect, promotionList]);

    const isApplyWithOtherPromotion = useMemo(() => {
        return selectedPromotion?.reduce((acc, curr) => {
            if (!curr?.is_apply_with_other_promotion) {
                acc = false;
            }
            return acc;
        }, true);
    }, [selectedPromotion]);

    const hiddenRowSelect = useCallback(
        (obj) => {
            const isSelected = selectedPromotion.findIndex((p) => p?.promotion_id === obj?.promotion_id) > -1;
            const promotion = promotionList.find((p) => p?.promotion_id === obj?.promotion_id);
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

    const renderData = useCallback(
        (valueRender, keyRender) => {
            let _dataSelect = [...dataSelect];

            const promotionsWithOtherPromotion = promotionList.filter(promotion => promotion.is_apply_with_other_promotion === 1)

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
                    disabled={disabled}
                    promotionsWithOtherPromotion={promotionsWithOtherPromotion?.length > 0 ? promotionsWithOtherPromotion : null}
                />
            );
        },
        [dataSelect, promotionList, colSpan, columns, hiddenRowSelect],
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
        <div>
            <div>
                <Wrapper>
                    <div className='bw_table_responsive'>
                        <table className='bw_table'>
                            <thead>
                                <tr style={{ whiteSpace: 'none' }}>
                                    <th className='bw_sticky bw_check_sticky'>
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

                            {jsx_tbody}
                        </table>
                    </div>
                </Wrapper>
            </div>
            {/* <div className='bw_footer_modal bw_mt_1' style={{}}>
                <button
                    type='button'
                    className='bw_btn bw_btn_success'
                    onClick={() => {
                        onConfirm(selectedPromotionOffers, isPlusoint);
                    }}>
                    <span className='fi fi-rr-check' /> Áp dụng
                </button>
            </div> */}
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
    promotionsWithOtherPromotion,
    disabled
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
                return '';
            }
        }
    };

    const findIndex = useMemo(() => {
        return _dataSelect.findIndex((o) => {
            return (
                String(o?.promotion_offer_id) === String(valueRender?.promotion_offer_id) &&
                String(o?.promotion_id) === String(valueRender?.promotion_id)
            );
        });
    }, [_dataSelect, valueRender]);

    const onChangeGift = useCallback(
        (selected) => {
            const newSelected = selected?.filter((o) => o?.quantity > 0) || [];

            setDataSelect((prev) => {
                // tìm offer đang chọn
                const find = prev?.findIndex(
                    (o) => o?.promotion_id === valueRender?.promotion_id && o?.promotion_offer_id === valueRender?.promotion_offer_id,
                );

                if (find >= 0) {
                    //tìm và sửa lại các offer đã chọn
                    prev[find].gifts = prev[find].gifts.map((o) => {
                        const findGift = newSelected.findIndex((p) => p?.product_gift_id === o?.product_gift_id);
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
        [setDataSelect, valueRender?.promotion_id, valueRender?.promotion_offer_id],
    );

    const oldSelectedGift = useMemo(() => {
        return dataSelect?.find(
            (o) => o?.promotion_id === valueRender?.promotion_id && o.promotion_offer_id === valueRender.promotion_offer_id,
        )?.gifts;
    }, [dataSelect, valueRender?.promotion_id, valueRender?.promotion_offer_id]);

    useEffect(() => {
        if (!dataExpaned) {
            setDataExpaned(valueRender?.offers);
        }
    }, [dataExpaned, valueRender?.offers]);

    useEffect(() => {
        if (Array.isArray(dataExpaned) && dataExpaned?.length > 0 && promotionsWithOtherPromotion?.length < 2 && !disabled) {
            setDataSelect(dataExpaned);
        } else {
            if (Array.isArray(dataExpaned) && dataExpaned?.length > 0 && !disabled) {
                dataExpaned?.forEach((item) => {
                    const exists = promotionsWithOtherPromotion?.some((selectedItem) => selectedItem?.promotion_id === item?.promotion_id);
                    if (exists) {
                        setDataSelect((prevData) => prevData?.concat(item));
                    }
                });
            }
        }
    }, [dataExpaned]);

    return (
        <>
            <tr key={keyRender} className={findIndex >= 0 ? 'bw_checked' : ''}>
                <td className='bw_sticky bw_check_sticky' style={{ zIndex: 10 }}>
                    {valueRender?.defend_key ? (
                        <label
                            style={{
                                marginRight: '2px',
                                display: `${!levelRecursive || (typeof hiddenRowSelect === 'function' && hiddenRowSelect(valueRender))
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

export default PromotionInfor;
