import { StyledCustomerDeposit } from 'pages/CustomerDeposit/utils/styles';
import { CustomerDepositProvider } from 'pages/CustomerDeposit/utils/context';

function PageProvider({ children }) {
  return (
    <StyledCustomerDeposit>
      <CustomerDepositProvider>{children}</CustomerDepositProvider>
    </StyledCustomerDeposit>
  );
}

export default PageProvider;
