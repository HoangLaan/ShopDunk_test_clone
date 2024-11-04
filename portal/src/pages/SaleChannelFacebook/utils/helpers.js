import moment from 'moment';
const generateType = {
    image: ['image/jpeg', 'image/png'],
};

const getType = typeValue => {
    for (let i in generateType) {
        if (generateType[i].includes(typeValue)) {
            return i;
        } else {
            return 'file';
        }
    }
};

const checkConnect = (pageIdCheck, pageSystem) =>
    Boolean(pageSystem.find(_ => _.page_id === pageIdCheck)) ? 'Đã kết nối' : 'Chưa kết nối';

const urlCheck = text => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
    });
};

const relativeTime = (dayCurrent, dayFrom) => {
    console.log();
    if (moment(dayCurrent).diff(moment(dayFrom), 'minutes') > 1440) {
        return moment(dayFrom).format('DD/MM HH:mm');
    } else {
        return moment(dayFrom).startOf('minute').fromNow();
    }
};

const getFileFromUrl = (p) => {
    let fileName = '';
    const _ = [...p];
    for (let i of _?.reverse()) {
        if (i === '/') {
            return [...fileName].reverse().join('');
        }
        fileName = fileName + i;
    }
};

export {getType, checkConnect, urlCheck, relativeTime, getFileFromUrl};
