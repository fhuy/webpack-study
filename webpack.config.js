const webpack = require('webpack');
const path = require('path');
// const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");    // 没装上
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 3 });
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");  // 没装上
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 压缩html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css单独抽离出来
const MinimizerCssPlugin = require('css-minimizer-webpack-plugin'); // 压缩css

module.exports = {
  mode: 'development',
  // entry: "./main.js",
  // output: {
  //     filename: "bundle.js"
  // }
  entry: {
    math: {
      import: './math.js',
      filename: 'bundle1.js'
    },
    main: {
      import: './main.js',
      filename: 'bundle2.js'
    },
    test: {
      import: './src/test.tsx',
      filename: 'bundle3.js'
    },
    testCss: {
      import: './src/test.css',
      filename: 'bundle4.js'
    }
  },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.jsx?$/,
        // 用 HappyPack 的 loader 替换当前 loaders
        // loader: 'happypack/loader?id=happyBabel',

        use: ['babel-loader'],
        // include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/

        // babel-loader开启缓存
        // use: [
        //     {
        //         loader: 'babel-loader',
        //         options: {
        //             cacheDirectory: true
        //         }
        //     }
        // ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    // new HtmlWebpackExternalsPlugin({
    //     externals: [
    //         {
    //             module: "jquery",
    //             entry: "http://libs.baidu.com/jquery/2.0.0/jquery.min.js",
    //             global: "$"
    //         }
    //     ]
    // }),
    new HappyPack({
      // id 标识 happypack 处理那一类文件
      id: 'happyBabel',
      // 配置loader
      loaders: [
        {
          loader: 'babel-loader?cacheDirectory=true'
        }
      ],
      // 共享进程池
      threadPool: happyThreadPool,
      // 日志输出
      verbose: true
    }),
    new HtmlWebpackPlugin({
      // 动态生成 html 文件
      template: './index.html',
      minify: {
        // 压缩HTML
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联css
      }
    }),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({parallel: true}),    // 开启多进程
      new TerserPlugin({ parallel: true }), // 默认已经开启，其实无需设置
      new MinimizerCssPlugin({})
    ]
  }
};
