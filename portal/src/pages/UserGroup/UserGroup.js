import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { notification } from 'antd';
// Service
import { getList, deleteUserGroup } from 'services/user-group.service';
// Components
import Filter from './components/Filter';
import Table from './components/Table'
import BWModal from 'components/shared/BWModal/index';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function UserGroup() {

    const [dataUserGroup, setDataUserGroup] = useState({
        items: [],
        itemsPerPage: 25,
        page: 0,
        totalItems: 0,
        totalPages: 0,
    });

    const [openModal, setOpenModal] = useState(false);
    const [itemDel, setItemDel] = useState([]);
    const onCloseModal = () => {
        setOpenModal(false);
    };

    const [query, setQuery] = useState({
        search: '',
        is_active: 1,
        page: 1,
        itemsPerPage: 25,
    });

    const { items, itemsPerPage, page, totalItems, totalPages } = dataUserGroup;

    const getData = useCallback(() => {
        try {
            getList(query)
                .then((data) => {
                    setDataUserGroup(data);
                })
        } catch (error) {
            notification.error({message: window._$g._(error.message)});
        }
    }, [query]);

    useEffect(getData, [getData]);

    const handleActionRow = (item, type) => {
        let routes = {
            detail: '/user-group/detail/',
            delete: '/user-group/delete/',
            edit: '/user-group/edit/',
            add: '/user-group/add'
        };
        const route = routes[type];
        if (type.match(/detail|edit/i)) {
            window._$g.rdr(`${route}${item.user_group_id}`);
        } else {
            setOpenModal(true);
            setItemDel([item]);
        }
    };

    const handleDelete = async (itemDel) => {
        await deleteUserGroup(itemDel);
        notification.success({message: 'Xóa thành công.'})
        setItemDel([]);
        onCloseModal();
        getData();
    };

    const handleSubmitFilter = (values) => {
        let _query = { ...query, ...values, page: 1 };
        setQuery(_query);
    };

    const handleChangePage = (newPage, sizePage) => {
        let _query = { ...query, page: newPage };
        setQuery(_query);
    };

    const handleBulkAction = async (items, action) => {
        if (action == 'delete') {
            setOpenModal(true);
            setItemDel(items);
        }
    }

    const headerModal = (
        <>
            <span className='bw_icon_notice'>
                <i className='fi fi-rr-bell'></i>
            </span>{' '}
            Thông báo
        </>
    );


    return (
        <>
            <div className='bw_main_wrapp'>
                <Filter
                    onChange={handleSubmitFilter}
                />
                <Table
                    onChangePage={handleChangePage}
                    data={items}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    totalItems={totalItems}
                    handleActionRow={handleActionRow}
                    handleBulkAction={handleBulkAction}
                />
            </div>
            {openModal && (
                <BWModal
                    onClose={onCloseModal}
                    open={openModal}
                    header={headerModal}
                    footer='Tôi muốn xóa'
                    onConfirm={() => handleDelete(itemDel)}
                >
                    <ModalContent>Bạn có thật sự muốn xóa? </ModalContent>
                    <ModalContent>Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.</ModalContent>
                </BWModal>
            )}
        </>
    );
}
