<template>
	<div>
		<h2>{{ listType }} Ranking List with Vote Differences:</h2>
		<div v-for="(area, areaKey) in voteDifferences" v-if="area.length > 0">
			<table>
				<thead>
					<tr>
						<th>difference</th>
						<th>too few</th>
						<th>too much</th>
						<th>filter status</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(diff, diffIndex) in area">
						<td class="difference">{{Math.round(diff.difference*100)/100}} %</td>
						<td class="listTooFew">{{diff.listTooFew.name}}</td>
						<td class="listTooMuch">{{diff.listTooMuch.name}}</td>
						<td class="filterStatus"><span v-html="textOfFilterStatus[diff.filterStatus]"></span></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>

export default {
  name: 'VoteDifferences',
  props: {
    voteDifferences: Object,
		listType: String,
		textOfFilterStatus: Object
  },
  data: function () {
		return {}
		/*
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
		*/
  },
  computed: {
		/*
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
<style>
	#lower .not-filtered { /* Does not work with "scoped" */
		font-weight: bold;
	}
	#lower .difference {
		font-weight: bold;
	}
	#filteredListOfVoteDifferences .filterStatus {
		/*display: none;*/
	}
	/*
	.oppositeAreaLink {
		float: right;
	}
	*/
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
