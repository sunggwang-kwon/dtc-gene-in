import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login'
import Progress from '@/components/Progress'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/progress',
    name: 'Progress',
    component: Progress
  },
  {
    path: '*',
    component: Login
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior(){
    return {x:0, y:0}
  }
});

export default router;