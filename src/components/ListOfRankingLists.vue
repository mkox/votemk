<template>
  <table>
    <thead>
      <tr>
        <th>Ranking lists {{ area }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, entryIndex) in data">
        <td>
          <router-link :to="{ name: 'rankingList', params: { rl_id: entry.id, sb_index: 0}}">{{entry.name}}</router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'ListOfRankingLists',
  props: {
    data: Array
    //columns: Array,
    //filterKey: String
  },
  /*data: function () {
    var sortOrders = {}
//console.log('Votegrid.vue script data, this', this);
//console.log('Votegrid.vue script data, this.columns', this.columns);
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },*/
  computed: {
		area: function () {
			var rankingLists = this.data;
			if(typeof rankingLists[0] != 'undefined') {
				return (rankingLists[0].region == 'international') ? 'international' : 'regional'
			}
		}
		/*
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
		*/
  },
  filters: {
		/*
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
		*/
  },
  methods: {
		/*
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
		*/
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
