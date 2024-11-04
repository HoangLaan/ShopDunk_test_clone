import { getOptionsGlobal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import { Empty, Tooltip } from 'antd';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import {
  getListRequestPurchase,
  getListReview,
  getRemainingAllocationBudget,
  getTreeRequestUsingBudget,
} from 'services/request-using-budget.service';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { PERMISSION } from 'pages/RequestUsingBudget/utils/constants';

const BudgetGoalTable = ({ title, disabled, isAdd, isReview }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { error } = methods.getFieldState('list_budget_goal', methods.formState);
  console.log('error', error);
  const { control, setValue, watch } = methods;
  const { documentTypeData } = useSelector((state) => state.global);
  const [totalRemainingAllocationBudget, setTotalRemainingAllocationBudget] = useState(0);
  const [listRequestPurchase, setListRequestPurchase] = useState([]);

  useEffect(() => {
    if (!documentTypeData) dispatch(getOptionsGlobal('documentType'));
  }, [dispatch, documentTypeData]);

  useEffect(() => {
    getListRequestPurchase().then(setListRequestPurchase);
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'list_budget_goal',
    rules: {
      minLength: 1,
    },
  });

  const total_request_budget = watch('list_budget_goal')?.reduce((total, item) => total + +item.request_budget, 0) || 0;
  const total_difference_budget =
    watch('list_budget_goal')?.reduce(
      (total, item) => total + Math.abs((totalRemainingAllocationBudget || 0) - item.request_budget || 0) || 0,
      0,
    ) || 0;

  const loadListReview = useCallback(() => {
    if (isAdd && total_request_budget > 0) {
      getListReview({ budget_type_id: watch('budget_type_id'), total_budget: total_request_budget }).then((res) => {
        let data = res;
        if (res?.length > 0 && res?.[0]?.isLevelOut) {
          methods.clearErrors('list_review');
          data = [{ review_name: null, review_user: null, users: res?.[0]?.users, isLevelOut: res?.[0]?.isLevelOut }];
        }
        methods.clearErrors('list_review');
        setValue('list_review', data);
      });
    }
    setValue('total_request_budget', total_request_budget);
  }, [total_request_budget, watch('budget_type_id')]);

  useEffect(loadListReview, [loadListReview]);

  const loadTree = (param) => {
    return new Promise(async (resolve, reject) => {
      try {
        let params = {
          parent_id: param.parent_id,
        };
        let res = await getTreeRequestUsingBudget(params);
        let data = (res || []).map((x) => ({
          id: x.item_id,
          pId: x.parent_id || 0,
          value: `${x.item_id}`,
          title: x.item_code,
          isLeaf: x.is_child === 1 ? true : false,
        }));
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleChangeRequestBudget = (value, index) => {
    methods.clearErrors(`list_budget_goal.${index}.request_budget`);
    methods.setValue(`list_budget_goal.${index}.request_budget`, value);
    if (!isReview) {
      methods.setValue(`list_budget_goal.${index}.request_budget_review`, value);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Loại chứng từ',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => (
          <FormSelect
            disabled={disabled || isReview}
            list={mapDataOptions4SelectCustom(documentTypeData, 'id', 'name')}
            field={`list_budget_goal.${index}.document_type_id`}
            validation={{ required: 'Loại chứng từ chọn là bắt buộc' }}></FormSelect>
        ),
      },
      {
        header: 'Mã chứng từ ',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => (
          <Tooltip
            title={
              watch(`list_budget_goal.${index}.document_code`)
                ? listRequestPurchase.find(
                    (x) => x.request_purchase_code === watch(`list_budget_goal.${index}.document_code`),
                  )?.description || ''
                : null
            }>
            <FormSelect
              disabled={disabled || isReview}
              list={mapDataOptions4SelectCustom(listRequestPurchase, 'request_purchase_code', 'request_purchase_code')}
              field={`list_budget_goal.${index}.document_code`}
              validation={{
                required: 'Mã chứng từ chọn là bắt buộc',
              }}></FormSelect>
          </Tooltip>
        ),
      },
      {
        header: 'Mã khoản mục',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => (
          <FormTreeSelect
            disabled={disabled || isReview}
            field={`list_budget_goal.${index}.item_id`}
            validation={{
              required: 'Mã khoản mục chọn là bắt buộc',
            }}
            fetchOptions={loadTree}
            treeDataSimpleMode></FormTreeSelect>
        ),
      },
      {
        header: 'Diễn giải nội dung',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => (
          <FormTextArea
            disabled={disabled || isReview}
            className={'bw_inp'}
            field={`list_budget_goal.${index}.explain`}></FormTextArea>
        ),
      },
      {
        header: 'Số ngân sách đề nghị',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => (
          <FormNumber
            min={0}
            disabled={disabled || isReview}
            bordered
            addonAfter='đ'
            field={`list_budget_goal.${index}.request_budget`}
            onChange={(value) => handleChangeRequestBudget(value, index)}
          />
        ),
      },
      {
        header: 'Số ngân sách được phân bổ còn lại',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: () => `${totalRemainingAllocationBudget} đ`,
      },
      {
        header: 'Chênh lệch',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) =>
          `${Math.abs(
            (totalRemainingAllocationBudget || 0) - (watch(`list_budget_goal.${index}.request_budget`) || 0),
          )} đ`,
      },
      {
        header: 'Số ngân sách duyệt',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (_, index) => (
          <FormNumber
            disabled={!isReview}
            addonAfter='đ'
            min={0}
            bordered
            field={`list_budget_goal.${index}.request_budget_review`}
          />
        ),
      },
    ],
    [documentTypeData],
  );
  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        permission: [PERMISSION.ADD, PERMISSION.EDIT, PERMISSION.COPY] ,
        content: 'Thêm dòng',
        onClick: () => {
          append({
            document_type_id: null,
            document_code: null,
            item_id: null,
            request_budget: null,
            request_budget_review: null,
          });
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: [PERMISSION.ADD, PERMISSION.EDIT, PERMISSION.COPY],
        onClick: (item, index) => {
          remove(index);
        },
      },
    ],
    [],
  );
  useEffect(() => {
    let department_id = watch('department_id');
    if (department_id)
      getRemainingAllocationBudget({ department_id: department_id }).then((res) =>
        setTotalRemainingAllocationBudget(res.total_remaining_allocation_budget),
      );
  }, [watch('department_id')]);
  const jsx_tbody =
    fields?.length > 0 ? (
      <tbody>
        {fields?.map((value, keyRender) => (
          <tr key={keyRender}>
            {columns
              ?.filter((value) => !value.hidden)
              .map((column, key) => {
                const className = column?.classNameBody ? column?.classNameBody : '';
                if (column.formatter) {
                  return (
                    <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                      {column?.formatter(value, keyRender)}
                    </td>
                  );
                } else if (column.accessor) {
                  return (
                    <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                      {value[column.accessor]}
                    </td>
                  );
                } else {
                  return <td style={column?.style} className={className} key={`${keyRender}${key}`}></td>;
                }
              })}
            {Boolean(actions.length) && !disabled && (
              <td className='bw_sticky bw_action_table bw_text_center'>
                {actions
                  ?.filter((p) => !p.globalAction && !p.hidden)
                  .map((props, i) => {
                    const { permission, onClick, color, icon, title } = props;
                    return (
                      <CheckAccess permission={permission}>
                        <a
                          onClick={(_) => onClick?.(value, keyRender)}
                          title={title}
                          className={`bw_btn_table bw_${color}`}>
                          <i className={`fi ${icon}`}></i>
                        </a>
                      </CheckAccess>
                    );
                  })}
              </td>
            )}
          </tr>
        ))}
        <tr>
          <td colSpan={5} className='bw_text_center'>
            Tổng
          </td>
          <td className='bw_text_center'>{total_request_budget} đ</td>
          <td className='bw_text_center'>
            {watch('list_budget_goal')?.reduce((total, item) => total + totalRemainingAllocationBudget, 0) || 0} đ
          </td>
          <td className='bw_text_center'>{total_difference_budget} đ</td>
          <td className='bw_text_center'>
            {watch('list_budget_goal')?.reduce((total, item) => total + +item.request_budget_review, 0) || 0} đ
          </td>
          <td></td>
        </tr>
      </tbody>
    ) : (
      <tbody>
        <tr>
          <td colSpan={columns.length}>
            <Empty description='Không có dữ liệu' />
          </td>
        </tr>
      </tbody>
    );
  return (
    <BWAccordion title={title}>
      <div className='bw_box_card bw_mt_2'>
        <div className='bw_row bw_mb_2 bw_align_items_center'>
          <div className='bw_col_6'>{error && <ErrorMessage message={error?.message} />}</div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'>
            {!disabled &&
              actions
                ?.filter((p) => p.globalAction && !p.hidden)
                .map((props, i) => (
                  <CheckAccess permission={props?.permission}>
                    <BWButton
                      style={{
                        marginLeft: '3px',
                      }}
                      {...props}
                    />
                  </CheckAccess>
                ))}
          </div>
        </div>
        <div className='bw_table_responsive'>
          <table className='bw_table' id='budget_goal_table'>
            <thead>
              <tr>
                {columns
                  ?.filter((value) => !value.hidden)
                  .map((p, o) => (
                    <th key={o} className={p?.classNameHeader ? p?.classNameHeader : ''}>
                      {p?.header}
                    </th>
                  ))}
                {Boolean(actions.filter((x) => !x.globalAction).length) && !disabled && (
                  <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
                )}
              </tr>
            </thead>
            {jsx_tbody}
          </table>
        </div>
      </div>
    </BWAccordion>
  );
};
export default BudgetGoalTable;
