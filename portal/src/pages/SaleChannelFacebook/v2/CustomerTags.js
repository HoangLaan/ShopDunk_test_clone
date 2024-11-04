import React, { useEffect, useState } from 'react';
import fbActions from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';

function CustomerTags() {
  const dispatch = useDispatch();

  const {
    conversationSelected,
    facebookUser,
    deleteNoteError,
    hashTags,
    deleteHashTagError,
    deleteHashTagSuccess,
    updateUserHashTagSuccess,
    updateUserHashTagError,
    createOrderSuccess,
  } = useSelector((state) => state.scfacebook);
  const userHashTags = facebookUser?.hash_tags || [];

  const [tagView, setTagView] = useState(false);
  const [modal, setModal] = useState(undefined);

  useEffect(() => {
    if (conversationSelected) {
      setTagView(false);
      dispatch(
        fbActions.getFacebookUser({
          pageId: conversationSelected?.page_id,
          userId: conversationSelected?.user?.user_id,
        }),
      );
    }
  }, [conversationSelected, setTagView]);

  useEffect(() => {
    if (!modal) {
      document.body.style.width = 'unset';
      document.body.style.overflow = 'unset';
    }
  }, [modal]);

  useEffect(() => {
    if (deleteNoteError) {
      window._$g.dialogs.alert(deleteNoteError, () => {
        dispatch(fbActions.deleteNoteFacebookUserSuccess(null));
      });
    }
  }, [deleteNoteError]);

  useEffect(() => {
    if (updateUserHashTagError) {
      window._$g.dialogs.alert(updateUserHashTagError, () => {
        dispatch(fbActions.updateUserHashTagSuccess(null));
      });
    }
    if (updateUserHashTagSuccess) {
      // showToast.success('Cập nhật nhãn người dùng thành công!', 'success');
      // dispatch(fbActions.updateUserHashTagSuccess(null));
    }
  }, [updateUserHashTagError, updateUserHashTagSuccess]);

  useEffect(() => {
    if (deleteHashTagError) {
      window._$g.dialogs.alert(deleteHashTagError, () => {
        dispatch(fbActions.deleteHashTagSuccess(null));
      });
    }
    if (deleteHashTagSuccess) {
      showToast.success('Xóa nhãn thành công!', 'success');
      dispatch(fbActions.deleteHashTagSuccess(null));
    }
  }, [deleteHashTagError, deleteHashTagSuccess]);

  const deleteNoteFacebookUser = async (note) => {
    if (note) {
      dispatch(
        fbActions.deleteNoteFacebookUser({
          pageId: conversationSelected?.page_id,
          userId: conversationSelected?.user?.user_id,
          noteId: note.id,
        }),
      );
    }
  };

  const deleteHashTag = async (hashTag) => {
    showConfirmModal('Bạn có chắc chắn muốn xóa dữ liệu đang chọn?', 'Xóa', (confirm) => {
      if (confirm) {
        dispatch(fbActions.deleteHashTag(hashTag));
      }
    });
  };

  const updateUserHashTag = async (hashTag, isTag) => {
    if (hashTag) {
      dispatch(
        fbActions.updateUserHashTag({
          pageId: conversationSelected?.page_id,
          userId: conversationSelected?.user?.user_id,
          conversationId: conversationSelected?.conversation_id,
          hashTag,
          isTag,
        }),
      );
    }
  };

  return (
    <div className='bw_collapse bw_active'>
      <div className='bw_collapse_title'>
        <h3>
          Nhãn ({userHashTags?.length || 0}) <span className='bw_red'>*</span>
        </h3>
      </div>
      <div className='bw_collapse_panel bw_list_label'>
        {(hashTags || []).map((hashTag, index) => {
          const { color, name, id } = hashTag;
          const checked = (userHashTags || []).find((tag) => tag.id == id);
          return (
            <label className='bw_checkbox bw_choose_label' key={id}>
              <input type='checkbox' checked={checked} onClick={() => updateUserHashTag(hashTag, !!!checked)} />
              <span />
              <i style={{ background: color || '#576CBC' }}>{name}</i>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default CustomerTags;
