import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

// axios.defaults.baseURL = 'http://localhost:8090/tomcatTest'// 常态值的优化
axios.interceptors.request.use(function (config) {
//   console.log(config)
  // let token = window.localStorage.getItem('user-token')// 获取token 而此时无法获取到
  // config.headers.Authorization = `Bearer ${token}`// 注入token该给headers的Authorization（授权）
  //   console.log(config)
  return config
})
// 在数据到达响应之前进行处理
// axios.defaults.transformResponse = [function (data) {
//   return data ? JSONBig.parse(data) : {} // 解决js处理大数字失真问题
// }]

axios.interceptors.response.use(function (response) {
  // console.log(response)
  // 成功时进入此函数 return 响应数据
  return response.data ? response.data : {}
  // 判断非空
}, function (error) {
  // 错误进入此函数
  // console.log(error.response.status)
  const status = error.response.status // 获取失败的状态码给予提示消息
  let message = '未知错误'
  switch (status) {
    case 400:
      message = '请求参数错误'
      break
    case 403:
      message = '403 refresh_token未携带或已过期'
      break
    case 507:
      message = '服务器数据库异常'
      break
    case 401:
      message = 'token过期或未出'
      window.localStorage.clear() // 清空缓存或者removeItem（‘user-token’）
      router.push('/login') // this.$router.push()
      break
    case 404:
      message = '手机号不正确'
      break
    default:
      break
  }
  Message({ type: 'warnig', message })
  //   希望 在异常处理函数中将所有的错误都处理完毕 不再进入catch  终止错误
  //   return new Promise(function () {}) // 终止当前的错误
  return Promise.reject(error) // 只要reject =>catch
})

export default axios
