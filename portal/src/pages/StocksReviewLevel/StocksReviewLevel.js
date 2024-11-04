import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

// common
import BWDataTable from 'components/shared/BWDataTable/index';
import BWButton from 'components/shared/BWButton/index';
// service
import { getList, deleteReviewLevel } from 'services/stocks-review-level.service';

// components
import { columns } from './components/columns';
import StocksReviewLevelFilter from './components/StocksReviewLevelFilter';
import BWModal from 'components/shared/BWModal/index';
import CheckAccess from 'navigation/CheckAccess';

const ModalContent = styled.p`
  margin-bottom: 0;
`;
export default function StocksReviewLevel() {
  const methods = useForm();
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
  });
  const [dataChoosen, setDataChoosen] = useState([]);

  const [toggle, setToggle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemDel, setItemDel] = useState(null);
  const onCloseModal = () => {
    setOpenModal(false);
  };

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    keyword: '',
    is_active: 1,
    page: 1,
    pageSize: 25,
  });

  const getData = useCallback(() => {
    try {
      getList(query)
        .then((_data) => {
          setData(_data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      window._$g.dialogs.alert(window._$g._(error.message));
    }
  }, [query]);
  useEffect(getData, [getData]);

  const handleActionRow = (item, type) => {
    let routes = {
      detail: '/stocks-review-level/detail/',
      delete: '/stocks-review-level/delete/',
      edit: '/stocks-review-level/edit/',
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${item.stocks_review_level_id}`);
    } else {
      setOpenModal(true);
      setItemDel(item?.stocks_review_level_id);
    }
  };
  const handleDelete = async (itemDel) => {
    await deleteReviewLevel(itemDel);
    setItemDel(null);
    onCloseModal();
    getData();
    setDataChoosen({});
  };

  const handleChangePage = (newPage, sizePage) => {
    let _query = { ...query };
    _query.page = newPage;
    setQuery(_query);
  };

  const handleSubmitFilter = (values) => {
    let _query = { ...query, ...values, page: 1 };
    setQuery(_query);
  };
  const headerModal = (
    <>
      <span className='bw_icon_notice'>
        <i className='fi fi-rr-bell'></i>
      </span>{' '}
      Thông báo
    </>
  );
  const handleClickAdd = () => {
    window._$g.rdr('/stocks-review-level/add');
  };
  return (
    <React.Fragment>
      <div className='bw_main_wrapp' style={{ paddingBottom: '20px' }}>
        <StocksReviewLevelFilter handleSubmitFilter={handleSubmitFilter} />
        <div className='bw_box_card bw_mt_2'>
          <div className='bw_row bw_mb_2 bw_align_items_center'>
            <div className='bw_col_4'>
              <div className='bw_show_record'>
                {' '}
                {Object.keys(dataChoosen).length > 0 && (
                  <p className='bw_choose_record'>
                    <b>{Object.keys(dataChoosen).length}</b> đang chọn <a onClick={() => setDataChoosen({})}>Bỏ chọn</a>{' '}
                    |{' '}
                    <a className='bw_red bw_delete'>
                      <b
                        onClick={() => {
                          setOpenModal(true);
                          setItemDel(Object.keys(dataChoosen));
                        }}>
                        Xoá tất cả
                      </b>
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className='bw_col_8 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
              <CheckAccess permission='ST_STOCKSREVIEWLEVEL_ADD'>
                <BWButton type='success' submit icon='fi fi-rr-add' content='Thêm mới' onClick={handleClickAdd} />
              </CheckAccess>
            </div>
          </div>
          <div className='bw_show_record bw_mb_1' />
          <BWDataTable
            data={data?.items}
            total={data?.totalItems}
            pageIndex={query?.page}
            pageSize={query?.pageSize}
            columns={columns(query?.page, query?.pageSize, handleActionRow, data, dataChoosen, setDataChoosen)}
            loading={loading}
            rowKey='funtion_id'
            handleChangePage={handleChangePage}
          />
        </div>
      </div>
      {openModal && (
        <BWModal
          onClose={onCloseModal}
          open={openModal}
          header={headerModal}
          footer='Tôi muốn xóa'
          onConfirm={() => {
            if (Array.isArray(itemDel)) {
              (itemDel || []).forEach((item) => {
                handleDelete(item);
              });
            } else {
              handleDelete(itemDel);
            }
          }}>
          <ModalContent>Bạn có thật sự muốn xóa? </ModalContent>
          <ModalContent>Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.</ModalContent>
        </BWModal>
      )}
    </React.Fragment>
  );
}
