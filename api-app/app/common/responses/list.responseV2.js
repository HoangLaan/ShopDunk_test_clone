const SingleResponse = require('./single.response');
const PagedList = require('../classes/pagedListV2.class');

class ListResponse extends SingleResponse {
  /**
   * Paged List.
   * @param {array} listCustomerType - List of custonmer type
   * @param {Object} parentFolder - List of custonmer type
   * @param {array} items - List of items for current page.
   * @param {array} pathItems - List of items for current page.
   * @param {number} totalItems - Total items.
   * @param {number} page - Current page.
   * @param {number} totalPages - Total pages.
   * @param {number} itemsPerPage - Items per page.
   */
  constructor(items = [], totalItems = 0, page = 1, itemsPerPage = 25, listCustomerType=[] , parentFolder = {} , pathItems =[] ) {
    const listData = new PagedList(items, totalItems, page, itemsPerPage, listCustomerType, parentFolder, pathItems);
    super(listData);
  }
}

module.exports = ListResponse;
