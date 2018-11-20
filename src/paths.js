import path from 'path';

export default function paths(startPath)  {
  // aiding with cesiums crazy node setup process since there is no
  // main entry point in package.json
  const root = path.join(startPath, 'node_modules/cesium');
  const workers = path.join(root, 'Build/Cesium/Workers');
  const source = path.join(root, 'Source');

  const toReturn = {
    root,
    source,
    workers
  };

  ['Cesium', 'Assets', 'Widgets'].forEach((n) => {
    toReturn[n.toLowerCase()] = path.join(source, n);
  });

  return toReturn;
};
