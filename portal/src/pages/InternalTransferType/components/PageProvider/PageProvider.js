import { StyledInternalTransferType } from 'pages/InternalTransferType/utils/styles';
import { InternalTransferTypeProvider } from 'pages/InternalTransferType/utils/context';

function PageProvider({ children }) {
  return (
    <StyledInternalTransferType>
      <InternalTransferTypeProvider>{children}</InternalTransferTypeProvider>
    </StyledInternalTransferType>
  );
}

export default PageProvider;
