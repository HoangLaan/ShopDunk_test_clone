import React, { useCallback, useState, useEffect } from 'react'
import { getListNewInside } from '../helpers/call-api'
import BWImage from 'components/shared/BWImage/index';



const NewsInsidePage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25
  })
  const [dataNews, setDataNews] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0
  })

  const [loading, setLoading] = useState(true);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataNews

  const loadProcessStep = useCallback(() => {
    setLoading(true);
    getListNewInside(params).then(setDataNews).finally(() => {
      setLoading(false);
    });
  }, [params])

  useEffect(loadProcessStep, [loadProcessStep]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <div className="bw_container">
          <div className="bw_row">
            {(items || []).map((_new) => {
              return (
                <div className="bw_col_4 bw_mb_2" key={_new?.news_id}>
                  <a className="bw_news_items"  onClick={()=>window._$g.rdr(`/news-inside/detail/${_new?.news_id}`)}>
                    <BWImage src={_new?.image_url} style={{ maxHeight: 200 }} />
                    <div className="bw_creater bw_flex bw_align_items_center">
                      <BWImage src={_new?.avatar} style={{height: 24}}/>
                      <h4>{_new?.fullname}</h4>
                      <span>Ngày {_new?.news_date}</span>
                    </div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', width: 350}}>
                      <h3 style={{ textOverflow: 'ellipsis'}}>{_new?.news_title}</h3>
                    </div>

                    <p><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', width: 300, minHeight: 50}}>
                      <span style={{ textOverflow: 'ellipsis' }}>{_new?.short_description}</span>
                      </div>
                    </p>
                    <button className="bw_btn bw_btn_success bw_mt_20">Đọc thêm</button>
                  </a>
                </div>
              )
            })}

            {page < totalPages && items.length  ? <button className="bw_btn bw_btn_success bw_mt_20">Xem thêm</button> : null}

          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewsInsidePage;
