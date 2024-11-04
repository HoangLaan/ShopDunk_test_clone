import DataTable from 'components/shared/DataTable/index'
import React, { useCallback, useMemo } from 'react'
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useDispatch } from 'react-redux'
import { msgError } from '../helpers/msgError'
import { showConfirmModal } from 'actions/global'
import CheckAccess from 'navigation/CheckAccess'

dayjs.extend(customParseFormat)

const DepartmentTable = ({ data, handleDelete }) => {
    const dispatch = useDispatch()
    const columns = useMemo(
        () => [
            {
                header: 'STT',
                classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
                classNameBody: 'bw_text_center',
                formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
            },
            {
                header: 'Phòng ban',
                formatter: (p) => <p>{p?.department_name}</p>,
            }

        ], [])


    const renderData = useCallback(
        (valueRender, keyRender) => (
            <tr>

                {columns?.map((column, key) => {
                    if (column.formatter) {
                        return (
                            <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                                {column?.formatter(valueRender, keyRender)}
                            </td>
                        );
                    } else if (column.accessor) {
                        return (
                            <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                                {valueRender[column.accessor]}
                            </td>
                        );
                    } else {
                        return <td className={column?.classNameBody} key={`${keyRender}${key}`}></td>;
                    }
                })}

                <td className='bw_sticky bw_action_table bw_text_center'>
                    <CheckAccess permission={'HR_USER_SCHEDULE_EDIT'}>
                        <a
                            onClick={() => dispatch(
                                showConfirmModal(
                                    msgError['model_error'],
                                    async () => {
                                        handleDelete('department', valueRender?.department_id)
                                    },
                                ))}
                            style={{
                                marginRight: '2px',
                            }}
                            className={`bw_btn_table bw_red`}>
                            <i className={`fi fi-rr-trash`}></i>
                        </a>
                    </CheckAccess>
                </td>

            </tr>
        ), [columns])

    return (
        <div className="bw_table_responsive">
            <table className="bw_table">
                <thead>

                    {columns?.map((p) => (
                        <th className={p?.classNameHeader}>{p?.header}</th>
                    ))}
                    <th className="bw_sticky bw_action_table bw_text_center" style={{ width: '10%' }}>Thao tác</th>
                </thead>

                <tbody>
                    {data.length ? data?.map((value, key) => {
                        return renderData(value, key);
                    }) :
                        (
                            <tr>
                                <td colSpan={4} className='bw_text_center'>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                </tbody>


            </table>
        </div>
    )
}

export default DepartmentTable
