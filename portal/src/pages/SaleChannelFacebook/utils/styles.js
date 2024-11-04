import styled from 'styled-components';

export const StyledSaleChannelFacebook = styled.div`
  .bw_page_dropdown .anticon-down {
    margin-right: 10px;
  }
  .bw_page_dropdown .ant-dropdown-trigger {
    width: 100%;
  }
  .bw_page_dropdown .ant-space {
    width: 100%
  }
  .bw_page_dropdown .ant-space-item:last-child {
    margin-left: auto;
  }
`

export const Wrapper = styled.div`
    margin-top: 10px;
    height: 1000px;
    padding: 0 10px;
    overflow-y: scroll;
    overflow-x: hidden;
    flex: 1;
    width: 100%;

    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

export const Section = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: ${props => (props.owner ? 'row-reverse' : undefined)};
    margin-bottom: 3px;
    height: ${props => props.loadFirst};
    a {
        color: ${props => (props?.owner ? '#ffffff' : '#222B3C')};
    }
    .avartar {
        display: inline;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        margin-right: ${props => (props.owner ? '0px' : '8px')};
        margin-left: ${props => (props.owner ? '8px' : '0px')};
    }

    .ant-image-mask-info {
        display: flex;
        align-items: center;
    }

    .list {
        display: inline;
        max-width: 50%;
        .last-reply {
            font-size: 12px !important;
            float: right;
            .last-reply-user {
                font-size: 12px;
                font-weight: bold;
                color: #2f80ed;
            }
        }
        .conversation {
            display: flex;
            justify-content: ${props => (props.owner ? 'end' : '')};
            &__file {
                cursor: pointer;
                height: 100%;
                width: auto;
                background-color: ${props => (props?.owner ? '#2F80ED' : '#ffffff')};
                color: ${props => (props?.owner ? '#ffffff' : '#222B3C')};
                border-radius: ${props => (props.owner ? '21px 21px 2px 21px' : '21px 21px 21px 2px')};
                padding: 6px 13px;
                margin-bottom: 3px;
                display: flex;
                align-items: center;
            }
            &__item {
                height: 100%;
                width: 100%;
                background-color: ${props => (props?.owner ? '#2F80ED' : '#ffffff')};
                color: ${props => (props?.owner ? '#ffffff' : '#222B3C')};
                border-radius: ${props => (props.owner ? '21px 5px 5px 21px' : '5px 21px 21px 5px')};
                padding: 6px 13px;
                margin-bottom: 3px;
                max-inline-size: max-content;
            }
        }
        .conversation:first-child {
            .conversation__item {
                border-radius: ${props => (props.owner ? '21px 21px 5px 21px' : '21px 21px 21px 5px')}!important;
            }
        }
        .conversation:last-child {
            .conversation__item {
                border-radius: ${props => (props.owner ? '21px 5px 21px 21px' : '5px 21px 21px 21px')}!important;
            }
        }
    }
`;
