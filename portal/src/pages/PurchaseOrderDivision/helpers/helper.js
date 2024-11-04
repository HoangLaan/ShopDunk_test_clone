export const checkNullKey = (objectsArray, key) =>{
    for (let i = 0; i < objectsArray.length; i++) {
      if (objectsArray[i][key] === null || objectsArray[i][key] == "") {
        return true; // Nếu có ít nhất một object có key bị null
      }
    }
    return false; // Nếu không có object nào có key bị null
  }

export const findMaxQuantityByProductAndStore = (arr, productId, storeId) => {
  let maxQuantity = 0; // Khởi tạo giá trị maxQuantity với một giá trị âm để đảm bảo tìm được giá trị lớn hơn.
  let maxQuantityObject = null; // Khởi tạo một biến để lưu trữ object có quantity_in_stock_min lớn nhất.

  for (const obj of arr) {
    if (obj.product_id === productId && obj.store_id === storeId) {
      if (obj.quantity_in_stock_min > maxQuantity) {
        maxQuantity = obj.quantity_in_stock_min;
        maxQuantityObject = obj;
      }
    }
  }
  return maxQuantity;
}

export const calTotalOrderByProductAndStore = (arr, productId, storeId) => {
  let total = 0;

  for (const obj of arr) {
    if (obj.product_id == productId && obj.store_id == storeId) {
      total = obj.quantity;
    }
  }
  return total || 0;
}

//Tính tổng các giá trị của 1 field nào đó trong mãng các object
export const sumOfKeyInObject = (arr, key) => {
  let total = 0;
  for (const obj of arr) {
    total += (obj.key || 0)
  }
  return total;
}

export const findInventoryByProductAndStore = (arr, productId, storeId) => {
  let inventory = 0;
  for (const obj of arr) {
    if (obj.product_id === productId && obj.store_id === storeId) {
      inventory = obj.stocks_detail_quantity || 0;
    }
  }
  return inventory;
}

export const getDateBeforeDays = (days) => {
  // Lấy ngày hiện tại
  let currentDate = new Date();

  // Trừ đi số ngày cần lấy
  currentDate.setDate(currentDate.getDate() - days);

  // Định dạng ngày tháng năm theo DD/MM/YYYY
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Tháng trong JavaScript đếm từ 0
  let year = currentDate.getFullYear();

  // Đảm bảo định dạng DD/MM/YYYY
  if (day < 10) {
      day = '0' + day; // Đảm bảo ngày có hai chữ số
  }
  if (month < 10) {
      month = '0' + month; // Đảm bảo tháng có hai chữ số
  }

  let formattedDate = day + '/' + month + '/' + year;
  return formattedDate;
}