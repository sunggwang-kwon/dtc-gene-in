import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@/styles/custom.scss'

import router from './router'
import {store} from "./store"
import i18n from './i18n'
import lodash from 'lodash'
import VueSession from 'vue-session'
import VueCookies from 'vue-cookies'
import VueJWT from 'vuejs-jwt'

Vue.config.productionTip = false

Vue.prototype.lodash = lodash;

//Vue.prototype.$rootUrl = "https://lims.hlscience.com"
Vue.prototype.$lookupUrl = (process.env.NODE_ENV==='development')?"/lookup/proxy":""

var sessionOption = {
  persist: false
}
Vue.use(VueJWT)
Vue.use(VueSession, sessionOption)
Vue.use(VueCookies);

VueCookies.config('1y');

new Vue({
  vuetify,
  router,
  store: store,
  i18n,
  render: h => h(App)
}).$mount('#app')
