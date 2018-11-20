/* eslint-disable no-param-reassign, import/extensions, import/no-unresolved */
// extend a webpack config with the common setup for
// aliases, loaders ..etc
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

import paths from './paths';


// exporting as this get used time and time again in storybook configs
// TODO: .. get this dedicated repo.. eventually
export const assign = (obj = {}, extend) => Object.assign(obj, extend);
export const concat = (array = [], toConcat) => array.concat(toConcat);

export default function cesiumWebpack(config, rootPath) {
  const cesiumPaths = paths(rootPath);
  config.output.sourcePrefix = '';
  config.amd = assign(config.amd, { toUrlUndefined: true });
  config.node = assign(config.node, { fs: 'empty' });
  config.resolve.alias = assign(config.resolve.alias, {
    // Cesium module name
    cesium: path.resolve(__dirname, cesiumPaths.cesium)
  });
  config.module.rules = concat(config.module.rules, {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
    include: [cesiumPaths.source]
  });

  config.plugins = concat(config.plugins, [
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin([{ from: cesiumPaths.workers, to: 'Workers' }]),
    new CopyWebpackPlugin([{ from: cesiumPaths.assets, to: 'Assets' }]),
    new CopyWebpackPlugin([{ from: cesiumPaths.widgets, to: 'Widgets' }]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('../')
    })
  ]);

  return config;
};
