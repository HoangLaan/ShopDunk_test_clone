import { StyledCustomerSubscriberReport } from 'pages/CustomerSubscriberReport/utils/styles';
import { CustomerSubscriberReportProvider } from 'pages/CustomerSubscriberReport/utils/context';

function PageProvider({ children }) {
  return (
    <StyledCustomerSubscriberReport>
      <CustomerSubscriberReportProvider>{children}</CustomerSubscriberReportProvider>
    </StyledCustomerSubscriberReport>
  );
}

export default PageProvider;
