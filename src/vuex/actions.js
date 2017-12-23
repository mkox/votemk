import { SET_EXTENDED_DATA, CHANGE_MSG, INCREMENT_COUNTER } from './mutation_types'
import axios from 'axios';

//import rankingList from 'rankingList';
var rankingList = require('rankingList');

export default {
    setExtendedData ({ commit }) {
        console.log('setExtendedData commit', commit);
        //console.log('setExtendedData commit()', commit());
        var promise = axios.get('static/rawData/startjson14b.json')
    .then(function (response) {
      console.log('startjson-response', response);
      var extendedData = getExtendedData(response.data);
      //var sbs = showSBBasics(extendedData);
      //thisBeforeMount.gridData = sbs;
      console.log('extendedData: ', extendedData);
      //store.commit('extendedData', extendedData)
      commit(SET_EXTENDED_DATA, extendedData);
        //console.log('BEFORE this.$store.commit in setExtendedData() ');
      //this.$store.commit('extendedData', extendedData);
        console.log('BEFORE sbs in setExtendedData() ');
        /*
        //var sbs = this.$store.getters.getSupervisoryBoards
        //var sbs = store.getters.getSupervisoryBoards
        console.log('sbs in setExtendedData(): ', sbs);
        */
    })
    .catch(function (error) {
      console.log(error);
    });
    },
  changeMessage ({ commit }, msg) {
    commit(CHANGE_MSG, msg)
  },
  incrementCounter ({ commit }) {
    commit(INCREMENT_COUNTER)
  },
  handleMessageInputChanges ({ commit }, event) {
    commit(CHANGE_MSG, event.target.value)
    if (event.keyCode === 13) {
      commit(INCREMENT_COUNTER)
    }
  }
}

function getExtendedData(rawData) {
    
    rankingList.setStartData(rawData);
    rankingList.extendData();
    var extendedData = rankingList.getExtendedData();
    //console.log('extendedData store.js 50', extendedData);
    return extendedData;
}
