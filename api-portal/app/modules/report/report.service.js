const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const reportClass = require('./report.class')
const xl = require('excel4node')
const moment = require('moment')

function formatPrice(x) {
    if (!x) return 0
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };
  
  const getTextAfterLabel = (string, label) => {
    return string.toLowerCase().startsWith(label.toLowerCase()) ? string.slice(label.length).trim() : string;
  };
  
 const convertedArr = (arr = []) => {
    const regions = [];
    const others = [];
  
    arr.forEach(item => {
      const textBeforeHyphen = item.split('-')[0].trim();
      const textAfterHyphen = item.split('-')[1]?.trim();
      
      const cleanedText = getTextAfterLabel(textBeforeHyphen, 'Chi nhánh');
      
      if (textBeforeHyphen.toLowerCase().startsWith('chi nhánh')) {
        regions.push(capitalizeWords(cleanedText));
      } else {
        others.push(capitalizeWords(textBeforeHyphen));
      }
    });
  
    if (regions.length === 0 && others.length > 0) {
      return `Chi nhánh: ${others.join(', ')}`;
    }
  
    const regionsString = regions.length > 0 ? `Chi nhánh: ${regions.join(', ')}` : '';
    const othersString = others.length > 0 ? `, ${others.join(', ')}` : '';
  
    return `${regionsString}${othersString}`;
  };

  const formatPriceNegative = (x, type = ',') => {
    if (!x) return '0'
    if(+x < 0){
      return '(' + Math.abs(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, type) + ')'
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, type)
  
  }

  const dateReport = (obj) => {
    if(obj?.value == null || obj?.value === 1 || obj?.value === 2){
      return `Ngày ${obj?.from_date} - ${obj?.to_date}`
    } else if (obj?.value === 19) { //Nam nay
      return
    } else if (obj?.value === 20) {
      return `Tháng ${moment().format('MM')} năm ${moment().year()}`
    } else if (obj?.value === 21) {
      return `Quý ${moment().quarter()} năm ${moment().year()}`
    } else {
      return `${obj?.label} năm ${moment().year()}`
    }
  }
  const monthDefault = `Tháng ${moment().format('MM')}`

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('DATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('DATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('STOREID', queryParams.store_id ? queryParams?.store_id?.join('|') : null)
            .input('BUSINESSID', queryParams?.business_id ? queryParams?.business_id?.join('|') : null)
            .input('PRODUCTIDS', queryParams?.product_id ? queryParams?.product_id?.join('|') : null)
            .input('ACCOUNTIDS', queryParams?.account_id ? queryParams?.account_id?.join('|') : null)
            .input('MODELID', apiHelper.getFilterBoolean(queryParams, 'model_id'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('RP_REPORT_GetListReportV1_AdminWeb');
        
        let datas = data.recordset;
        return new ServiceResponse(true, '', {
            data: reportClass.list(datas),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(datas),
            total_money: reportClass.totalMoney(data.recordsets[1][0])
        });
    } catch (e) {
        logger.error(e, { function: 'reportService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getListAccounting = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('DATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('DATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('STOREID', queryParams.store_id ? queryParams?.store_id?.join('|') : null)
            .input('BUSINESSID', queryParams?.business_id ? queryParams?.business_id?.join('|') : null)
            .input('PRODUCTIDS', queryParams?.product_id ? queryParams?.product_id?.join('|') : null)
            .input('ACCOUNTIDS', queryParams?.account_id ? queryParams?.account_id?.join('|') : null)
            .input('MODELID', apiHelper.getFilterBoolean(queryParams, 'model_id'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('IMEICODE', apiHelper.getValueFromObject(queryParams, 'imei'))
            .execute('RP_REPORT_GetListReportV2_AdminWeb');
        
        let datas = data.recordset;
        return new ServiceResponse(true, '', {
            data: reportClass.listAccounting(datas),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(datas),
            total_money: reportClass.totalMoney(data.recordsets[1][0])
        });
    } catch (e) {
        logger.error(e, { function: 'reportService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

//export excel
const exportExcel = async (queryParams = {}) => {
    try {
        const getListRes = await getList({...queryParams, page: 1, itemsPerPage: 500000})
        const { data } = getListRes.getData();

        const styles = {
            body_center: {
                alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
            },
            body_center_right: {
                alignment: { horizontal: 'right', vertical: 'center', wrapText: true }
            },
            body_center_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
            },
            body_head: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true,color: 'FFFFFF' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
        };

        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });
        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Sổ chi tiết bán hàng');

        work_sheet.row(1).setHeight(25);
        work_sheet.row(2).setHeight(25);
        work_sheet.row(4).setHeight(25);

        work_sheet.cell(1, 1, 1, 24, true).string('SỔ CHI TIẾT BÁN HÀNG').style(styles.body_head)
        work_sheet.cell(2, 1, 2, 24, true).string(`${queryParams?.list_business ? convertedArr(queryParams?.list_business) + ',' : ''}` + ` ${queryParams?.time_report ? dateReport(JSON.parse(queryParams?.time_report)) : `${monthDefault} năm ${moment().year()}`} `).style(styles.body_head)
        work_sheet.cell(3, 1, 3, 24, true).string('').style(styles.body_head)

        const headers = [
            'Ngày hạch toán', 'Ngày chứng từ', 'Số chứng từ', 'Ngày hóa đơn', 'Số hóa đơn', 'Diễn giải chung',
            'Tên hàng trên chứng từ', 'Mã khách hàng', 'Tên khách hàng', 'Mã số thuế', 'Mã hàng', 'Tên hàng',
            'ĐVT', 'Tổng số lượng bán', 'Đơn giá', 'Doanh số bán', 'TK Nợ', 'TK Có', 'Chiết khấu', 'Tổng số lượng trả lại',
            'Giá trị trả lại', 'Giá trị giảm giá', 'Thuế GTGT', 'Tổng thanh toán'
        ];

        headers.map((x, i) => {
            work_sheet.column(i + 1).setWidth(25);
        })
        headers.forEach((header, index) => {
            work_sheet.cell(4, index + 1, 4, index + 1, true) // start from row 4
                .string(header)
                .style(styles.header)
        });

        let row_position = 5;
        for (let i = 0; i < data.length; i++) {
            work_sheet.cell(row_position, 1).string(`${data[i]?.accounting_date || ''}`).style(styles.body_center_center);
            work_sheet.cell(row_position, 2).string(`${data[i]?.receiverslip_date || ''}`).style(styles.body_center_center);
            work_sheet.cell(row_position, 3).string(`${data[i]?.code || ''}`).style({...styles.body_center});
            work_sheet.cell(row_position, 4).string(`${data[i]?.explain || ''}`).style(styles.body_center_center);
            work_sheet.cell(row_position, 5).string(`${data[i]?.invoice_no || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 6).string(`${data[i]?.notes || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 7).string(`${data[i]?.product_display_name || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 8).string(`${data[i]?.customer_code || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 9).string(`${data[i]?.customer_name || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 10).string(`${data[i]?.tax || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 11).string(`${data[i]?.product_code || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 12).string(`${data[i]?.product_name || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 13).string(`${data[i]?.unit || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 14).string(`${data[i]?.total_sell || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 15).string(`${formatPrice(data[i]?.price) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 16).string(`${formatPrice(+data[i]?.price * +data[i]?.total_sell )|| ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 17).string(`${data[i]?.revenue_account || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 18).string(`${data[i]?.debt_account || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 19).string(`${formatPrice(data[i]?.discount_value) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 20).string(`${data[i]?.total_amount_back || ''}`).style(styles.body_center_right); //tong slg tra lai
            work_sheet.cell(row_position, 21).string(`${data[i]?.value_back || ''}`).style(styles.body_center_right); //gtri tra lai
            work_sheet.cell(row_position, 22).string(`${data[i]?.value_dis || ''}`).style(styles.body_center_right); //gtri giam gia
            work_sheet.cell(row_position, 23).string(`${formatPrice(data[i]?.vat) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 24).string(`${formatPrice(data[i]?.total_pay) || ''}`).style(styles.body_center_right);

            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (e) {
        logger.error(e, { function: 'reportService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

//export excel accounting
const exportExcelAccounting = async (queryParams = {}) => {
    try {
        const getListRes = await getListAccounting({...queryParams, page: 1, itemsPerPage: 500000})
        const { data } = getListRes.getData();

        const styles = {
            body_center: {
                alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
            },
            body_center_right: {
                alignment: { horizontal: 'right', vertical: 'center', wrapText: true }
            },
            body_center_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
            },
            body_center_number: {
                alignment: { horizontal: 'right', vertical: 'center', wrapText: true },
                font: { bold: true, color: 'red' },
            },
            body_head: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true,color: 'FFFFFF' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
        };

        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });
        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Sổ chi tiết bán hàng');

        work_sheet.row(1).setHeight(25);
        work_sheet.row(2).setHeight(25);
        work_sheet.row(4).setHeight(25);

        work_sheet.cell(1, 1, 1, 31, true).string('SỔ CHI TIẾT BÁN HÀNG').style(styles.body_head)
        work_sheet.cell(2, 1, 2, 31, true).string(`${queryParams?.list_business ? convertedArr(queryParams?.list_business) + ',' : ''}` + ` ${queryParams?.time_report ? dateReport(JSON.parse(queryParams?.time_report)) : `${monthDefault} năm ${moment().year()}`} `).style(styles.body_head)
        work_sheet.cell(3, 1, 3, 31, true).string('').style(styles.body_head)

        const headers = [
            'Ngày hạch toán', 'Ngày chứng từ', 'Số chứng từ', 'Ngày hóa đơn', 'Số hóa đơn', 'Diễn giải chung',
            'Tên hàng trên chứng từ', 'Mã khách hàng', 'Tên khách hàng', 'Mã số thuế', 'Mã hàng', 'Tên hàng',
            'ĐVT', 'Tổng số lượng bán', 'Đơn giá', 'Doanh số bán', 'TK Nợ', 'TK Có', 'Chiết khấu', 'Tổng số lượng trả lại',
            'Giá trị trả lại', 'Giá trị giảm giá', 'Thuế GTGT', 'Tổng thanh toán', 'Đơn giá vốn', 'TK Giá vốn',
            'TK Kho', 'Giá vốn', 'Mã kho', 'LN gộp', 'Tổng LN gộp'
        ];

        headers.map((x, i) => {
            work_sheet.column(i + 1).setWidth(25);
        })
        headers.forEach((header, index) => {
            work_sheet.cell(4, index + 1, 4, index + 1, true) // start from row 4
                .string(header)
                .style(styles.header)
        });

        let row_position = 5;
        for (let i = 0; i < data.length; i++) {
            work_sheet.cell(row_position, 1).string(`${data[i]?.accounting_date || ''}`).style(styles.body_center_center);
            work_sheet.cell(row_position, 2).string(`${data[i]?.receiverslip_date || ''}`).style(styles.body_center_center);
            work_sheet.cell(row_position, 3).string(`${data[i]?.code || ''}`).style({...styles.body_center});
            work_sheet.cell(row_position, 4).string(`${data[i]?.explain || ''}`).style(styles.body_center_center);
            work_sheet.cell(row_position, 5).string(`${data[i]?.invoice_no || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 6).string(`${data[i]?.notes || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 7).string(`${data[i]?.product_display_name || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 8).string(`${data[i]?.customer_code || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 9).string(`${data[i]?.customer_name || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 10).string(`${data[i]?.tax || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 11).string(`${data[i]?.product_code || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 12).string(`${data[i]?.product_name || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 13).string(`${data[i]?.unit || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 14).string(`${data[i]?.total_sell || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 15).string(`${formatPrice(data[i]?.price) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 16).string(`${formatPrice(+data[i]?.price * +data[i]?.total_sell )|| ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 17).string(`${data[i]?.revenue_account || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 18).string(`${data[i]?.debt_account || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 19).string(`${formatPrice(data[i]?.discount_value) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 20).string(`${data[i]?.total_amount_back || ''}`).style(styles.body_center_right); //tong slg tra lai
            work_sheet.cell(row_position, 21).string(`${data[i]?.value_back || ''}`).style(styles.body_center_right); //gtri tra lai
            work_sheet.cell(row_position, 22).string(`${data[i]?.value_dis || ''}`).style(styles.body_center_right); //gtri giam gia
            work_sheet.cell(row_position, 23).string(`${formatPrice(data[i]?.vat) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 24).string(`${formatPrice(data[i]?.total_pay) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 25).string(`${formatPrice(data[i]?.money) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 26).string(`${data[i]?.account_money || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 27).string(`${data[i]?.account_stocks || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 28).string(`${formatPrice(data[i]?.money * data[i]?.total_sell) || ''}`).style(styles.body_center_right);
            work_sheet.cell(row_position, 29).string(`${data[i]?.code_stocks || ''}`).style(styles.body_center);
            work_sheet.cell(row_position, 30).string(`${formatPriceNegative((+data[i]?.total_pay - (+data[i]?.money * +data[i]?.total_sell)))}`).style((+data[i]?.total_pay - +(data[i]?.money * data[i]?.total_sell)) < 0 ? styles.body_center_number : styles.body_center_right);
            work_sheet.cell(row_position, 31).string(`${formatPriceNegative(data[i]?.total_pay - (data[i]?.money * data[i]?.total_sell)) || ''}`).style((+data[i]?.total_pay - +(data[i]?.money * data[i]?.total_sell)) < 0 ? styles.body_center_number : styles.body_center_right);

            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (e) {
        logger.error(e, { function: 'reportService.exportExcelAccounting' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getList,
    getListAccounting,
    exportExcel,
    exportExcelAccounting
};