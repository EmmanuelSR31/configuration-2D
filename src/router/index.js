import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import { routers } from './router'
/* import Util from '@/utils/index'
import { noRuleRouter } from '@/router/router' */

Vue.use(Router)

// 路由配置
const RouterConfig = {
  routes: routers
}

export const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // 权限判断
  /* let noRuleRouters = ['login']
  for (let iterator of noRuleRouter.children) {
    noRuleRouters.push(iterator.path)
  }
  let temp = Util.getCookie('positionUrls')
  let urls = []
  let user = JSON.parse(Util.getCookie('user'))
  if (Util.isEmpty(user)) {
    user = {}
  }
  if (!Util.isEmpty(temp)) {
    urls = temp.split(',')
  }
  if (user.position_id !== 9) {
    if (!noRuleRouters.includes(to.name)) {
      if (!urls.includes(to.path)) {
        next({
          name: 'home'
        })
        return false
      }
    }
  }
  // 登录判断
  if (Util.isEmpty(Util.getCookie('user')) && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    })
  } else if (!Util.isEmpty(Util.getCookie('user')) && to.name === 'login') { // 判断是否已经登录且前往的是登录页
    next({
      name: 'home'
    })
  } else { // 没有配置权限的路由, 直接通过
    next()
  } */
  next()
})

router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
