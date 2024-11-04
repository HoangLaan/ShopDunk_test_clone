import useVerifyAccess from 'hooks/useVerifyAccess';

function CheckAccess(props) {
  const { verify } = useVerifyAccess(props);

  const _render = () => {
    let { permission, any = false, children } = props;
    let permissions = permission instanceof Array ? permission : [permission];
    let result = !!permissions.length;
    for (let i = 0; i < permissions.length; i++) {
      let permission = permissions[i];
      let check = true === verify({ function: permission });
      if (check && any) {
        result = true;
        break;
      }
      result = result && check;
    }
    return true === result ? (typeof children === 'function' ? children(true === result) : children) : null;
  };
  return _render();
}

export default CheckAccess;
