const CompareString = (str) => {
    let newStr = str ? str.toString() : '';
    let newResult = newStr.trim().toLocaleLowerCase();
    let result = ''
    switch (newResult) {
        case 'kg':
            return result = 'kg';
        case 'kilogram':
            return result = 'kg';
        case 'kilôgram':
            return result = 'kg';
        case 'm':
            return result = 'm';
        case 'met':
            return result = 'm';
        case 'mét':
            return result = 'm';
        case 'cay':
            return result = 'cay';
        case 'cây':
            return result = 'cay';
        case 'cuộn':
            return result = 'cuon';  
    }
}

module.exports = {
    CompareString,
}; 
  