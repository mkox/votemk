<template>   
  <table>
    <tr>
      <td>
				<h3>Supervisory board "{{ sb.name }}":</h3>
        <div v-if="sb">
          <div v-if="sb.voteDifferences.international.length > 0 || sb.voteDifferences.regional.length > 0">
						<h4>Seats changed:</h4>
            <table>
              <thead>
                <tr>
                  <th>difference</th>
                  <th>too few</th>
                  <th>too much</th>
                  <th>area</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, entryIndex) in sb.voteDifferences.international">
                  <td>{{Math.round(entry.difference*100)/100}} %</td>
                  <td>{{entry.listTooFew.name}}</td>
                  <td>{{entry.listTooMuch.name}}</td>
                  <td>international</td>
                </tr>
                <tr v-for="(entry, entryIndex) in sb.voteDifferences.regional">
                  <td>{{Math.round(entry.difference*100)/100}} %</td>
                  <td>{{entry.listTooFew.name}}</td>
                  <td>{{entry.listTooMuch.name}}</td>
                  <td>regional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
    <tr>
			<td><h4>Lists/parties of this supervisory board:</h4>
				<table>
					<thead>
						<tr>
							<th>Name of<br>list/party</th>
							<th>Votes<br>regional</th>
							<th>Votes<br>international</th>
							<th>Seats final<br>regional</th>
							<th>Seats final<br>international</th>
							<th>Seats first<br>regional</th>
							<th>Seats first<br>international</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="list in sbLists">
							<td>{{ list.name }}</td>
							<td>{{ list.votes.regional }}</td>
							<td><span v-if="typeof sb.rankingLists.international.id != 'undefined'">{{ list.votes.international }}
								</span>
								<span v-else>0</span>
							</td>
							<td>{{ list.seats.regional.corrected }}</td>
							<td><span v-if="typeof sb.rankingLists.international.id != 'undefined'">{{ list.seats.international.corrected }}
								</span>
								<span v-else>0</span></td>
							<td>{{ list.seats.regional.first }}</td>
							<td><span v-if="typeof sb.rankingLists.international.id != 'undefined'">{{ list.seats.international.first }}
								</span>
								<span v-else>0</span>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
    </tr>
  </table>
</template>

<script>
  
  import store from '../vuex/store'

  export default {
    name: 'details-for-single-sb',
    data () {
      return {
        sb: store.getters.getSupervisoryBoardById,
				region: undefined
      }
    },
    beforeRouteEnter (to, from, next) {
      console.log('details-for-single-sb beforeRouteEnter to', to);
      next(vm => {
				vm.sb = store.getters.getSupervisoryBoardById,
				vm.region = store.getters.getRegionOfRL;
      });
    },
    /*beforeRouteUpdate (to, from, next) {
      console.log('details-for-single-sb beforeRouteUpdate to', to);
      //this.sbIndex = to.params.sb_index
      next(vm => {
        vm.sbIndex = to.params.sb_index,
				vm.sbs = store.getters.getSupervisoryBoards;
      });
    },*/
		watch: {
			'$route' (to, from) {
				// react to route changes...
				console.log('details-for-single-sb watch to', to);
				this.sb = store.getters.getSupervisoryBoardById;
				this.region = store.getters.getRegionOfRL;
			}
		},
    computed: {
      sbLists: function () {
        //console.log('details-for-single-sb sbLists this', this);
				
        //if(this.sbIndex >= 0) { // without "if(this.sbIndex >= 0)" there would be an error, because after beforeRouteEnter sbLists is called twice instead of the expected once.)
				//if(this.sb) {
          var lists = this.sb.lists;
          console.log('details-for-single-sb sbLists lists', lists);
          lists.sort(function(a, b) {
            return b.votes.international - a.votes.international;
          });
          return lists;
        /*} else {
          return [];
        }*/
      },
			area: function () {
				return (this.region == 'international') ? 'international' : 'regional';
			}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
    */
</style>
