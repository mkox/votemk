<template>   
  <table>
    <tr>
      <td>
        <div v-if="sbIndex >= 0">Index: {{ sbIndex }}<br>Name of the sb: {{ sbs[sbIndex].name }}<br>
        </div>
      </td>
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
        sbIndex: undefined 
      }
    },
    beforeRouteEnter (to, from, next) {
      console.log('details-for-single-sb beforeRouteEnter to', to);
      next(vm => {
        vm.sbIndex = to.params.sb_index
      });
    },
    beforeRouteUpdate (to, from, next) {
      console.log('details-for-single-sb beforeRouteUpdate to', to);
      this.sbIndex = to.params.sb_index
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
