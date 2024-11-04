import { StyledPurchaseRequisitionType } from 'pages/PurchaseRequisitionType/utils/styles';
import { PurchaseRequisitionTypeProvider } from 'pages/PurchaseRequisitionType/utils/context';

function PageProvider({ children }) {
  return (
    <StyledPurchaseRequisitionType>
      <PurchaseRequisitionTypeProvider>{children}</PurchaseRequisitionTypeProvider>
    </StyledPurchaseRequisitionType>
  );
}

export default PageProvider;
