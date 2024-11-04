import styled from 'styled-components';

export const StyledRequestPurchase = styled.div`
  .bw_btn_supplier {
    cursor: pointer;
  }
  .bw_modal_supplier .bw_main_modal .bw_main_wrapp {
    padding-bottom: 0;
  }
  .bw_modal_supplier .bw_main_modal .bw_main_wrapp > .bw_row > .bw_pb_6 {
    padding-bottom: 0;
  }
  .bw_po_product_label {
    font-style: italic;
  }
  .bw_btn_link {
    outline: none;
    background: none;
    border: none;
    color: var(--mainColor);
    cursor: pointer;
  }
  .bw_modal_title {
    background: var(--grayColor);
    padding: 20px;
    font-size: 17px;
    margin-bottom: 20px;
  }
  .bw_ml_1 {
    margin-left: 5px;
  }

  .bw_btn_outline_selected {
    background: var(--blackColor);
    color: #fff;
  }
  .bw_btn_outline_success_selected {
    background: var(--greenColor);
    color: #fff;
  }
  .bw_btn_outline_danger_selected {
    background: var(--redColor);
    color: #fff;
  }

  .bw_mr_1 {
    margin-right: 5px;
  }

  .bw_color {
    border-radius: 7px;
    outline: none;
    cursor: pointer;
    border: none;
    font-size: 15px;
    padding: 7px 15px;
    display: inline-block;
    transition: all 300ms;
  }

  .bw_color_1 {
    color: var(--greenColor);
    border: 1px solid var(--greenColor);
  }
  .bw_color_1:hover {
    border: 1px solid var(--greenColor);
    background: var(--greenColor);
    color: #fff;
  }
  .bw_color_1_selected {
    background: var(--greenColor);
    color: #fff;
  }

  .bw_color_2 {
    color: var(--redColor);
    border: 1px solid var(--redColor);
  }
  .bw_color_2:hover {
    border: 1px solid var(--redColor);
    background: var(--redColor);
    color: #fff;
  }
  .bw_color_2_selected {
    background: var(--redColor);
    color: #fff;
  }

  .bw_action_table_2 {
    right: 75px;
  }
  .bw_action_table_2_view {
    right: 0;
  }

  .bw_choose_record {
    margin-top: 10px
  }
`;
