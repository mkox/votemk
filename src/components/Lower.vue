<template>
	<div id='lower'>
		<div id='filteredListOfVoteDifferences'>
			<VoteDifferences
			:voteDifferences="rankingList.filteredListOfVoteDifferences" :listType="filteredListOfVoteDifferences" :textOfFilterStatus="textOfFilterStatus">
			</voteDifferences>
		</div>
		<div id='listOfVoteDifferences'>
			<VoteDifferences
			:voteDifferences="rankingList.listOfVoteDifferences" :listType="listOfVoteDifferences" :textOfFilterStatus="textOfFilterStatus">
			</voteDifferences>
		</div>
		<div id='listOfParties'>
			<Parties
			:partiesOfRL="partiesOfRL">
			</Parties>
		</div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VoteDifferences from './VoteDifferences';
  import Parties from './Parties';
  import store from '../vuex/store'

  export default {
    name: 'vote',
    template: '#vote',
    data: () => ({
      searchQuery: '',
      gridColumns: ['name', 'vue_seats', 'vue_seats_changed', 'vue_votes'],
      gridData: [],
      rankingListId: -1,
			rankingList: {},
			filteredListOfVoteDifferences: 'filtered',
			listOfVoteDifferences: 'unfiltered',
			textOfFilterStatus: store.getters.getTextOfFilterStatus,
			partiesOfRL: store.getters.getPartiesOfRL
    }),
    beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.rankingListId = to.params.rl_id,
				vm.rankingList = store.getters.getCurrentRankingList;
			});
    },
    beforeRouteUpdate (to, from, next) { // works only together with "watch"
      console.log('Vote.vue beforeRouteUpdate to', to);
			console.log('Vote.vue beforeRouteUpdate rankingListId to.params.rl_id', to.params.rl_id);
			
			//if(this.rankingListId != to.params.rl_id) {
			next(vm => {
				vm.rankingListId = to.params.rl_id,
				vm.rankingList = store.getters.getCurrentRankingList;
			});
			//}
    },
    watch: {
			'$route' (to, from) { // works only together with "beforeRouteUpdate"
				// react to route changes...
				
				console.log('Vote.vue watch to', to);
				this.rankingListId = to.params.rl_id;
				this.rankingList = store.getters.getCurrentRankingList;
				this.partiesOfRL = store.getters.getPartiesOfRL;
			}
    },
    beforeMount() {
      console.log('Vote.vue beforeMount');
      var thisBeforeMount = this;
      
			console.log('Vote.vue thisBeforeMount.rankingListId: ', thisBeforeMount.rankingListId);
/*
      //store.dispatch('setExtendedData').then(DelayPromise(1000)).then(() => {  // TODO: LATER OTHER SOLUTION than DelayPromise()
        //thisBeforeMount.gridData = this.$store.getters.getSupervisoryBoards;
        console.log('in beforeMount, x100 ');
        //thisBeforeMount.gridData = thisBeforeMount.$store.getters.getSupervisoryBoards;
        console.log('thisBeforeMount.gridData in beforeMount: ', thisBeforeMount.gridData);
      //});
*/
      console.log('"this" in beforeMount: ', this);
      //console.log('thisBeforeMount.gridData in beforeMount: ', thisBeforeMount.gridData);
    },
    mounted() {
      console.log('Vote.vue mounted');
    },
    errorCaptured() {
      console.log('Vote.vue errorCaptured');
    },
    activated() {
      console.log('Vote.vue activated');
    },
    beforeCreate() {
      console.log('Vote.vue beforeCreate');
    },
    created() {
      console.log('Vote.vue created');
    },
    beforeUpdate() {
      console.log('Vote.vue beforeUpdate');
    },
    updated() {
      console.log('Vote.vue updated');
    },
    components: {
      'VoteDifferences': VoteDifferences,
			'Parties': Parties
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
	#lower {
		clear: both;
	}
	/*
  body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #444;
  }
    
  .overview {
      float: left
  }

  .details {
      float: left
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
	*/
</style>