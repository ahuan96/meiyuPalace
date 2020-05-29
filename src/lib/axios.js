import axios from 'axios'
import { Loading } from 'element-ui'

/**
 * [request Request拦截器]
 * @return {[]} []
 */
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * [response Response拦截器]
 * @return {[]} []
 */
axios.interceptors.response.use(
  response => {
    if (response.data.errCode === 2) {
      this.router.push({
        name: 'Login',
        querry: {
          redirect: this.router.currentRoute.fullPath
        }
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * [post 封装POST方法]
 * @param  {[String]} url [请求服务]
 * @param  {[Object]} params [传参]
 * @param  {[Object]} urlparams [url拼接传参]
 * @return {[Promise]} [Promise]
 */
export function post (url, params = {}, urlparams = {}) {
  const option = {
    target: '.contain'
  }
  const loading = Loading.service(option)

  let urlPath = (this.url + url + '?p_token=' + this.cookie)
  console.log(urlparams)
  for (let key in urlparams) {
    console.log(key)
    urlPath += '&' + key + '=' + urlparams[key]
  }

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: urlPath,
      data: {
        ...params
      },
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    }

    axios(options).then(res => {
      if (res.status === 200) {
        const rt = res.data
        if (rt.err_code === 0) {
          resolve(res.data)
        } else if (rt.err_code === 510) {
          const loginUrl = this.url.replace('laoshi', 'login')
          window.location.href = loginUrl
        } else {
          reject(rt)
          this.$err(rt.msg)
        }
      } else {
        reject(res)
        this.$err()
      }

      this.$nextTick(() => {
        loading.close()
      })
    }).catch(err => {
      reject(err)
      this.$err()

      this.$nextTick(() => {
        loading.close()
      })
    })
  })
}

/**
 * [get 封装GET方法]
 * @param  {[String]} url [请求服务]
 * @param  {[Object]} params [传参]
 * @return {[Promise]} [Promise]
 */
export function get (url, params = {}) {
  const option = {
    target: '.contain'
  }
  const loading = Loading.service(option)

  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: (this.url + url),
      params: {
        p_token: this.cookie,
        ...params
      }
    }

    axios(options).then(res => {
      if (res.status === 200) {
        const rt = res.data
        if (rt.err_code === 0) {
          resolve(res.data)
        } else if (rt.err_code === 510) {
          const loginUrl = this.url.replace('laoshi', 'login')
          window.location.href = loginUrl
        } else {
          reject(rt)
          this.$err(rt.msg)
        }
      } else {
        reject(res)
        this.$err()
      }

      this.$nextTick(() => {
        loading.close()
      })
    }).catch(err => {
      reject(err)
      this.$err()

      this.$nextTick(() => {
        loading.close()
      })
    })
  })
}

/**
 * [err 网络请求失败]
 * @param  {[String]} msg [错误信息]
 * @return {[]} []
 */
export function err (msg) {
  if (!msg) msg = '网络请求失败，请稍后再试'
  this.$notify.error({
    title: '错误',
    message: msg,
    offset: 100
  })
}
