import styled from 'styled-components';

export const StyledFilterTaskCustomer = styled.div`
  .bw_group_btn_filter {
    margin-top: 30px;
    margin-bottom: -20px;
    display: flex;
    gap: 5px;
    .bw_btn_handle {
      background-color: #f5b392;
      :hovver {
        background-color: rgb(252, 256, 111);
      }
    }
  }
`;

export const StyledTask = styled.div`
  .heading_link {
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .text_link {
    color: inherit;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .bw_create_order {
    display: inline-block;
    margin-left: 20px;
    margin-bottom: 2px;
  }
  .bw_create_order span {
    margin-right: 5px;
  }
`;
