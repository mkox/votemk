<template>   
  <table>
    <tr>
      <td>
        <div v-if="sbIndex >= 0">Index: {{ sbIndex }}<br>Name of the sb: {{ sbs[sbIndex].name }}<br>
        </div>
        <div v-if="sbs[sbIndex]">
          <div v-if="(sbs[sbIndex].voteDifferences.international.length > 0 && region == 'international')
                     || sbs[sbIndex].voteDifferences.regional.length > 0">
            <table>
              <thead>
                <tr>
                  <th>too few</th>
                  <th>too much</th>
                  <th>difference</th>
                  <th>area</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, entryIndex) in sbs[sbIndex].voteDifferences.international" v-if="region == 'international'">
                  <td>{{entry.listTooFew.name}}</td>
                  <td>{{entry.listTooMuch.name}}</td>
                  <td>{{Math.round(entry.difference*100)/100}} %</td>
                  <td>international</td>
                </tr>
                <tr v-for="(entry, entryIndex) in sbs[sbIndex].voteDifferences.regional">
                  <td>{{entry.listTooFew.name}}</td>
                  <td>{{entry.listTooMuch.name}}</td>
                  <td>{{Math.round(entry.difference*100)/100}} %</td>
                  <td>regional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <table>
          <tr v-for="list in sbLists">
            <td>
                Name of list/party: {{ list.name }}<br>
                Votes international: {{ list.votes.international }}
            </td>
          </tr>
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
        sbs: store.getters.getSupervisoryBoards,
        sbIndex: undefined,
				region: undefined
      }
    },
    beforeRouteEnter (to, from, next) {
      console.log('details-for-single-sb beforeRouteEnter to', to);
      next(vm => {
        vm.sbIndex = to.params.sb_index,
				vm.sbs = store.getters.getSupervisoryBoards,
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
				this.sbIndex = to.params.sb_index;
				this.sbs = store.getters.getSupervisoryBoards;
				this.region = store.getters.getRegionOfRL;
			}
		},
    computed: {
      sbLists: function () {
        //console.log('details-for-single-sb sbLists this', this);
        if(this.sbIndex >= 0) { // without "if(this.sbIndex >= 0)" there would be an error, because after beforeRouteEnter sbLists is called twice instead of the expected once.)
          var lists = this.sbs[this.sbIndex].lists;
          console.log('details-for-single-sb sbLists lists', lists);
          lists.sort(function(a, b) {
            return b.votes.international - a.votes.international;
          });
          return lists;
        } else {
          return [];
        }
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
