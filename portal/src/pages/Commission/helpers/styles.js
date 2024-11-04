import styled from 'styled-components';

export const StyledCommission = styled.div`
  .bw_control_form {
    top: 80px;
  }
  .bw_hide {
    opacity: 0;
    visibility: hidden;
  }
  .bw_commission_relative {
    position: relative;
  }
  .bw_commission_relative .bw_type_mon label span {
    height: 38px;
  }
  .bw_commission_relative .bw_inp {
    cursor: auto;
  }
  .bw_commission_relative .ant-input-number-input {
    min-width: 160px;
  }
  .bw_input_two_type {
    position: absolute;
    z-index: 1;
    right: 7%;
    bottom: 12px;
  }
  .bw_input_two_type_no_label {
    position: absolute;
    z-index: 0;
    top: 0;
    right: -2px;
  }
  .bw_commission_store {
    height: 35px;
    padding: 7px 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .bw_commission_store:hover {
    background-color: var(--grayColorHover);
  }
  .ant-input-number .ant-input-number-input {
    text-align: left;
    height: 36px;
  }
`;
