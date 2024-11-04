import { BankUserProvider } from 'pages/BankUser/utils/context';
import { StyledBankUser } from 'pages/BankUser/utils/styles';

function PageProvider({ children }) {
  return (
    <StyledBankUser>
      <BankUserProvider>{children}</BankUserProvider>
    </StyledBankUser>
  );
}

export default PageProvider;
