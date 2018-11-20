import path from 'path';
import cesiumWebpack from '.';
import { get } from 'lodash';

const rootPath = path.join(__dirname, '../');

describe(cesiumWebpack.name, () => {
  let config;
  beforeAll(() => {
    config = cesiumWebpack({}, { rootPath });
    expect(config).toBeTruthy();
  });
  it('should handle empty object', () => {});
  [
    'output.sourcePrefix',
    'amd.toUrlUndefined',
    'node.fs',
    'resolve.alias.cesium',
    'module.rules',
    'plugins'
  ].forEach((fieldPath) => {
    it(fieldPath, () => {
      expect(get(config, fieldPath)).toBeDefined();
    });
  });
});
