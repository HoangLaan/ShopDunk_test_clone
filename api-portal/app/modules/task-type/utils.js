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

function convertIntegerToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  return timeString;
}

function convertTimeToInteger(time) {
  const [hours, minutes] = time.split(':');
  const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
  return timeInMinutes;
}

module.exports = {
    addSheet,
    transformObjHasArrayPrefix,
    convertIntegerToTime,
    convertTimeToInteger,
};
