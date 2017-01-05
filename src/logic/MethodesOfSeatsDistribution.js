// Ext.define('MyApp.logic.MethodesOfSeatsDistribution', function () {
define([], function () {
    
    /**
     * Used for: 
     * - lists of supervisory boards
     * - parties
     * 
     * @param {type} lists
     * @param {type} votesTotal
     * @param {type} seats
     * @param {type} area
     * @param {type} mode
     * @returns {Array}
     */
    function voteBySainteLague(lists, votesTotal, seats, area, mode) { // Mode is not used at the moment
        //console.log('voteBySainteLague params: ', [lists, votesTotal, seats, area, mode]);
        var resultList = [];
        var divisor = 0.5;
        var counter = 0;
        var cZ = 0;
        for (var i = 1; i <= seats; i++) {
            for (var iList in lists) {
                var list = lists[iList];

                counter++;
                var votesOfList = list.votes[area];
                resultList[counter] = [];
                resultList[counter]['dividedValue'] = votesOfList / divisor;
                resultList[counter]['list'] = list.id;
            }
            divisor += 1;
        }
        //console.log('voteBySainteLague, resultList: ', resultList);
        //console.log('voteBySainteLague, JSON.parse(JSON.stringify(resultList)) before sort: ', JSON.parse(JSON.stringify(resultList)));
        //console.log('voteBySainteLague, Object.assign(resultList) before sort: ', Object.assign(resultList));
        resultList.sort(function (valueA, valueB) {//Object.assign()
            var a = valueA['dividedValue'];
            var b = valueB['dividedValue'];
            if (a === b) {
                return 0;
            }
            return (a < b) ? +1 : -1;
        });
        //console.log('voteBySainteLague, resultList after sort: ', resultList);
        
        var seatsResult = [];
        for (var i = 0; i < seats; i++) {
            if (typeof resultList[i] !== 'undefined') {
                if (typeof seatsResult[resultList[i]['list']] !== 'undefined') {
                    seatsResult[resultList[i]['list']] += 1;
                } else {
                    seatsResult[resultList[i]['list']] = 1;
                }
            }
        }

        return seatsResult;
    }

    return {
        voteBySainteLague: function (lists, votesTotal, seats, area, mode) {
            var result = voteBySainteLague(lists, votesTotal, seats, area, mode);
            return result;
        }
    };

});