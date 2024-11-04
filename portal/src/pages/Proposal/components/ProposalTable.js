import DataTable from 'components/shared/DataTable/index';
import React, {  useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import BWImage from 'components/shared/BWImage/index';
import { deleteProposal } from 'services/proposal.service';
import { render_review } from '../utils/constants';
import BWButton from 'components/shared/BWButton';
import styled from 'styled-components';

const ActionStyled = styled.div`
  .bw_ml_2 {
    margin-left: 2px;
  }
`;

const ProposalTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  totalReview,
  onChangeStatus
}) => {
  const dispatch = useDispatch();

  const status_review = (_status) => {
    switch (_status) {
      case 1:
        return 'bw_agree';
      case 0:
        return 'bw_non_agree';
      default:
        return '';
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Loại đề xuất',
        accessor: 'proposal_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Họ và tên người được đề xuất',
        accessor: 'full_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          return (
            <div className='text-left'>
              {p?.list_review?.length === 0
                ? 'Duyệt tự động'
                : (p?.list_review || '').map((user, i) => {
                    return (
                      <ul className='bw_confirm_level'>
                        <li className={status_review(user.is_review) + ' bw_inf_pro'}>
                          <BWImage src={user?.avatar_image} />
                          <span
                            className={
                              user.is_review === 1
                                ? 'fi fi-rr-check'
                                : user.is_review === 0
                                ? 'fi fi-rr-cross'
                                : 'fi fi-rr-minus'
                            }></span>

                          <p>
                            {user.full_name} -{' '}
                            <i
                              className={
                                user.is_review === 1 ? 'bw_green' : user.is_review === 0 ? 'bw_red' : 'bw_black'
                              }>
                              {render_review(user.is_review).title}
                            </i>
                          </p>
                        </li>
                      </ul>
                    );
                  })}
            </div>
          );
        },
      },
      {
        header: 'Ngày áp dụng',
        accessor: 'effective_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span className={`bw_label_outline ${render_review(p?.is_review).status} text-center`}>
            {render_review(p?.is_review).title}
          </span>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'HR_PROPOSAL_ADD',
        onClick: () => window._$g.rdr(`/proposal/add`),
      },
      {
        icon: 'fi fi-rr-check',
        color: 'green',
        permission: 'HR_PROPOSAL_REVIEW',
        hidden: (p) => p?.is_show_review === 0,
        onClick: (p) => window._$g.rdr(`/proposal/review/${p?.proposal_id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_PROPOSAL_EDIT',
        hidden: (p) => p?.is_review === 1 || p?.is_review === 0,
        onClick: (p) => (p.is_review === 2 || p.is_review === 3) && window._$g.rdr(`/proposal/edit/${p?.proposal_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_PROPOSAL_VIEW',
        onClick: (p) => window._$g.rdr(`/proposal/detail/${p?.proposal_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_PROPOSAL_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteProposal([_?.proposal_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  const status = useMemo(
    () => [
      {
        outline: true,
        type: 'primary',
        content: `Đã duyệt (${totalReview?.total_reviewed || 0})`,
        onClick: () => onChangeStatus(1)
      },
      {
        type: 'default',
        outline: true,
        className: 'bw_ml_2',
        content: `Đang duyệt (${
          (totalReview?.total_review || 0) - (totalReview?.total_reviewed || 0) - (totalReview?.total_not_reviewed || 0)
        })`,
        onClick: () => onChangeStatus(2)
      },
      {
        type: 'danger',
        outline: true,
        className: 'bw_ml_2',
        content: `Không duyệt (${totalReview?.total_not_reviewed || 0})`,
        onClick: () => onChangeStatus(0)
      },
    ],
    [totalReview],
  );

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      title={
        <ActionStyled style={{display: 'flex'}}>
          {status.map((x) => (
            <BWButton {...x} />
          ))}
        </ActionStyled>
      }
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteProposal(e?.map((val) => parseInt(val?.proposal_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default ProposalTable;
