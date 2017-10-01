import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'

Vue.use(Router)

// route-level code splitting
/*
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
const ItemView = () => import('../views/ItemView.vue')
const UserView = () => import('../views/UserView.vue')
*/
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
      vm.bla1 = 'zzBla1c'
    });
  }
}

export function createRouter () {
  return new Router({
    mode: 'history',
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
      { path: '/', component: Home },
      { path: '/sb_detail/:sb_index', component: SbDetail, name: 'sbDetail'}
    ]
  })
}
