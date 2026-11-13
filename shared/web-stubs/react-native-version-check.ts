export const VersionCheck = {
  getCurrentVersion: () => '1.0.0',
  getCurrentBuildNumber: () => '1',
  getLatestVersion: async () => '1.0.0',
  needUpdate: async () => ({ isNeeded: false, currentVersion: '1.0.0', latestVersion: '1.0.0' }),
  getStoreUrl: async () => '',
};

export default VersionCheck;
