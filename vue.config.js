// const px2rem = require('postcss-px2rem')

// const postcss = px2rem({
//   remUnit: 37.5 // 基准大小 baseSize，需要和rem.js中相同
// })
const IS_PROD = process.env.NODE_ENV === 'production'
module.exports = {
  lintOnSave: false, // 关闭eslint
  // build空白
  assetsDir: 'static',
  parallel: false,

  publicPath: './',
  // publicPath: '/mobile/wechat', //设置引入静态资源的访问路径
  outputDir: 'dist/mobile/wechat', // 设置编译后代码的存放路径
  productionSourceMap: !IS_PROD,
  transpileDependencies: [
    'vuex-persist',
    'dom7',
    'ssr-window',
    'swiper',
    'crypto-js'
  ],
  devServer: {
    proxy: {
      '/*': { // 匹配所有以 '/api'开头的请求路径
        target: 'http://localhost:8090/tomcatTest', // 代理目标的基础路径
        // 此处配置代理路径 axios 的 defaults.baseURL 就需注释掉
        changeOrigin: true, // 支持跨域
        pathRewrite: { // 重写路径: 去掉路径中开头的'/api'
          '^/api': ''
        }
      }
    }
  },

  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         postcss
  //       ]
  //     }
  //   }
  // },

  // 配置别名
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        api: '@/api',
        views: '@/views'
      }
    }
  },
  chainWebpack: (config) => {
    // config.module.rule('js').include.add(/node_modules\/(dom7|swiper)\/.*/)
    config.module
      .rule('css')
      .test(/\.css$/)
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('px2rem')
      .loader('px2rem-loader')
      .options({
        remUnit: 37.5
      })
  }
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         require('postcss-plugin-px2rem')({
  //           rootValue: 37.5, // 换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
  //           // unitPrecision: 5, //允许REM单位增长到的十进制数字。
  //           // propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
  //           // propBlackList: [], //黑名单
  //           exclude: /(node_module)/, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
  //           // selectorBlackList: [], //要忽略并保留为px的选择器
  //           // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
  //           // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
  //           mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
  //           minPixelValue: 3 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
  //         })
  //       ]
  //     }
  //   }
  // }

}
