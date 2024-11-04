import { PERMISSION } from 'pages/FileManager/utils/constants';
import threedm from 'pages/FileManager/assets/office/3dm.png';
import elevenz from 'pages/FileManager/assets/office/7z.png';
import ae from 'pages/FileManager/assets/office/ae.png';
import ai from 'pages/FileManager/assets/office/ai.png';
import apk from 'pages/FileManager/assets/office/apk.png';
import asc from 'pages/FileManager/assets/office/asc.png';
import ascx from 'pages/FileManager/assets/office/ascx.png';
import cfm from 'pages/FileManager/assets/office/cfm.png';
import conf from 'pages/FileManager/assets/office/conf.png';
import css from 'pages/FileManager/assets/office/css.png';
import defaultFile from 'pages/FileManager/assets/office/default.png';
import dmg from 'pages/FileManager/assets/office/dmg.png';
import doc from 'pages/FileManager/assets/office/doc.png';
import docx from 'pages/FileManager/assets/office/docx.png';
import eps from 'pages/FileManager/assets/office/eps.png';
import exe from 'pages/FileManager/assets/office/exe.png';
import fig from 'pages/FileManager/assets/office/fig.png';
import figma from 'pages/FileManager/assets/office/figma.png';
import flv from 'pages/FileManager/assets/office/flv.png';
import folder from 'pages/FileManager/assets/office/folder.png';
import gif from 'pages/FileManager/assets/office/gif.png';
import glb from 'pages/FileManager/assets/office/glb.png';
import gzip from 'pages/FileManager/assets/office/gzip.png';
import htaccess from 'pages/FileManager/assets/office/htaccess.png';
import html5 from 'pages/FileManager/assets/office/html5.png';
import id from 'pages/FileManager/assets/office/id.png';
import iso from 'pages/FileManager/assets/office/iso.png';
import jpg from 'pages/FileManager/assets/office/jpg.png';
import jpeg from 'pages/FileManager/assets/office/jpeg.png';
import js from 'pages/FileManager/assets/office/js.png';
import json from 'pages/FileManager/assets/office/json.png';
import lib from 'pages/FileManager/assets/office/lib.png';
import maya from 'pages/FileManager/assets/office/maya.png';
import mov from 'pages/FileManager/assets/office/mov.png';
import mp3 from 'pages/FileManager/assets/office/mp3.png';
import mp4 from 'pages/FileManager/assets/office/mp4.png';
import mpa from 'pages/FileManager/assets/office/mpa.png';
import open from 'pages/FileManager/assets/office/open.png';
import otf from 'pages/FileManager/assets/office/otf.png';
import pdf from 'pages/FileManager/assets/office/pdf.png';
import php from 'pages/FileManager/assets/office/php.png';
import png from 'pages/FileManager/assets/office/png.png';
import ppt from 'pages/FileManager/assets/office/ppt.png';
import pptx from 'pages/FileManager/assets/office/pptx.png';
import pr from 'pages/FileManager/assets/office/pr.png';
import psd from 'pages/FileManager/assets/office/psd.png';
import rar from 'pages/FileManager/assets/office/rar.png';
import rp from 'pages/FileManager/assets/office/rp.png';
import sql from 'pages/FileManager/assets/office/sql.png';
import stl from 'pages/FileManager/assets/office/stl.png';
import svg from 'pages/FileManager/assets/office/svg.png';
import swf from 'pages/FileManager/assets/office/swf.png';
import ttf from 'pages/FileManager/assets/office/ttf.png';
import txt from 'pages/FileManager/assets/office/txt.png';
import video from 'pages/FileManager/assets/office/video.png';
import visio from 'pages/FileManager/assets/office/visio.png';
import wmv from 'pages/FileManager/assets/office/wmv.png';
import xd from 'pages/FileManager/assets/office/xd.png';
import xls from 'pages/FileManager/assets/office/xls.png';
import xlsx from 'pages/FileManager/assets/office/xlsx.png';
import xmind from 'pages/FileManager/assets/office/xmind.png';
import xml from 'pages/FileManager/assets/office/xml.png';
import yml from 'pages/FileManager/assets/office/yml.png';
import zip from 'pages/FileManager/assets/office/zip.png';

