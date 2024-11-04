const getCurrentDateFormatted = () => {
    const currentDate = new Date();

    // Extract day, month, and year
    const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const year = currentDate.getFullYear();

    // Format as DD/MM/YYYY
    return `${day}/${month}/${year}`;
}

module.exports = {
    getCurrentDateFormatted,
};
