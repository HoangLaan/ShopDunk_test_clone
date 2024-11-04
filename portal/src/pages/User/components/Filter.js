import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

import { useAuth } from 'context/AuthProvider';
import { getOptionsForUser } from 'services/company.service';
import { getOptionsPosition } from 'services/position.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const STATUS_OPTIONS = [
  {
    value: null,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Đang làm việc',
  },
  {
    value: 3,
    label: 'Đã nghỉ việc',
  },
  {
    value: 2,
    label: 'Nghỉ thai sản',
  },
];

const GENDER_OPTIONS = [
  {
    value: null,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Nam',
  },
  {
    value: 0,
    label: 'Nữ',
  },
];

const IS_TIME_KEEPING_OPTIONS = [
  {
    value: null,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Có',
  },
  {
    value: 0,
    label: 'Không',
  },
];

const HR_PROFILE_OPTIONS = [
  {
    value: null,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Đã đầy đủ',
  },
  {
    value: 0,
    label: 'Thiếu',
  },
];

// Tạo option tháng trong năm
const createCalendarMonth = () => {
  const daysInMonth = 12;
  const dayOptions = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = { label: `Tháng ${i}`, value: `${i}` };
    dayOptions.push(currentDate);
  }
  return dayOptions;
};

const Filter = ({ onChange }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  // const methods = useForm({ defaultValues: { status: 1, gender: 2, is_time_keeping: 2, is_enough: 2 } });
  const methods = useForm({});
  const [optionsCompany, setOptionsCompany] = useState(null);
  const { blockData, departmentByBlockData, positionLevelByPositionData, hobbiesForUserData } = useSelector(
    (state) => state.global,
  );
  const [optionsPosition, setOptionsPosition] = useState(null);
  const getData = () => {
    getOptionsForUser(user.user_name).then((res) => {
      setOptionsCompany(mapDataOptions4Select(res));
    });
    // Get position options
    getOptionsPosition().then((res) => {
      setOptionsPosition(mapDataOptions4Select(res));
    });
    // Get hobbies options
    dispatch(getOptionsGlobal('hobbiesForUser'));
  };

  const documentTypeOptions = useGetOptions(optionType.documentType);

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      status: methods.watch('status') ?? 1,
      company_id: methods.watch('company_id'),
      department_id: methods.watch('department_id'),
      position_id: methods.watch('position_id'),
      // province_id: methods.watch('province_id'),
      // district_id: methods.watch('district_id'),
      // ward_id: methods.watch('ward_id'),
      gender: methods.watch('gender'),
      block_id: methods.watch('block_id'),
      user_level_id: methods.watch('user_level_id'),
      is_time_keeping: methods.watch('is_time_keeping'),
      hr_profile: methods.watch('hr_profile'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      search: '',
      status: 1,
      company_id: null,
      department_id: null,
      position_id: null,
      // province_id: null,
      // district_id: null,
      // ward_id: null,
      // gender: 2,
      block_id: null,
      user_level_id: null,
      // is_time_keeping: 2,
      // hr_profile: 2,
      document_type_ids: [],
      is_enough: null,
      user_status: 1,
    });
    onChange({
      search: '',
      status: 1,
      company_id: null,
      department_id: null,
      position_id: null,
      // province_id: null,
      // district_id: null,
      // ward_id: null,
      // gender: 2,
      block_id: null,
      user_level_id: null,
      // is_time_keeping: 2,
      // hr_profile: 2,
      document_type_ids: [],
      is_enough: null,
      user_status: 1,
    });
  };

  const handleChangeCompany = async (company_id) => {
    dispatch(getOptionsGlobal('block', { company_id }));
    methods.setValue('company_id', company_id);
    methods.setValue('block_id', null);
    methods.setValue('department_id', null);
  };

  const handleChangeBlock = async (block_id) => {
    dispatch(getOptionsGlobal('departmentByBlock', { parent_id: block_id }));

    methods.setValue('block_id', block_id);
    methods.setValue('department_id', null);
  };

  const handleChangePosition = async (position_id) => {
    dispatch(getOptionsGlobal('positionLevelByPosition', { parent_id: position_id }));

    methods.setValue('position_id', position_id);
    methods.setValue('user_level_id', null);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (optionsCompany?.length === 1) {
      const companyId = optionsCompany[0]['id'];
      dispatch(getOptionsGlobal('block', { company_id: companyId }));
      methods.setValue('company_id', companyId);
      methods.setValue('block_id', null);
      methods.setValue('department_id', null);
    }
  }, [dispatch, optionsCompany]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(value) =>
          onChange({
            ...value,
            document_type_ids: value.document_type_ids?.map((item) => item.id)?.join(','),
          })
        }
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                handleKeyDown={handleKeyDownSearch}
                type='text'
                placeholder='Nhập mã, tên, sđt, email'
                field='search'
              />
            ),
          },
          {
            title: 'Công ty',
            component: (
              <FormSelect
                field='company_id'
                placeholder='-- Chọn --'
                list={optionsCompany}
                value={optionsCompany?.length === 1 ? optionsCompany[0] : methods.watch('company_id')}
                onChange={handleChangeCompany}
                allowClear
              />
            ),
          },
          {
            title: 'Khối',
            component: (
              <FormSelect
                field='block_id'
                placeholder='-- Chọn --'
                list={mapDataOptions4Select(blockData)}
                onChange={handleChangeBlock}
                disabled={optionsCompany?.length !== 1 ? !methods.watch('company_id') : false}
                allowClear
              />
            ),
          },
          {
            title: 'Phòng ban',
            component: (
              <FormSelect
                field='department_id'
                placeholder='-- Chọn --'
                list={mapDataOptions4Select(departmentByBlockData)}
                disabled={!methods.watch('block_id')}
                allowClear
              />
            ),
          },
          {
            title: 'Trạng thái làm việc',
            component: <FormSelect field='user_status' defaultValue={1} list={STATUS_OPTIONS} allowClear />,
          },
          {
            title: 'Vị trí',
            component: (
              <FormSelect
                field='position_id'
                mode='multiple'
                placeholder='-- Chọn --'
                list={optionsPosition}
                onChange={handleChangePosition}
              />
            ),
          },
          {
            title: 'Cấp bậc',
            component: (
              <FormSelect
                field='user_level_id'
                placeholder='-- Chọn --'
                list={mapDataOptions4Select(positionLevelByPositionData)}
                disabled={!methods.watch('position_id')}
              />
            ),
          },
          {
            title: 'Tham gia chấm công',
            component: <FormSelect field='is_time_keeping' placeholder='-- Chọn --' list={IS_TIME_KEEPING_OPTIONS} />,
          },
          {
            title: 'Hồ sơ nhân sự',
            component: <FormSelect field='is_enough' placeholder='-- Chọn --' list={HR_PROFILE_OPTIONS} allowClear />,
          },
          {
            title: 'Hồ sơ thiếu',
            component: (
              <FormSelect
                mode={'multiple'}
                field='document_type_ids'
                placeholder='-- Chọn --'
                list={documentTypeOptions}
              />
            ),
          },
          {
            title: 'Giới tính',
            component: <FormSelect field='gender' placeholder='-- Chọn --' list={GENDER_OPTIONS} />,
          },
          {
            title: 'Tháng sinh',
            component: (
              <FormSelect field='birth_month' placeholder='-- Chọn --' list={createCalendarMonth()} allowClear />
            ),
          },
          {
            title: 'Sở thích',
            component: (
              <FormSelect field='hobbies_list' mode='multiple' list={mapDataOptions4Select(hobbiesForUserData)} />
            ),
          },
          // {
          //   title: 'Tỉnh/TP',
          //   component: <BWAddress type='province' field='province_id' placeholder='Tất cả' />,
          // },
          // {
          //   title: 'Quận/Huyện',
          //   component: <BWAddress type='district' field='district_id' placeholder='Tất cả' />,
          // },
          // {
          //   title: 'Phường/Xã',
          //   component: <BWAddress type='ward' field='ward_id' placeholder='Tất cả' />,
          // },
        ]}
      />
    </FormProvider>
  );
};

export default Filter;
