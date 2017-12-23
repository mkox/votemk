// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import Vuex from 'vuex'
import VueRouter from 'vue-router';
//import Vote from './Vote'
import VoteOverview from './VoteOverview'

//import axios from 'axios';  // ONLY NEEDED FOR TESTING
import store from './vuex/store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

//Vue.use(Vuex)

Vue.use(VueRouter)


// create store and router instances
//const store = createStore()
const router = createRouter()

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

/*
const Home = { template: '<div>Click on <b>name</b> of supervisory board to see details.</div>' }
const SbDetail = { 
  template: '<div>Index: {{ $route.params.sb_index }}<br>' +
  'Name of the sb: {{ sbs[$route.params.sb_index].name }}<br>' +
  'bla1: {{ bla1 }}<br></div>',
  data () {
    return {
      bla1: undefined,
      sbs: store.getters.getSupervisoryBoards
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.bla1 = 'zzBla1b'
    });
  }
}
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/sb_detail/:sb_index', component: SbDetail, name: 'sbDetail'}
  ]
})
*/

/* eslint-disable no-new */
new Vue({
  router,
  el: '#vote',
  //template: '<Vote/>',
  template: '<VoteOverview/>',
  //store,
  //components: { Vote }
  components: { VoteOverview }
})