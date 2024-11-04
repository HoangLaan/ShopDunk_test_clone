import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

const FilterSearchBarCustom = ({ title, actions, onSubmit, onClear, itemColSize = 3 }) => {
  const methods = useFormContext();
  const [toggleSearch, setToggleSearch] = useState(true);
  const [searchAdvanced, setSearchAdvanced] = useState(false);

  return (
    <div className='bw_search_box'>
      <h3 className='bw_title_search'>
        <span>{title}</span>
        <span className='bw_close_search' onClick={() => setToggleSearch(!toggleSearch)}>
          <i style={{ cursor: 'pointer' }} className='fi fi-rr-angle-small-down'></i>
        </span>
      </h3>
      {toggleSearch && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            methods.handleSubmit(onSubmit)(e);
          }}>
          <div className='bw_row bw_mt_1'>
            {(searchAdvanced ? actions : actions.slice(0, 4)).map((props, index) => {
              const { title, isRequired, component } = props;
              return (
                <div key={`${props.title}${index}`} className={`bw_col_${itemColSize}`}>
                  <div className='bw_frm_box'>
                    <label>
                      {title ?? ''}
                      {isRequired && <span className='bw_red'>*</span>}
                    </label>
                    {component}
                  </div>
                </div>
              );
            })}
          </div>
          <div className='bw_row bw_align_items_center'>
            <div className='bw_col_6'>
              {actions.length > 4 && (
                <span onClick={() => setSearchAdvanced(!searchAdvanced)} className='bw_btn_more_search'>
                  {!searchAdvanced ? 'Tìm nâng cao' : 'Ẩn bớt'}
                </span>
              )}
            </div>
            <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'>
              <button
                id='filter-search-bar-trigger'
                type='submit'
                style={{
                  display: 'none',
                }}></button>
              <button
                style={{ marginRight: '10px' }}
                type='button'
                onClick={methods.handleSubmit(onSubmit)}
                className='bw_btn bw_btn_success'>
                <span className='fi fi-rr-filter'></span> Tìm kiếm
              </button>
              <button
                type='button'
                onClick={() => {
                  methods.reset({
                    is_active: 1,
                  });
                  onClear({});
                }}
                className='bw_btn_outline'>
                Làm mới
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

FilterSearchBarCustom.propTypes = {
  /** Title of filter */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
};

FilterSearchBarCustom.defaultProps = {
  title: '',
  actions: [],
  onSubmit: () => {},
  onClear: () => {},
};

export default FilterSearchBarCustom;
