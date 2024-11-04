import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import ChatItems from 'pages/SaleChannelFacebook/v2/ChatItems';
import ChatDetail from './ChatDetail';
import CustomerInfo from './CustomerInfo';
import CustomerTags from './CustomerTags';
import CustomerOrder from './CustomerOrder';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Tag } from 'antd';
import BWButton from 'components/shared/BWButton';
import fbActions from '../actions';
import CustomerNote from './CustomerNote';
import { getFullName } from 'services/global.service';

const { CheckableTag } = Tag;

function BoardNew() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { facebookUser } = useSelector((state) => state.scfacebook);
  const [isShowTagFilterList, setIsShowTagFilterList] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const { hashTags } = useSelector((state) => state.scfacebook);
  const tagsData = (hashTags || []).map((x) => x.name);

  const [search, setSearch] = useState('');
  const handleChangeSearch = (e) => setSearch(e.target.value);
  const { pageConnect: pageSelected } = useSelector((state) => state.scFacebookPerTist);

  const getListConversation = useCallback(
    (query) => {
      if (pageSelected) {
        dispatch(fbActions.getListConversation(pageSelected, query || {}));
      }
    },
    [pageSelected],
  );
  const handleSearchKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      dispatch(fbActions.clearConversation());
      getListConversation({
        page: 1,
        search: search,
        // hash_tags: hashTagsFilter.map((item) => item.id),
      });
    }
  };

  return (
    <div className='bw_box_social'>
      <div className='bw_left_social bw_card_items'>
        <div className='bw_flex bw_align_items_center bw_justify_content_between bw_control_soc'>
          <ul className='bw_control_social'>
            <li className='bw_active'>
              <a data-href='#bw_mess'>Tin nhắn</a>
            </li>
          </ul>
        </div>
        <div className='bw_flex bw_justify_content_between bw_main_notice'>
          <div className='bw_list_notice_de'>
            <div className='bw_search_mes'>
              <form method='pos'>
                <input
                  type='search'
                  placeholder='Tìm kiếm trò chuyện'
                  className='bw_inp'
                  value={search}
                  onChange={handleChangeSearch}
                  onKeyDown={handleSearchKeyDown}
                />
                <button>
                  <span className='fi-rr fi-rr-search' />
                </button>
              </form>
              <a
                data-href='#bw_more_filter'
                onClick={(e) => {
                  e?.preventDefault();
                  setIsShowTagFilterList((prev) => !prev);
                }}>
                <span className='fi-rr fi-rr-filters' />
              </a>
            </div>
            {isShowTagFilterList && (
              <div className='bw_mb_2 bw_mt_2'>
                <Space size={[0, 8]} wrap>
                  {tagsData.map((tag) => (
                    <CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}>
                      {tag}
                    </CheckableTag>
                  ))}
                </Space>
              </div>
            )}
            <ChatItems
              isShowTagFilterList={isShowTagFilterList}
              setIsShowTagFilterList={setIsShowTagFilterList}
              selectedTags={selectedTags}
              search={search}
              setSearch={setSearch}
              getListConversation={getListConversation}
            />
          </div>
          <ChatDetail />
        </div>
      </div>
      <div className='bw_right_social bw_card_items'>
        <div className>
          <h3>Thông tin đơn hàng</h3>
          <CustomerInfo />
          <CustomerTags />
          <CustomerOrder />
          <CustomerNote />
          <div className='bw_text_center bw_mt_2 bw_mb_2'>
            <BWButton
              content='Tạo đơn hàng với khách hàng'
              onClick={async (e) => {
                e.preventDefault();
                if (facebookUser?.info?.phone_number) {
                  const userRes = await getFullName({
                    type: 2,
                    value_query: facebookUser?.info?.phone_number,
                  })
                  localStorage.setItem("dataUser", JSON.stringify(userRes));
                }
                history.push('/orders/add?tab_active=information')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardNew;
