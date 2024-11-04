export const sortTaskWorkflow = (value, type, index) => {
  const newIndex = type === 'up' ? index - 1 : index + 1;
  let tmp = value[index];
  value[index] = value[newIndex];
  value[newIndex] = tmp;
  value[index].order_index = index;
  value[newIndex].order_index = newIndex;
}

export const createDownloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

export const getErrorMessage = (error) => {
  let msg = error.message;
  if (error?.errors?.length) {
    msg = error.errors[0];
  }
  return msg || 'Có lỗi xảy ra';
};

export const calcGridRatioValue = (list = []) => {
  if (list.length === 1) {
    list[0].value_ratio = 100;
    return { list, remainRatio: 0 }
  }
  if (list.length > 1) {
    const remainRatio = 100 - list.slice(0, list.length - 1).reduce((acc, cur) => acc + (cur.value_ratio || 0), 0);
    list[list.length - 1].value_ratio = remainRatio;
    return { list, remainRatio }
  }
}
