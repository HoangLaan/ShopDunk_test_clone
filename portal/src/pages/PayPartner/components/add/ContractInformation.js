import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import Documents from './Documents';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useCallback, useMemo } from 'react';

const ContractInformation = ({ disabled, title }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Loại thẻ',
        accessor: 'type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: '% Phí giao dịch',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <FormNumber  field={`transaction_fee_${p.value === 1 ? 'lc' : 'ic'}`} />,
      },
      {
        header: 'Phí cố đinh',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <FormNumber field={`fixed_charge_${p.value === 1 ? 'lc' : 'ic'}`} />,
      },
      {
        header: 'Phí phát sinh',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <FormNumber field={`arise_fee_${p.value === 1 ? 'lc' : 'ic'}`} />,
      },
    ],
    [],
  );

  const renderData = useCallback(
    (valueRender, keyRender) => {
      return (
        <tr key={keyRender}>
          {columns
            ?.filter((value) => !value.hidden)
            .map((column, key) => {
              const className = column?.classNameBody ? column?.classNameBody : '';
              if (column.formatter) {
                return (
                  <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                    {column?.formatter(valueRender, keyRender)}
                  </td>
                );
              } else if (column.accessor) {
                return (
                  <td style={column?.style} className={className} key={`${keyRender}${key}`}>
                    {valueRender[column.accessor]}
                  </td>
                );
              } else {
                return <td style={column?.style} className={className} key={`${keyRender}${key}`}></td>;
              }
            })}
        </tr>
      );
    },
    [columns],
  );

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_2'>
            <FormItem disabled={disabled} isRequired label='Kỳ hoàn tiền'>
              <FormNumber
                field='refun_day'
                placeholder='Số ngày '
                validation={{
                  required: 'Số ngày là bắt buộc',
                }}
                addonBefore='T +'
                min={0}
                max ={31}
              />
            </FormItem>
          </div>
          <div className='bw_col_12 bw_mb_2 '>
          <h3 className='bw_mb_2'>Phí dịch vụ thanh toán <span className='bw_red'>*</span> </h3>
            <div className='bw_table_responsive'>
              <table className='bw_table'>
                <thead>
                  <tr>
                    {columns
                      ?.filter((value) => !value.hidden)
                      .map((p, o) => (
                        <th key={o} className={p?.classNameHeader ? p?.classNameHeader : ''}>
                          {p?.header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      type_name: 'Thẻ nội địa',
                      value: 1,
                    },
                    {
                      type_name: 'Thẻ quốc tế',
                      value: 2,
                    },
                  ].map((value, key) => renderData(value, key))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='bw_col_12'>
            <Documents disabled={disabled}/>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};
export default ContractInformation;
