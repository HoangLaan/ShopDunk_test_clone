import React, { useCallback, useState, useEffect } from 'react';
import { read } from '../helpers/call-api';
import BWImage from 'components/shared/BWImage/index';
import { useParams } from 'react-router-dom';

const NewsInsideDetail = () => {
  const { id } = useParams();

  const [detailNews, setDetailNews] = useState({});

  const loadProcessStepDetail = useCallback(async () => {
    if (id) {
      const detail = await read(id);
      setDetailNews(detail);
    }
  }, [id]);

  useEffect(() => {
    loadProcessStepDetail();
  }, []);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <div className='bw_container bw_pt_4'>
          <div className='bw_row bw_justify_content_center'>
            <div className='bw_col_10'>
              <h1 className='bw_title_news_detail'>{detailNews?.news_title}</h1>
              <div className='bw_creater bw_flex bw_align_items_center bw_justify_content_center'>
                <BWImage src={detailNews?.avatar} />
                <h4>{detailNews?.fullname}</h4>
                <span>Ngày {detailNews?.news_date}</span>
              </div>

              <div className='bw_main_content_news'>
                <div dangerouslySetInnerHTML={{ __html: detailNews?.content }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewsInsideDetail;
