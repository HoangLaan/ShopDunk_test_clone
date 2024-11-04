export const formatQuantity = (value) => parseFloat(!value || isNaN(value) ? 0 : value).toLocaleString();

export const isFloat = (number) => Number(number) === number && number % 1 !== 0