const mimeOptions = [
  {
    icon: threedm,
    value: '3dm',
  },
  {
    icon: elevenz,
    value: '7z',
  },
  {
    icon: ae,
    value: 'ae',
  },
  {
    icon: ai,
    value: 'ai',
  },
  {
    icon: apk,
    value: 'apk',
  },
  {
    icon: asc,
    value: 'asc',
  },
  {
    icon: ascx,
    value: 'ascx',
  },
  {
    icon: cfm,
    value: 'cfm',
  },
  {
    icon: conf,
    value: 'conf',
  },
  {
    icon: css,
    value: 'css',
  },
  {
    icon: defaultFile,
    value: 'default',
  },
  {
    icon: dmg,
    value: 'dmg',
  },
  {
    icon: doc,
    value: 'doc',
  },
  {
    icon: docx,
    value: 'docx',
  },
  {
    icon: eps,
    value: 'eps',
  },
  {
    icon: exe,
    value: 'exe',
  },
  {
    icon: fig,
    value: 'fig',
  },
  {
    icon: figma,
    value: 'figma',
  },

  {
    icon: flv,
    value: 'flv',
  },
  {
    icon: folder,
    value: 'folder',
  },
  {
    icon: figma,
    value: 'figma',
  },
  {
    icon: gif,
    value: 'gif',
  },
  {
    icon: glb,
    value: 'glb',
  },
  {
    icon: gzip,
    value: 'gzip',
  },
  {
    icon: htaccess,
    value: 'htaccess',
  },
  {
    icon: html5,
    value: 'html5',
  },
  {
    icon: id,
    value: 'id',
  },
  {
    icon: iso,
    value: 'iso',
  },
  {
    icon: jpeg,
    value: 'jpeg',
  },
  {
    icon: jpg,
    value: 'jpg',
  },
  {
    icon: js,
    value: 'js',
  },
  {
    icon: json,
    value: 'json',
  },
  {
    icon: lib,
    value: 'lib',
  },
  {
    icon: maya,
    value: 'maya',
  },
  {
    icon: mov,
    value: 'mov',
  },
  {
    icon: mp3,
    value: 'mp3',
  },
  {
    icon: mp4,
    value: 'mp4',
  },
  {
    icon: mpa,
    value: 'mpa',
  },
  {
    icon: open,
    value: 'open',
  },
  {
    icon: otf,
    value: 'otf',
  },
  {
    icon: pdf,
    value: 'pdf',
  },
  {
    icon: php,
    value: 'php',
  },
  {
    icon: png,
    value: 'png',
  },
  {
    icon: ppt,
    value: 'ppt',
  },
  {
    icon: pptx,
    value: 'pptx',
  },
  {
    icon: pr,
    value: 'pr',
  },
  {
    icon: psd,
    value: 'psd',
  },
  {
    icon: rar,
    value: 'rar',
  },
  {
    icon: rp,
    value: 'rp',
  },
  {
    icon: sql,
    value: 'sql',
  },
  {
    icon: stl,
    value: 'stl',
  },
  {
    icon: svg,
    value: 'svg',
  },
  {
    icon: swf,
    value: 'swf',
  },
  {
    icon: ttf,
    value: 'ttf',
  },
  {
    icon: txt,
    value: 'txt',
  },
  {
    icon: video,
    value: 'video',
  },
  {
    icon: visio,
    value: 'visio',
  },
  {
    icon: wmv,
    value: 'wmv',
  },
  {
    icon: xd,
    value: 'xd',
  },
  {
    icon: xls,
    value: 'xls',
  },
  {
    icon: xlsx,
    value: 'xlsx',
  },
  {
    icon: xmind,
    value: 'xmind',
  },
  {
    icon: xml,
    value: 'xml',
  },
  {
    icon: yml,
    value: 'yml',
  },
  {
    icon: zip,
    value: 'zip',
  },
];

const getIcon = data =>
  mimeOptions.find(_ => _.value?.toLowerCase() === data?.file_ext?.toLowerCase())?.icon ?? defaultFile;

const permissionOptions = [
  {
    key: PERMISSION.VIEW,
    label: 'Người xem',
    value: {
      is_delete: 0,
      is_read: 1,
      is_write: 0,
    },
  },
  {
    key: PERMISSION.EDIT,
    label: 'Người chỉnh sửa',
    value: {
      is_delete: 0,
      is_read: 1,
      is_write: 1,
    },
  },
];

const permissionChangeOptions = [
  {
    key: PERMISSION.VIEW,
    label: 'Người xem',
    value: {
      is_delete: 0,
      is_read: 1,
      is_write: 0,
    },
  },
  {
    key: PERMISSION.EDIT,
    label: 'Người chỉnh sửa',
    value: {
      is_delete: 0,
      is_read: 1,
      is_write: 1,
    },
  },
  {
    key: PERMISSION.UNPERMISSION,
    label: 'Xoá quyền truy cập',
    value: {
      is_delete: 0,
      is_read: 0,
      is_write: 0,
    },
  },
];

export { mimeOptions, permissionOptions, permissionChangeOptions, getIcon };
