<template>
	<div id='voteOverview'>
		<div id="upper">
			<div id='leftBar'>
				<div id='rlInt'>
					<div class='overview'>
						<ListOfRankingLists
						:data="rankingListsInternational">
						</ListOfRankingLists>
					</div>
				</div>
				<div id='rlRegional'>
					<div class='overview'>
						<ListOfRankingLists
						:data="rankingListsRegional">
						</ListOfRankingLists>
					</div>
				</div>
			</div>
			<router-view name="ranking_list"></router-view>
			<router-view name="sb_details"></router-view>
		</div>
		<router-view name="lower"></router-view>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ListOfRankingLists from './components/ListOfRankingLists';
  //console.log('Votegrid:', Votegrid);
  import store from './vuex/store'
  //import axios from 'axios';
  //import rankingList from 'rankingList';

  //var axios = require('axios');
  //var rankingList = require('rankingList');

  export default {
    name: 'voteOverview',
    template: '#voteOverview',
    data: () => ({
      //searchQuery: '',
      //gridColumns: ['name', 'vue_seats', 'vue_seats_area', 'vue_seats_changed', 'vue_votes'],
      //gridData: []
      rankingListsInternational: [],
      rankingListsRegional: [],
      supervisoryBoards: []
    }),
    beforeMount() {

      var thisBeforeMount = this;

      store.dispatch('setExtendedData').then(DelayPromise(1000)).then(() => {  // TODO: LATER OTHER SOLUTION than DelayPromise()
        
        var eData = thisBeforeMount.$store.getters.getExtendedData;
        //thisBeforeMount.rankingLists = eData.ranking_lists;
				var rl = eData.ranking_lists;
				var rlIntReg = {international: [], regional: []};
				for (var r = 0; r < rl.length; r++) {
					if(rl[r].region == 'international') {
						 rlIntReg.international.push(rl[r]);
					 } else {
						 rlIntReg.regional.push(rl[r]);
					 }
				}
				thisBeforeMount.rankingListsInternational = rlIntReg.international;
				thisBeforeMount.rankingListsRegional = rlIntReg.regional
																																			
        thisBeforeMount.supervisoryBoards = eData.supervisory_boards;
        
        /*
        //thisBeforeMount.gridData = this.$store.getters.getSupervisoryBoards;
        console.log('in beforeMount, x100 ');
        thisBeforeMount.gridData = thisBeforeMount.$store.getters.getSupervisoryBoards;
        console.log('thisBeforeMount.gridData in beforeMount: ', thisBeforeMount.gridData);
        */
      });

      console.log('"this" in beforeMount: ', this);
      //console.log('thisBeforeMount.gridData in beforeMount: ', thisBeforeMount.gridData);
    },
    components: {
      'ListOfRankingLists': ListOfRankingLists
    },
    store
  };

  function DelayPromise(delay) {  // https://blog.raananweber.com/2015/12/01/writing-a-promise-delayer/
    //return a function that accepts a single variable
    return function(data) {
      //this function returns a promise.
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          //a promise that is resolved after "delay" milliseconds with the data provided
          resolve(data);
        }, delay);
      });
    }
  }
</script>

<style>
  body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #444;
  }
	
	#leftBar {
		/*width: 120px;*/
		float:left;
	}
	
	#vote {
		float: left;
	}
	
  .details {
    float: left;
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