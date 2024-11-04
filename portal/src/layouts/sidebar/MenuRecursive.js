/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useDebouncedEffect } from '../../hooks/useDebounce';
const Wrapper = styled.ul``;

const IconRotate = styled.i`
  transform: ${(props) => (props.open ? 'rotate(90deg)' : '')};
`;

const IconItem = styled.span`
  margin-right: 16px !important;
  height: 19px;
  width: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RowMenu = styled.span`
  font-weight: ${(props) => props.open && 'bold'};
`;

function MenuRecursive({ items, openKey, setOpenKey, recureSiveOpenKey, hiddenIconOpen }) {
  const history = useHistory();
  const [item, setItem] = useState({});

  const handleClickMenu = () => {
    if (!item.children) {
      if (item.event?.button === 0) {
        history.push(item.path);
        recureSiveOpenKey(item.key);
      }
      if (item.event?.button === 1) {
        window.open(item.path, '_blank');
      }
    } else {
      setOpenKey({
        ...openKey,
        [item.key]: !openKey[item.key],
      });
    }
  };
  useDebouncedEffect(handleClickMenu, [item], 200);

  return (
    <Wrapper>
      {items.map((item) => {
        return (
          <li key={item.name} className={`bw_has_sub ${openKey[item.key] ? 'bw_active' : ''}`}>
            <a
              onContextMenu={(e) => {
                e.preventDefault();
                if (e.button === 2) window.open(item.path, '_blank');
              }}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                setItem({ ...item, event: e });
              }}>
              {item?.icon && <IconItem className={item?.icon}></IconItem>}
              <RowMenu className='bw_hideen_nav' open={openKey[item.key]}>
                {item?.name}
              </RowMenu>
            </a>
            {item.children && !hiddenIconOpen && (
              <IconRotate
                onClick={() => {
                  setOpenKey({
                    ...openKey,
                    [item.key]: !openKey[item.key],
                  });
                }}
                className='fi fi-rr-angle-small-right'
                open={openKey[item.key]}
              />
            )}
            {openKey[item.key] && item.children && (
              <MenuRecursive
                hiddenIconOpen
                items={item.children}
                openKey={openKey}
                setOpenKey={setOpenKey}
                recureSiveOpenKey={recureSiveOpenKey}
              />
            )}
          </li>
        );
      })}
    </Wrapper>
  );
}

export default MenuRecursive;
