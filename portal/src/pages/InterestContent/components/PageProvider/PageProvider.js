import { StyledInterestContent } from 'pages/InterestContent/utils/styles';
import { InterestContentProvider } from 'pages/InterestContent/utils/context';

function PageProvider({ children }) {
  return (
    <StyledInterestContent>
      <InterestContentProvider>{children}</InterestContentProvider>
    </StyledInterestContent>
  );
}

export default PageProvider;
