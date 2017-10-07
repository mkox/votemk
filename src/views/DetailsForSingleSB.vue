<template>
  <div>Index: {{ $route.params.sb_index }}<br>Name of the sb: {{ sbs[$route.params.sb_index].name }}<br>
  bla1: {{ bla1 }}<br>
  </div>
</template>

<script>
  
  import store from '../vuex/store'

  export default {
    name: 'details-for-single-sb',
    data () {
      return {
        bla1: undefined,
        sbs: store.getters.getSupervisoryBoards
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.bla1 = 'zzBla1d'
      });
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
