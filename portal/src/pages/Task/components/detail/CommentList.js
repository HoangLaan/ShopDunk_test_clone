import React, { useMemo } from 'react';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage/index';
import DataTable from 'components/shared/DataTable';

const CustomStyle = styled.div`
  border: 1px dashed var(--borderColor);
  border-radius: 5px;
  padding: 10px;
  background: var(--whiteColor);
  margin-top: 10px;

  span {
    font-size: 12px;
    color: var(--mainColor);
  }

  .bw_change_items h4 {
    font-size: 15px;
    margin-bottom: 3px;
  }

  p {
    margin-top: 7px;
  }
`;

const StrollStyled = styled.div`
    height: 500px;
    overflow-y: scroll;
`

function CommentList({ items, page, totalPages, setParams }) {

  return (
    <React.Fragment>

      {Array.isArray(items) && items.length ? (
        <>
          <h3 className='bw_mt_2 bw_title_page'>Comments</h3>
          <StrollStyled>
            {items.map((item, index) => (
              <CustomStyle key={index}>
                <span>{item.created_user} [{item.created_date}]</span>

                <h4>{item.content_comment}</h4>

                {Array.isArray(item.care_product_list) && item.care_product_list.length ? (
                  <p style={{ marginTop: '0' }}>
                    -- Quan tâm đến:{' '}
                    {item.care_product_list.map((v, i) => (
                      <span key={i}>
                        <a href={`product/detail/${v.product_id}`}>{v.product_name}</a>

                        {i < item.care_product_list.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                ) : null}
                {item.picture_url &&
                  item.picture_url.map((v, i) => (
                    // <span key={i}>
                    //   <a href={`product/detail/${v.product_id}`}>{v.product_name}</a>

                    //   {i < item.care_product_list.length - 1 ? ', ' : ''}
                    // </span>
                    item.picture_url[i].picture_url &&
                    <div className='bw_image_view_banner'>
                      <BWImage src={item.picture_url[i].picture_url ? item.picture_url[i].picture_url : item.picture_url[i]} />
                    </div>
                  ))
                }
              </CustomStyle>
            ))}
          </StrollStyled>

          {totalPages > 1 ? (
            <div className='bw_pagination bw_mt_2'>
              <div className='bw_pagination_action'>
                <button
                  className='bw_btn bw_btn_outline bw_btn_sm'
                  onClick={() => {
                    if (page > 1) {
                      setParams((prev) => ({ ...prev, page: prev.page - 1 }));
                    }
                  }}>
                  <i className='fa fa-chevron-left'></i>
                </button>

                <span style={{ margin: '0 6px' }}>
                  {page} / {totalPages}
                </span>

                <button
                  className='bw_btn bw_btn_outline bw_btn_sm'
                  onClick={() => {
                    if (page < totalPages) {
                      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
                    }
                  }}>
                  <i className='fa fa-chevron-right'></i>
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </React.Fragment>
  );
}

export default CommentList;
