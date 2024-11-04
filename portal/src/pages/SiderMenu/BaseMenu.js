import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { getAllParentId, urlToList } from 'utils';

function BaseMenu(props) {
  const {
    navigation = [],
    menus,
    location: { pathname },
    collapsed,
  } = props;

  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  useEffect(() => {
    if (menus && menus.length > 0 && pathname) {
      if (collapsed) {
        setOpenKeys([]);
      } else {
        let arrPathname = urlToList(props.location.pathname);
        let findMenu = (menus || []).find((p) => (arrPathname || []).some((x) => x === p.link_menu)) || null;
        let _openKeys = getAllParentId(menus, findMenu ? findMenu.menu_id : 0);
        setOpenKeys(_openKeys);
        setSelectedKeys(findMenu ? findMenu.menu_id : 0);
      }
    }
  }, [menus, collapsed, pathname]);

  const handleOpenChangeMenu = (openKeys) => {
    let lastKey = openKeys[openKeys.length - 1];
    let moreThanOne = false;
    if (lastKey) {
      let find = (menus || []).find((p) => p.menu_id == lastKey);
      if (find && find._.level == 1) {
        moreThanOne = true;
      }
    }
    setOpenKeys(moreThanOne ? [openKeys.pop()] : [...openKeys]);
  };
  
  return (
    <Menu
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 120px)',
        position: 'sticky',
        top: 0,
        left: 0,
        color: '#EEEEEE',
        background: 'transparent',
      }}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      mode='inline'
      items={navigation}
      onOpenChange={handleOpenChangeMenu}
    />
  );
}

export default BaseMenu;
