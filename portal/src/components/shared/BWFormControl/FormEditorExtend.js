import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import ErrorMessage from './ErrorMessage';
import { Button } from 'antd';

// import { fnPost } from "../../../utils/api"
const FormEditorExtend = ({ field, validation, placeholder, className, disabled = false, height = 300 }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);

  const [showEditText, setShowEditText] = useState(false);

  useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  useEffect(() => {
    if (showEditText) {
      methods.setValue(field, (methods.getValues(field) || '').replaceAll('<', '\n<'));
    }
  }, [showEditText]);

  return (
    <React.Fragment>
      {showEditText ? (
        <textarea
          id='myCodee'
          value={methods.getValues(field) || ''}
          style={{ width: '100%', maxWidth: '100%', height: 200, padding: 10 }}
          onChange={(event) => {
            methods.clearErrors(field);
            methods.setValue(field, event.target.value || '');
          }}></textarea>
      ) : (
        <Editor
          className={className}
          apiKey={'3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku'}
          scriptLoading={{ delay: 500 }}
          value={methods.watch(field) || ''}
          disabled={disabled}
          init={{
            height: `${height}px`,
            width: '100%',
            menubar: false,
            content_style: 'p { margin-bottom:  0 }',
            force_br_newlines: true,
            force_p_newlines: false,
            forced_root_block: '', // Needed for 3.x
            branding: false,
            entity_encoding: 'raw',
            statusbar: false,
            plugins: [
              'advlist autolink fullscreen lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen ',
              'insertdatetime media table paste code help wordcount',
              'image imagetools ',
            ],
            menubar: 'file edit view insert format tools table tc help',
            toolbar1:
              'undo redo | fullscreen | formatselect | bold italic backcolor | \n' +
              'alignleft aligncenter alignright alignjustify',
            toolbar2: 'bullist numlist outdent indent | removeformat | help | image',
            file_picker_types: 'image',
            images_dataimg_filter: function (img) {
              return img.hasAttribute('internal-blob');
            },
            branding: false,
            file_picker_types: 'image',
            relative_urls: false,
            remove_script_host: false,
            convert_urls: true,
            default_link_target: '_blank',
          }}
          onEditorChange={(newValue) => {
            methods.clearErrors(field);
            methods.setValue(field, newValue);
          }}
        />
      )}
      {error && <ErrorMessage message={error?.message} />}
      <Button
        onClick={() => setShowEditText(!showEditText)}
        style={{ paddingLeft: 20, paddingRight: 20, marginTop: 10 }}>
        {showEditText ? 'Xem bố cục' : 'Chỉnh sửa mã'}
      </Button>
    </React.Fragment>
  );
};

FormEditorExtend.propTypes = {
  field: PropTypes.string,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FormEditorExtend;