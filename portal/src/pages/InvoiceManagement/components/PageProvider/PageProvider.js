import { StyledCustomerLead } from 'pages/CustomerLead/utils/styles';
import { CustomerLeadProvider } from 'pages/CustomerLead/utils/context';

function PageProvider({ children }) {
  return (
    <CustomerLeadProvider>
      <StyledCustomerLead>{children}</StyledCustomerLead>
    </CustomerLeadProvider>
  );
}

export default PageProvider;
