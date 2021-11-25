// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'

// import style
// import 'view-design/dist/styles/iview.css'
// import Table from 'view-design/src/components/table'
// import local from 'view-design'
// import lang from 'view-design/src/locale/lang/en-US'
// local(lang)
// Vue.component('NewTable', Table);
import TreeTable from 'vue-table-with-tree-grid'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import axios from 'axios'
import global_ from './Global.vue'
// ace编辑框
import ace from 'ace-builds'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.component('tree-table', TreeTable)
Vue.use(ace)
Vue.use(Element)
Vue.prototype.GLOBAL = global_
axios.defaults.baseURL = global_.BASE_URL
Vue.prototype.$ajax = axios
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 响应拦截器
// axios.interceptors.response.use(
//     response => {
//         // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
//         // 否则的话抛出错误
//         if (response.status === 200) {
//             return Promise.resolve(response);
//         } else {
//             return Promise.reject(response);
//         }
//     },
//     // 服务器状态码不是2开头的的情况
//     // 这里可以跟你们的后台开发人员协商好统一的错误状态码
//     // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
//     error => {
//         if (error.response.status) {
//             switch (error.response.status) {
//                 // 404请求不存在
//                 case 404:
//                 Vue.prototype.$Modal.error({
//                   title: "失败",
//                   content: "后台服务未上线",
//                   duration: 5,
//                   closable: true
//                 });
//                 case 500:
//                 // Vue.prototype.$Modal.error({
//                 //   title: "失败",
//                 //   content: "服务器内部错误，请刷新或者联系运维人员进行处理。",
//                 //   duration: 5,
//                 //   closable: true
//                 // });
//                     break;
//                 // 其他错误，直接抛出错误提示
//                 default:
//                     Vue.prototype.$Modal.error({
//                       title: "失败",
//                       content: error.response.data,
//                       duration: 5,
//                       closable: true
//                     });
//             }
//             return Promise.reject(error.response);
//         }
//     }
// );
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
