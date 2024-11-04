import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Calendar, Col, Row, Select } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import dayLocaleData from 'dayjs/plugin/localeData'

dayjs.extend(dayLocaleData);

const CalenderStyle = styled(Calendar)`
  
  .ant-picker-date-panel {
    min-height:100% !important
  }
  .ant-picker-body{
    min-height:100% !important
  }
  .ant-picker-content{
    min-height:100% !important;
    height:500px
  }
  
`

const wrapperStyle = {
    width: "60%",
    marginTop: 14

}

const CalendarPickDate = ({ pickDate, setPickDate, disabled }) => {


    const onSelect = (value) => {
        let _pickDate = { ...pickDate }

        if (!_pickDate[`${value.format('DD/MM/YYYY')}`]) {
            _pickDate[`${value.format('DD/MM/YYYY')}`] = value.format('DD/MM/YYYY')
        } else {
            delete _pickDate[`${value.format('DD/MM/YYYY')}`]
        }
        setPickDate(_pickDate)
    }

    const dateCellRender = useCallback((value) => {

        let checked = pickDate[`${value.format('DD/MM/YYYY')}`] ? true : false
        return (
            <div style={{ display: "block", position: 'absolute', top: -12, right: -12 }}>
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onClick={() => onSelect(value)}
                />
            </div>
        )
    }, [pickDate])

    return (
        <div style={wrapperStyle}>
            <CalenderStyle
                fullscreen={false}

                disabledDate={(date) => {
                    if (date && date < dayjs().startOf('d')) {
                        return true;
                    }
                    return false;
                }}

                dateCellRender={dateCellRender}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                    const start = 0;
                    const end = 12;
                    const monthOptions = [];

                    for (let i = start; i < end; i++) {
                        monthOptions.push(
                            <Select.Option key={i} value={i} className="month-item">
                                Tháng {i + 1}
                            </Select.Option>,
                        );
                    }

                    const month = value.month();

                    return (
                        <div style={{ padding: 8 }}>
                            <Row >

                                <Col span={8}>
                                    <Select
                                        className='bw_inp'
                                        size="small"
                                        dropdownMatchSelectWidth={false}
                                        value={month}
                                        bordered={false}
                                        onChange={(newMonth) => {
                                            const now = value.clone().month(newMonth);
                                            onChange(now);
                                        }}
                                        disabled={disabled}
                                        style={{ width: '100%', padding: '2px 8px' }}
                                    >
                                        {monthOptions}
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    );
                }}
            />
        </div>


    )
}
export default CalendarPickDate