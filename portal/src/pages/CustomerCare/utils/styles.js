import styled from 'styled-components';

export const StyledCustomerCare = styled.div`
  .bw_operator .ant-input-number-input-wrap {
    padding-left: 10px;
  }
  .bw_operator .ant-input-number-input {
    text-align: left;
  }
  .bw_number_day .ant-input-number-input-wrap {
    padding-left: 10px;
  }
  .bw_number_day .ant-input-number-input-wrap input {
    text-align: left;
  }

  .bw_row_actions_custom {
    margin-bottom: -20px;
    margin-top: 20px;
  }
  .bw_table_top_badges {
    display: flex;
    align-items: center;
  }
  .bw_badge.bw_badge_selected {
    opacity: 1;
    font-weight: bold;
  }
  .bw_table_top_badges .bw_badge {
    margin-right: 10px;
    opacity: 0.6;
  }

  .bw_table_customer_care .bw_choose_record {
    display: none;
  }

  .bw_filter_customer_care .ant-input-number-input-wrap input::placeholder {
    color: var(--textColor);
    opacity: 0, 6;
  }
  .bw_mr_1 {
    margin-left: 5px;
  }
  .bw_icon_action.fa-angle-down {
    margin-top: 1px;
  }

  .bw_filter_no_care_days input,
  .bw_filter_total_money input {
    padding-left: 5px!important;
  }
`;
