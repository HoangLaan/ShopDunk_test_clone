const _ = require('lodash');

/**
 * return new array with mapped excel header (rows[0])
 * @param {Array} data
 * @param {Number} startIndex : skip STT column
 */
const transformArrayExcel = (rows, startIndex = 1) => {
    const result = [];
    const header = rows[0];
    for (let i = startIndex; i < rows.length; i++) {
        const rowItem = {};
        for (let j = startIndex; j < header.length; j++) {
            const keyExcel = header[j];
            const valueExcel = rows[i][j];
            rowItem[keyExcel] = valueExcel;
        }
        result.push(rowItem);
    }
    return result;
};

const mappedArrayToNewKey = (array = [], mapped = {}) => {
    return array.map((item) => {
        return _.mapKeys(item, (value, key) => mapped[key]);
    });
};

const transformValues = (array = [], booleanKeys = ['is_active']) => {
    return array.map((item) => {
        for (let key in item) {
            const value = item[key];
            if (booleanKeys.includes(key)) {
                item[key] = value.toLowerCase() === 'có' || value === '1' ? 1 : 0;
            } else {
                item[key] = (value || '').toString().trim();
            }
        }
        return item;
    });
};

const defaultHeaderTyppe = {
    font: {
        bold: true,
        color: 'white',
    },
    alignment: {
        horizontal: 'center',
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: 'black',
        },
        right: {
            style: 'thin',
            color: 'black',
        },
        top: {
            style: 'thin',
            color: 'black',
        },
        bottom: {
            style: 'thin',
            color: 'black',
        },
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: 'black',
        fgColor: 'black',
    },
};

const defaultBodyStyle = {
    border: {
        left: {
            style: 'thin',
            color: 'black',
        },
        right: {
            style: 'thin',
            color: 'black',
        },
        top: {
            style: 'thin',
            color: 'black',
        },
        bottom: {
            style: 'thin',
            color: 'black',
        },
    },
};

