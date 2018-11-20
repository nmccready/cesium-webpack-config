/* eslint-disable no-param-reassign, import/extensions, import/no-unresolved */
// extend a webpack config with the common setup for
// aliases, loaders ..etc
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import { merge as _merge } from 'lodash';

import paths from './paths';

// exporting as this get used time and time again in storybook configs
// TODO: .. get this dedicated repo.. eventually
export const assign = (obj = {}, extend) => Object.assign({}, obj, extend);
export const concat = (array = [], toConcat) => array.concat(toConcat);
export const merge = (obj = {}, extend) => _merge(obj, extend);

// default proxy whatever setting
const proxy = (obj) => obj;

export default function cesiumWebpack(config, { rootPath, copy = proxy } = {}) {
  const cesiumPaths = paths(rootPath);
  config.output = assign(config.output, { sourcePrefix: '' });
  config.amd = assign(config.amd, { toUrlUndefined: true });
  config.node = assign(config.node, { fs: 'empty' });
  config.resolve = merge(config.resolve, {
    alias: {
      // Cesium module name
      cesium: path.resolve(__dirname, cesiumPaths.cesium)
    }
  });
  config.module = config.module || {};
  config.module.rules = concat(config.module.rules, {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
    include: [cesiumPaths.source]
  });

  config.plugins = concat(config.plugins, [
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin([copy({ from: cesiumPaths.workers, to: 'Workers' })]),
    new CopyWebpackPlugin([copy({ from: cesiumPaths.assets, to: 'Assets' })]),
    new CopyWebpackPlugin([copy({ from: cesiumPaths.widgets, to: 'Widgets' })]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('../')
    })
  ]);

  return config;
}
