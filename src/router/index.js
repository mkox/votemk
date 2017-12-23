import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'

Vue.use(Router)

//const Home = { template: '<div>Click on <b>name</b> of supervisory board to see details.</div>' }
//const Home = () => import('../views/HomeForSingleSB.vue')
import Home from '../views/HomeForSingleSB.vue';
import SbDetail from '../views/DetailsForSingleSB.vue';
import Vote from '../Vote.vue';

export function createRouter () {
  return new Router({
    //mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      /*
      { path: '/top/:page(\\d+)?', component: createListView('top') },
      { path: '/new/:page(\\d+)?', component: createListView('new') },
      { path: '/show/:page(\\d+)?', component: createListView('show') },
      { path: '/ask/:page(\\d+)?', component: createListView('ask') },
      { path: '/job/:page(\\d+)?', component: createListView('job') },
      { path: '/item/:id(\\d+)', component: ItemView },
      { path: '/user/:id', component: UserView },
      { path: '/', redirect: '/top' }
      */
      //{ path: '/', component: Home },
      { path: '/', components: {sb_details:Home} },
      //{ path: '/sb_detail/:sb_index', component: SbDetail, name: 'sbDetail'},
      { path: '/sb_detail/:sb_index', components: {sb_details: SbDetail}, name: 'sbDetail'},
      //{ path: '/ranking_list/:rl_id/sb_detail/:sb_index', components: {sb_details: SbDetail}, name: 'sbDetail'},
      { path: '/ranking_list/:rl_id', components: {ranking_list: Vote}, name: 'rankingList'}
    ]
  })
}
