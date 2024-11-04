class PagedList {
  /**
   * Paged List.
   * @param {array} items - List of items for current page.
   * @param {number} totalItems - Total items.
   * @param {number} page - Current page.
   * @param {number} itemsPerPage - Items per page.
   * @param {array} listCustomerType - list for customer type
   */
  constructor(items = [], totalItems = 1, page = 1, itemsPerPage = 10, listCustomerType = [], parentFolder = {}, pathItems = []) {
    if (listCustomerType && listCustomerType.length) this.listCustomerType = listCustomerType;
    this.parentFolder = parentFolder
    this.pathItems = pathItems
    this.items = items;
    this.totalItems = totalItems;
    this.page = page;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
    this.itemsPerPage = itemsPerPage;
  }
}

module.exports = PagedList;
