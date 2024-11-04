import Lang from './utils/lang';

/**
 * Define project's global
 */
Object.assign(window, {
  _$g: {
    theme: 'antd',
    userAuth: null,
    Lang,
    _: Lang,
    dialogs: null,
    rdr: function () {
      alert('[rdr] Not yet ready!');
    },
  },
});

export default global;