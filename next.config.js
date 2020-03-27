// const withSass = require('@zeit/next-sass')
// module.exports = withSass()

const withStylus =require("@zeit/next-stylus");
const withOffline =require("next-offline");
const path =require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProd = process.env.NODE_ENV === 'production';
const  ManifestPlugin = require('webpack-manifest-plugin')


module.exports =withOffline({
    // withStylus({

    // //devSwSrc: path.resolve(__dirname, "/path/to/my/dev/service-worker.js"),
    //     // assetPrefix: isProd ? 'https://cdn.mydomain.com' : '', //import external css file through next js
    //     // publicRuntimeConfig: { // Will be available on both server and client
    //     //     staticFolder: path.resolve(__dirname,"./staticfolder"),
    //     // },
    //     stylusLoaderOptions: {

    //         import: [path.resolve(__dirname,"./assets/stylus/variables.styl")]

    //     },
    //     distDir: 'build'

    // })
      webpack(config, options) {
    config.node = {
      fs: 'empty'
    }

    const { dev, isServer } = options
    const entryFactory = config.entry;
    config.entry = () => (
      entryFactory()
        .then((entry) => {
          entry["client/styles/lp"] = path.resolve(__dirname, "./client/assets/stylus/theme/lpTheme.styl");
          entry["client/styles/williamssonoma"] = path.resolve(__dirname, "./client/assets/stylus/theme/WSTheme.styl");
          entry["client/styles/potterybarn"] = path.resolve(__dirname, "./client/assets/stylus/theme/PotteryTheme.styl");
          entry["client/styles/westelm"] = path.resolve(__dirname, "./client/assets/stylus/theme/WestTheme.styl");
          entry["client/styles/pbteen"] = path.resolve(__dirname, "./client/assets/stylus/theme/TeensTheme.styl");
          entry["client/styles/potterybarnkids"] = path.resolve(__dirname, "./client/assets/stylus/theme/KidsTheme.styl");
          return entry;
        })
    );
    config.module.rules.push({
      test: /\.styl$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
      ],
    }, )
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name][hash].css',
      }),new ManifestPlugin({
         fileName: 'custom-manifest.json'
    })
    )
    return config
  },
  distDir: 'build'

});
