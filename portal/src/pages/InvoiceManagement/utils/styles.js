import styled from 'styled-components';

export const StyledCustomerLead = styled.div`
  #bw_modal_customer_lead_affiliate .bw_main_wrapp {
    padding: 0;
  }
  #bw_modal_customer_lead_affiliate .bw_main_wrapp > .bw_row > .bw_pb_6 {
    padding-bottom: 0;
  }

  .bw_customer_lead_additional textarea {
    min-height: 38px;
  }

  .table_select_company .bw_show_record {
    display: none;
  }
  .table_select_company thead tr th:first-child .bw_checkbox {
    display: none;
  }
`;

export const StyledCareActions = styled.div`
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
  .bw_care_actions_count {
    display: inline-flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 5px;
    margin-right: 10px;
  }
  .bw_care_actions_count img {
    margin-right: 10px;
  }
`
