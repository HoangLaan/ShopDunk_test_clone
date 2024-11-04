export const convertSecondsToHMS = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    // Định dạng thời gian thành chuỗi HH:mm:ss
    let formattedTime =
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    return formattedTime;
}