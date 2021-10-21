// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/free' : '/',//相对路径
  outputDir: 'dist',//构建输出目录
  assetsDir: '',//静态资源目录(js,css,img,fonts)
  runtimeCompiler: true,
  chainWebpack: () => { },
  configureWebpack: () => { },
  devServer: {
    open: false,//使用npm run serve 之后是否自动在浏览器中打开项目
    host: '0.0.0.0',//主机名字
    port: 8080,//端口号
    https: false,//true启动浏览器会给出一些警告
    hotOnly: false,//热更新 webpack已经有
    proxy: {
      // 配置跨域，请求后端接口
      '/api': {
        target: 'http://youtang.com/',//源地址
        changeOrigin: true,//是否允许跨域
        // ws: false,//是否代理websockets
        pathRewrite: {
          '^/api': ''
        }
      },
      '/hot': {
        target: 'http://youtang.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/hot': ''
        }
      },
      '/bbsearch': {
        target: 'http://youtang.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/bbsearch': ''
        }
      },
      '/defaultsearch': {
        target: 'http://youtang.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/defaultsearch': ''
        }
      },

    },
    before: app => { }
  },
  //第三方插件配置
  pluginOptions: {}
}
