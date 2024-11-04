import { CustomerProvider } from 'pages/Customer/utils/context';
import { StyledCustomer } from 'pages/Customer/utils/styles';

function PageProvider({ children }) {
  return (
    <CustomerProvider>
      <StyledCustomer>{children}</StyledCustomer>
    </CustomerProvider>
  );
}

export default PageProvider;
