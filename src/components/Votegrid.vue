<template>
  <table>
    <thead>
      <tr>
        <th v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, entryIndex) in filteredData">
        <td v-for="key in columns">
          <router-link :to="{ name: 'rankingListAndDetails', params: {rl_id: rankingListId, sb_id: entry.id }}">{{entry[key]}}</router-link>
					<router-link :to="{ name: 'rankingListAndDetails', params: {rl_id: entry.rankingLists[oppositeArea].id, sb_id: entry.id }}" v-if="key == 'name' && typeof entry.rankingLists[oppositeArea].id != 'undefined'" class="oppositeAreaLink">({{oppositeAreaAbbr}})</router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'votegrid',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
		rankingListId: Number
  },
  data: function () {
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
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
			console.log('data in Votegrid.vue: ', data);
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
    },
		oppositeArea: function () {
			return (this.rankingListId == this.data[0].rankingLists.international.id) ? 'regional' : 'international';
		},
		oppositeAreaAbbr: function () {
			return (this.rankingListId == this.data[0].rankingLists.international.id) ? 'reg' : 'int';
		}
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.oppositeAreaLink {
		float: right;
	}
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
