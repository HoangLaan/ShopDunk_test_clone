import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PromotionStoreApply from 'pages/Promotions/components/add/PromotionStoreApply';

const Wrapper = styled.div`
  .bw_lb_sex label {
    width: 100%;
  }
`;

const DiscountProgramStore = ({ title, loading, disabled }) => {
  return (
    <React.Fragment>
      <BWAccordion title={title} isRequired>
        <Wrapper className='bw_frm_box'>
          <PromotionStoreApply isShowTitle={false} loading={loading} disabled={disabled} />
        </Wrapper>
      </BWAccordion>
    </React.Fragment>
  );
};

DiscountProgramStore.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramStore;
