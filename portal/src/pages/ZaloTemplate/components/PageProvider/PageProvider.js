import { StyledZaloTemplate } from 'pages/ZaloTemplate/utils/styles';
import { ZaloTemplateProvider } from 'pages/ZaloTemplate/utils/context';

function PageProvider({ children }) {
  return (
    <StyledZaloTemplate>
      <ZaloTemplateProvider>{children}</ZaloTemplateProvider>
    </StyledZaloTemplate>
  );
}

export default PageProvider;
