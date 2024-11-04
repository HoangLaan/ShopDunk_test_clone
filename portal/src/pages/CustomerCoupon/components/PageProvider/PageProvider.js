import { StyledCustomerCoupon } from 'pages/CustomerCoupon/utils/styles';
import { CustomerCouponProvider } from 'pages/CustomerCoupon/utils/context';

function PageProvider({ children }) {
  return (
    <StyledCustomerCoupon>
      <CustomerCouponProvider>{children}</CustomerCouponProvider>
    </StyledCustomerCoupon>
  );
}

export default PageProvider;
