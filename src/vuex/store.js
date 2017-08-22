import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import { SET_EXTENDED_DATA, CHANGE_MSG, INCREMENT_COUNTER } from './mutation_types'
import axios from 'axios';
var rankingList = require('rankingList');

//var extendedData = {};

Vue.use(Vuex)

const state = {
  msg: 'Hello Vue!',
  counter: 0,
  extendedData: {'abc': 100}
  /*setExtendedData: function(){
    
}*/
}

const mutations = {
  [SET_EXTENDED_DATA](state, extendedData) {
      console.log('mutation SET_EXTENDED_DATA, extendedData:', extendedData);
    state.extendedData = extendedData;
  },
  [CHANGE_MSG](state, msg) {
      console.log('mutation CHANGE_MSG, msg:', msg);
    state.msg = msg
  },
  [INCREMENT_COUNTER](state) {
    state.counter ++
  }
}

const store = new Vuex.Store({
  state, mutations, getters, actions
})

export default store;
