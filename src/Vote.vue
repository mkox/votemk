<template>
    <div id="vote">
      <form id="search">
        Search <input name="query" v-model="searchQuery">
      </form>
      <votegrid
        :data="gridData"
        :columns="gridColumns"
        :filter-key="searchQuery">
      </votegrid>
    </div>
</template>

<script>
import Vue from 'vue';
import Votegrid from './components/Votegrid';
//console.log('Votegrid:', Votegrid);
import axios from 'axios';
//import rankingList from 'rankingList';

//var axios = require('axios');
var rankingList = require('rankingList');

export default {
  name: 'vote',
  template: '#vote',
  data: () => ({
    searchQuery: '',
    gridColumns: ['name', 'vue_seats', 'vue_seats_regional', 'vue_seats_regional_changed', 'vue_seats_international', 'vue_seats_international_changed', 'ranking_list_id'],
    gridData: []
  }),
  beforeMount() {
    
    var thisBeforeMount = this;
    var promise = axios.get('static/rawData/startjson9b.json')
    .then(function (response) {
      console.log(response);
      var extendedData = getExtendedData(response.data);
      var sbs = showSBBasics(extendedData);
      thisBeforeMount.gridData = sbs;
      console.log('extendedData: ', extendedData);
    })
    .catch(function (error) {
      console.log(error);
    });
      
  },
  components: {
    'votegrid': Votegrid
  }
};
    
function getExtendedData(rawData) {
    
    rankingList.setStartData(rawData);
    rankingList.extendData();
    var extendedData = rankingList.getExtendedData();
    //console.log('extendedData 10', extendedData);
    return extendedData;
}

function showSBBasics(extendedData) {
    var sbs = extendedData.supervisory_boards;

    for(var i = 0; i < sbs.length; i++) {
        sbs[i]["vue_seats"] = sbs[i].seats.total;
        sbs[i]["vue_seats_regional"] = sbs[i].seats.regional.total;
        sbs[i]["vue_seats_regional_changed"] = sbs[i].seats.regional.changed;
        sbs[i]["vue_seats_international"] = sbs[i].seats.international.total;
        sbs[i]["vue_seats_international_changed"] = sbs[i].seats.international.changed;
    }
    return sbs;
}
</script>

<style>
body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255,255,255,0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th, td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>