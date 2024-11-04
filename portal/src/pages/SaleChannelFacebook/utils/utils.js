import { Link } from 'react-router-dom'

export function convertStringToNumber(string, char = '.') {
  const value =
    char == '.' ? `${string + ''}`.replace(/\./g, '').replace(/,/g, '.') : `${string + ''}`.replace(/,/g, '');
  return !value ? 0 : parseFloat(value);
}

const numberFormatIntl = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
export function numberFormat(val) {
  return numberFormatIntl.format(val);
}


/**
 * Config table object?
 * @return {Object}
 */
export function configTableOptions(count = 0, page, query) {
  return {
      fixedHeader: true,
      filterType: 'dropdown',
      selectableRows: 'single',
      responsive: 'stacked',
      count: count,
      page: 0,
      rowsPerPage: query?.itemsPerPage || 25,
      rowsPerPageOptions: [25, 50, 75, 100],
      download: false,
      print: false,
      viewColumns: false,
      search: false,
      filter: false,
      pagination: false,
      textLabels: {
          body: {
              noMatch: "Không tìm thấy dữ liệu.",
              toolTip: "Sắp xếp",
          },
          pagination: {
              next: "Trang tiếp theo",
              previous: "Trang trước đó",
              rowsPerPage: "Số dòng trên trang:",
              displayRows: "của",
          },
      },
      fixedSelectColumn: true,
  };
}
