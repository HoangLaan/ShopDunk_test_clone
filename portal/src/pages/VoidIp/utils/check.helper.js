export const checkIsSamTenant = (ext) => {
  return ext.toString().startsWith('2') ? true : false;
};

export const genSamTenantConfig = (ext) => {
  const iUser = String(ext);
  const iWsServers = 'wss://sbc.shopdunk.com:7444';
  const iUri = `sip:${iUser}@samcenter.vn`;
  const iPassword = 'Agent@@2023'; // dang gan cung
  const iProxy = 'pbx.shopdunk.com:50061';
  const Config = {
    iUser: iUser,
    iWsServers: iWsServers,
    iUri: iUri,
    iPassword: iPassword,
    iProxy: iProxy,
  };
  return Config;
};
