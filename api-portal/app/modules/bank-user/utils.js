const { excelHeaderStyle } = require('./constants');

const addSheet = ({ workbook, sheetName, header, data = [], isIndex = true, headerStyle = excelHeaderStyle }) => {
    if (isIndex) {
        header = { index: 'STT', ...header };
        data = data.map((item, index) => ({ ...item, index: index + 1 }));
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
            worksheet.cell(indexRow + 1, indexCol + 1).string((item[key] || '').toString());
        });
    });
};

const transformObjHasArrayPrefix = (oldObj, keyPrefix) => {
    const newObj = {};
    for (const key in oldObj) {
        if (key.startsWith(keyPrefix)) {
            const [_, index, property] = key.split('.');
            if (!newObj[keyPrefix]) {
                newObj[keyPrefix] = [];
            }
            const taskObj = newObj[keyPrefix][index - 1] || {};
            taskObj[property] = oldObj[key];
            newObj[keyPrefix][index - 1] = taskObj;
        } else {
            newObj[key] = oldObj[key];
        }
    }

    return newObj;
};

const columnToLetter = (column) => {
  let temp,
    letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
};


const addSheetV2 = ({ workbook, sheetName, config, data = [], headerStyle = excelHeaderStyle }) => {
  const worksheet = workbook.addWorksheet(sheetName, {});
  const headerRow = {};
  Object.keys(config).forEach((key) => (headerRow[key] = config[key].title));
  data.unshift(headerRow);

  const fields = Object.keys(config);
  for (let indexCol = 1; indexCol <= fields.length; indexCol++) {
    const field = fields[indexCol - 1];
    const width = config[field].width || 20;
    worksheet.column(indexCol).setWidth(width);
    worksheet.cell(1, indexCol).style(workbook.createStyle(headerStyle));

    if (config[field].validate) {
      const validate = config[field].validate;

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


module.exports = {
    addSheet,
    addSheetV2,
    transformObjHasArrayPrefix,
};
