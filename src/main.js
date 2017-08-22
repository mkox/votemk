// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import Vuex from 'vuex'
import Vote from './Vote'

//Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
  el: '#vote',
  template: '<Vote/>',
  //store,
  components: { Vote }
})