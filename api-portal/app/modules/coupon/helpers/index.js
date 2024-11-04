const generateRandomString = (type = 1, totalLetter = 6) => {
    // type: 1: cả chữ và số; 2: chỉ chữ; 3: chỉ số /// totalLetter số ký tự
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    if (type === 1) {
        for (let i = 0; i < totalLetter; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    } else if (type === 2) {
        for (let i = 0; i < totalLetter; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            result += alphabet.charAt(randomIndex);
        }
        return result;
    } else if (type === 3) {
        for (let i = 0; i < totalLetter; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            result += randomNumber.toString();
        }
        return result;
    }
};

module.exports = {
    generateRandomString,
};
