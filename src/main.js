// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import Vuex from 'vuex'
import VueRouter from 'vue-router';
import Vote from './Vote'

//Vue.use(Vuex)

Vue.use(VueRouter)
const Home = { template: '<div>Click on <b>name</b> of supervisory board to see details.</div>' }
const SbDetail = { template: '<div>Details: {{ $route.params.sb_name }}</div>' }
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/sb_detail/:sb_name', component: SbDetail, name: 'sbDetail'}
  ]
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#vote',
  template: '<Vote/>',
  //store,
  components: { Vote }
})