function columnToLetter(column) {
    var temp,
        letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

function letterToColumn(letter) {
    var column = 0,
        length = letter.length;
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}

const addWorksheet = (
    wb,
    title = null,
    sheetName = '',
    columns = [{ width: 0, title: '', style: null, field: '', formatter: (item, index) => {}, validate: null }],
    data = [],
    headerStyle = defaultHeaderTyppe,
    bodyStyle = defaultBodyStyle,
    options = {},
) => {
    try {
        const ws = wb.addWorksheet(sheetName, options);

        // title
        for (let index = 0; index < columns.length; index++) {
            // set width
            ws.column(index + 1).setWidth(columns[index]?.width || 10);

            // add title
            if (title && index === 0) {
                ws.cell(1, 1, 1, columns.length, true)
                    .string(title)
                    .style({
                        font: {
                            bold: true,
                        },
                        alignment: { horizontal: 'center' },
                    });
            }

            // header
            ws.cell(title ? 2 : 1, index + 1)
                .string(columns[index]?.title || '')
                .style(_.isObject(columns[index].style) ? columns[index].style : headerStyle);

            // add validate
            if (_.isObject(columns[index].validate)) {
                let validate = columns[index].validate;

                if (!Boolean(validate.sqref)) {
                    const currColumn = columnToLetter(index + 1);
                    const startDataRow = title ? 3 : 2;
                    const endDataRow = startDataRow + (data.length || 1) - 1;

                    validate = {
                        ...validate,
                        sqref: `${currColumn}${startDataRow}:${currColumn}${endDataRow}`,
                    };
                }

                ws.addDataValidation(validate);
            }
        }

        // data
        if (data && data.length > 0) {
            let indexRow = title ? 3 : 2;
            for (let indexData = 0; indexData < data.length; indexData++) {
                let item = data[indexData];
                for (let indexCol = 1; indexCol <= columns.length; indexCol++) {
                    ws.cell(indexRow, indexCol)
                        .string(
                            _.isFunction(columns[indexCol - 1]?.formatter)
                                ? `${columns[indexCol - 1].formatter(item, indexData)}`
                                : `${item[columns[indexCol - 1]?.field] || ''}`,
                        )
                        .style(bodyStyle || {});
                }
                indexRow++;
            }
        }
        return wb;
    } catch (error) {
        console.log(error);
    }
};

const clearInput = (value = '') => String(value).trim().toLowerCase();

const getValueExcel = (rows, keyObj, is_title = true) => {
    let keys = {};
    let data = [];
    let firstRow = is_title ? 1 : 0;

    for (let i = 0; i < rows.length; i++) {
        if (i === firstRow) {
            for (let j = 0; j < rows[i].length; j++) {
                keys = {
                    ...keys,
                    [j]: Object.keys(keyObj).find(
                        (x, index) =>
                            index === Object.values(keyObj).findIndex((y) => clearInput(y) === clearInput(rows[i][j])),
                    ),
                };
            }
        }

        if (i >= firstRow) {
            let item = {};

            for (let j = 0; j < rows[i].length; j++) {
                item = {
                    ...item,
                    [keys[j]]: `${rows[i][j] || ''}`.trim(),
                };
            }
            data.push(item);
        }
    }

    return data;
};

const excelHeaderStyle = {
    font: {
        bold: true,
        color: '#FFFFFF',
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#0b2447',
    },
};

const addSheet = ({ workbook, sheetName, config, data = [], headerStyle = excelHeaderStyle, isAddNoNum = false }) => {
    const worksheet = workbook.addWorksheet(sheetName, {});
    const headerRow = {};
    let _config = { ...config };
    if (isAddNoNum) {
        _config = {
            index: { title: 'STT', width: 5 },
            ..._config,
        };
        data.forEach((item, index) => (item.index = index + 1));
    }
    Object.keys(_config).forEach((key) => (headerRow[key] = _config[key].title));
    data.unshift(headerRow);

    const fields = Object.keys(_config);
    for (let indexCol = 1; indexCol <= fields.length; indexCol++) {
        const field = fields[indexCol - 1];
        const width = _config[field].width || 20;
        worksheet.column(indexCol).setWidth(width);
        worksheet.cell(1, indexCol).style(workbook.createStyle(headerStyle));

        if (_config[field].validate) {
            const validate = _config[field].validate;

            const letterCol = columnToLetter(indexCol);
            const startRowIndex = 2;

            worksheet.addDataValidation({
                ...validate,
                sqref: `${letterCol}${startRowIndex}:${letterCol}${data.length + startRowIndex + 1}`,
            });
        }
    }

    data.forEach((item, indexRow) => {
        fields.forEach((field, indexCol) => {
            worksheet.cell(indexRow + 1, indexCol + 1).string((item[field] || '').toString());
        });
    });
};

const addOptionToData = (data = [], optionKey = 'option') => {
    return data.map((dataItem) => ({
        ...dataItem,
        [optionKey]: `${dataItem?.id || ''} - ${dataItem?.name || ''}`,
    }));
};

const addSheetGetList = ({
    workbook,
    sheetName,
    header,
    data = [],
    isIndex = true,
    headerStyle = excelHeaderStyle,
    indexHeaderMustBeNumber = [],
}) => {
    if (isIndex) {
        header = { index: 'STT', ...header };
        data = data.map((item, index) => ({ ...item, index: (index + 1).toString() }));
    }

    const worksheet = workbook.addWorksheet(sheetName, {});
    const _headerStyle = workbook.createStyle(headerStyle);
    data.unshift(header);

    const columnKeys = Object.keys(header);
    for (let indexCol = 1; indexCol <= columnKeys.length; indexCol++) {
        const width = columnKeys[indexCol - 1] === 'index' ? 5 : 20;
        worksheet.column(indexCol).setWidth(width);
        worksheet.cell(1, indexCol).style(_headerStyle);
    }
    data.forEach((item, indexRow) => {
        columnKeys.forEach((key, indexCol) => {
            const isNumber = indexHeaderMustBeNumber.includes(parseInt(indexCol));
            worksheet
                .cell(indexRow + 1, indexCol + 1)
                [isNumber && indexRow !== 0 ? 'number' : 'string'](item[key] ?? (isNumber ? 0 : ''));
        });
    });
};

const createTableData = (ws, configs, data, isNumbered = false, startCol = 1, defaultWidth = 20) => {
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // add column STT
    isNumbered &&
        configs.unshift({
            title: 'STT',
            width: 10,
            isNumberedCol: true,
        });

    // Set width
    configs.forEach((config, index) => {
        ws.column(index + startCol).setWidth(config.width ?? defaultWidth);
    });

    const borderStyle = {
        border: {
            left: {
                style: 'thin',
                color: 'black',
            },
            right: {
                style: 'thin',
                color: 'black',
            },
            top: {
                style: 'thin',
                color: 'black',
            },
            bottom: {
                style: 'thin',
                color: 'black',
            },
        },
    };
    const headerStyle = {
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#d7d9db', // gray color
            fgColor: '#d7d9db', // gray color
        },
        font: { bold: true },
        alignment: { horizontal: 'center' },
    };

    // create head row
    configs.forEach((config, index) => {
        ws.cell(1, index + startCol)
            .string(config.required ? `${config.title} *`.toUpperCase() : config.title.toUpperCase())
            .style({ ...borderStyle, ...headerStyle });
    });

    // create data rows
    data.forEach((item, index) => {
        let indexRow = index + 2;
        let indexCol = startCol;

        configs.forEach((config) => {
            const itemValue = config.isNumberedCol ? index + 1 : item[config.key];
            ws.cell(indexRow, indexCol++)
                .string(
                    (
                        (typeof config.transform === 'function'
                            ? config.transform(itemValue, item, index)
                            : itemValue) || ''
                    ).toString(),
                )
                .style(item.style ? { ...borderStyle, ...item.style } : borderStyle);
            // add validation
            if (config.validation) {
                /// find potition of cell to apply validation
                config.validation.sqref = `${ALPHABET[indexCol - 2]}2:${ALPHABET[indexCol - 2]}100`;
                ws.addDataValidation(config.validation);
            }
        });
    });
};

module.exports = {
    addWorksheet,
    getValueExcel,
    transformArrayExcel,
    mappedArrayToNewKey,
    transformValues,
    addSheet,
    addOptionToData,
    addSheetGetList,
    createTableData,
};
