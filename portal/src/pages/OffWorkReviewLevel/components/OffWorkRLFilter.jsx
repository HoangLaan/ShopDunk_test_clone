import React, { useCallback, useEffect, useState } from 'react'
import FilterSearchBar from 'components/shared/FilterSearchBar/index'
import { FormProvider, useForm } from 'react-hook-form'
import FormSelect from 'components/shared/BWFormControl/FormSelect'
import FormInput from 'components/shared/BWFormControl/FormInput'
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import { getOptionsCompany } from 'services/company.service'


const { RangePicker } = DatePicker

const OffWorkRLFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 1 } })
  const [dateRange, changeDateRange] = useState(null)
  const [companyOpts, setCompanyOpts] = useState([])

  const getInitOptions = useCallback(async () => {

    let _companyOpts = await getOptionsCompany()
    setCompanyOpts(mapDataOptions4Select(_companyOpts))
  }, [])

  useEffect(() => {
    getInitOptions()
  }, [getInitOptions])

  useEffect(() => {

    methods.register("is_active")

  }, [methods.register])


  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]))
      methods.setValue('date_from', dateString[0])
      methods.setValue('date_to', dateString[1])
    } else {
      changeDateRange(null)
    }
  }

  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')]
  }

  const onClear = () => {

    methods.reset({
      keyword: '',
      is_active: 1,
      date_from: null,
      date_to: null,
      company_id: null,
    })
    changeDateRange(null)
    onChange({
      keyword: '',
      is_active: 1,
      date_from: null,
      date_to: null,
      company_id: null,
    })

  }

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm mức duyệt phép'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Tìm tên mức duyệt'} />
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' id='company_id' list={companyOpts} />
          },
          {
            title: 'Ngày tạo',
            component: <RangePicker
              allowClear={true}
              onChange={handleChangeDate}
              format='DD/MM/YYYY'
              bordered={false}
              style={{ width: '100%' }}
              placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
              value={dateRange ? dateRange : ''}
            />
          },

          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />
          }

        ]}
      />
    </FormProvider>
  )
}

export default OffWorkRLFilter
