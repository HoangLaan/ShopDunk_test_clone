import styled from "styled-components";

export const Wrapper = styled.div`
  .bw_item_dk {
    border: 1px dashed var(--borderColor);
    padding: 15px 10px;
    border-radius: 10px;
    padding-bottom: 10px;
    margin-top: 3px;
    background: var(--whiteColor);
    position: relative;
  }
  .bw_item_dk:first-child {
    margin-top: 0;
    padding-top: 10px;
  }
  .bw_item_dk:last-child {
    padding-bottom: 0;
  }
  .bw_item_dk h3 {
    font-size: 15px;
    font-weight: 600;
  }
  .bw_item_dk .bw_flex {
    margin-top: 7px;
    flex-wrap: wrap;
  }
  .bw_item_dk .bw_flex .bw_show {
    width: 45%;
    position: relative;
  }
  .bw_item_dk .bw_flex .bw_show input {
    width: 100%;
    border: 1px solid var(--borderColor);
    padding: 7px 10px !important;
    border-radius: 5px;
    padding-right: 30px !important;
  }
  .bw_item_dk .bw_flex .bw_show span {
    position: absolute;
    background: var(--whiteColor);
    padding: 0 10px;
    display: flex;
    right: 1px;
    bottom: 1px;
    top: 1px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    color: var(--borderColor);
    font-size: 13px;
  }
  .bw_item_dk .bw_flex .bw_text_show {
    width: 10%;
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
  }
  .bw_item_dk .bw_flex .bw_showtime {
    width: 30%;
    position: relative;
  }
  .bw_item_dk .bw_flex .bw_showtime input {
    width: 100%;
    border: 1px solid var(--borderColor);
    padding: 7px 10px !important;
    border-radius: 5px;
  }
  .bw_item_dk .bw_flex .bw_text_showtime {
    width: 12%;
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
  }
  .bw_item_dk .bw_flex .bw_choose_time {
    width: calc(28% - 7px);
    margin-left: 7px;
  }
  .bw_item_dk .bw_flex .bw_choose_time .bw_select {
    border: 1px solid var(--borderColor);
    border-radius: 5px;
  }
  .bw_item_dk .bw_flex .bw_choose_time .bw_select .bw_select_selection--single {
    padding-top: 0;
    padding: 7px 10px !important;
  }
  .bw_item_dk .bw_flex .bw_choose_time .bw_select .bw_select_selection--single .bw_select_selection__arrow b {
    top: 48%;
    right: 7px;
  }
  .bw_item_dk .bw_choose_pt {
    width: 190px;
    position: absolute;
    left: calc(50% - 95px);
    bottom: -18px;
    z-index: 222;
  }
  .bw_item_dk .bw_choose_pt .bw_select_selection--single .bw_select_selection__arrow {
    width: 30px;
  }
  .bw_item_dk .bw_choose_pt .bw_select_selection--single .bw_select_selection__arrow b {
    top: 48%;
  }
`;

