import { StyledPurchaseOrderDivision } from 'pages/PurchaseOrderDivision/utils/styles';
import { PurchaseOrderDivisionProvider } from 'pages/PurchaseOrderDivision/utils/context';

function PageProvider({ children }) {
  return (
    <StyledPurchaseOrderDivision>
      <PurchaseOrderDivisionProvider>{children}</PurchaseOrderDivisionProvider>
    </StyledPurchaseOrderDivision>
  );
}

export default PageProvider;
