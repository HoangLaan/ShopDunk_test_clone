import { exportPDF } from 'services/purchase-requisition.service';
import { cdnPath } from 'utils';

export const printPR = (purchase_requisition_id) => {
  exportPDF(purchase_requisition_id).then((response) => {
    let varUrl = response.path;
    const url = cdnPath(varUrl);
    const pdfLink = document.createElement('a');
    pdfLink.target = '_blank';
    pdfLink.href = url;
    document.body.appendChild(pdfLink);
    pdfLink.click();
  });
};
