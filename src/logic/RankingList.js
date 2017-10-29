//define('MyApp.logic.getRankinglistData.RankingList', function () {
//define(['vote/logic/MethodesOfSeatsDistribution.js'], function (seatsDistribution) {
define(['seatsDistribution'], function (seatsDistribution) {

    var startData = {};
    var extendedData = {};

    // indexes
    var iRL = {}; // iRankingLists
    var iSB = {}; // iSupervisoryBoards
    var iLOC = {}; // iListOfCandidates
    var iPa = {}; // iParties
    var iCa = {}; // iCandidates

    var areas = ['regional', 'international'];

    function createIndexes() {
        var iRankingLists = {};
        for (var i = 0; i < extendedData.ranking_lists.length; i++) {
            iRankingLists[extendedData.ranking_lists[i].id] = i;
        }
        iRL = iRankingLists;

        var iSupervisoryBoards = {};
        for (var i = 0; i < extendedData.supervisory_boards.length; i++) {
            iSupervisoryBoards[extendedData.supervisory_boards[i].id] = i;
        }
        iSB = iSupervisoryBoards;

        var iListOfCandidates = {};
        for (var i = 0; i < extendedData.lists_of_candidates.length; i++) {
            iListOfCandidates[extendedData.lists_of_candidates[i].id] = i;
        }
        iLOC = iListOfCandidates;

        var iCandidates = {};
        for (var i = 0; i < extendedData.candidates_in_list.length; i++) {
            iCandidates[extendedData.candidates_in_list[i].id] = i;
        }
        iCa = iCandidates;

        var iParties = {};
        for (var i = 0; i < extendedData.parties.length; i++) {
            iParties[extendedData.parties[i].id] = i;
        }
        iPa = iParties;
    }

    function beforeListCompare() {
        initData();
        addListsToSBs();
        addRegionsToSBs();
        addRegionsToLists();
        addVotesCandidatesAndPartiesToListsOfCandidates();
        addVotesToSBs();
        setSeatsOfLists();
        addFirstSeatsToParties();
        addVotesForParties();
        addVotesByArea();
        addSeatsByArea();
    }

    function initData() {
        initRankingLists();
        initAdditionsOfListsOfCandidates();
        initAdditionsOfSBs();
    }

    function initRankingLists() {
        rlsSetSBs();
        rlsInitAllConnectedSB();
        rlsInitListsOfVoteDifferences();
        rlsInitParties();
        rlsInitRankingListsInternational();
    }

    function rlsSetSBs() {
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            var sbs = rls[r].supervisory_boards = [];
            for (var s = 0; s < rls[r].sb_ids.length; s++) {
                sbs.push(extendedData.supervisory_boards[iSB[rls[r].sb_ids[s]]]);
            }
        }
    }

    function rlsInitAllConnectedSB() {
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            rls[r].allConnectedSB = {
                regional: {votes: 0, seats: 0, seatsToCorrect: 0},
                international: {votes: 0, seats: 0, seatsToCorrect: 0}
            };
        }
    }

    function rlsInitListsOfVoteDifferences() {
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            rls[r].listOfVoteDifferences = {regional: [], international: []};
            rls[r].filteredListOfVoteDifferences = {regional: [], international: []};
        }
    }

    function rlsInitParties() {
        var rls = extendedData.ranking_lists;
        for (var p = 0; p < extendedData.parties.length; p++) {
            extendedData.parties[p].seats = {};
            for (var r = 0; r < rls.length; r++) {
                extendedData.parties[p].seats[rls[r].id] = {
                    rl_id: rls[r].id,
                    regional: {first: 0, corrected: 0, differenceCounter: 0},
                    international: {first: 0, corrected: 0, differenceCounter: 0}
                };
            }

            extendedData.parties[p].votes = {};
            for (var r = 0; r < rls.length; r++) {
                extendedData.parties[p].votes[rls[r].id] = {
                    rl_id: rls[r].id,
                    regional: 0,
                    international: 0
                };
            }
        }
    }

    function rlsInitRankingListsInternational() {
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            if (rls[r].region === 'international') {
                rls[r].regional_lists = [];
                if (rls[r].current === true) {
                    extendedData.ranking_list_international = rls[r];
                    addRegionalToInternationalList();
                }
            }
        }
    }

    function addRegionalToInternationalList() {
        var rli = extendedData.ranking_list_international;
        var rls = extendedData.ranking_lists;
        var selectedRegionalRlIds = [];
        rli.regional_lists = [];
        for (var s = 0; s < rli.sb_ids.length; s++) {
            for (var r = 0; r < rls.length; r++) {
                if (rls[r].region !== 'international') {
                    if (rls[r].sb_ids.indexOf(rli.sb_ids[s]) > -1) {
                        if (selectedRegionalRlIds.indexOf(rls[r].id) === -1) {
                            selectedRegionalRlIds.push(rls[r].id);
                            rli.regional_lists.push(rls[r]);
                        }
                    }
                }
            }
        }
    }

    function initAdditionsOfListsOfCandidates() {
        for (var i = 0; i < extendedData.lists_of_candidates.length; i++) {
            var listOfCandidates = extendedData.lists_of_candidates[i];
            listOfCandidates.votes = {
                regional: 0,
                international: 0
            };
            listOfCandidates.seats = {
                regional: {first: 0, corrected: 0},
                international: {first: 0, corrected: 0}
            };
            listOfCandidates.candidates = [];
            listOfCandidates.parties = [];
            listOfCandidates.region = '';
        }
    }

    function initAdditionsOfSBs() {
        for (var i = 0; i < extendedData.supervisory_boards.length; i++) {
            var sb = extendedData.supervisory_boards[i];
            sb.votes = {
                regional: 0,
                international: 0
            };
            sb.lists = [];
            sb.voteDifferences = {
                regional: [],
                international: []
            };
            sb.seats.regional = {
                total: 0,
                changed: 0
            };
            sb.seats.international = {
                total: 0,
                changed: 0
            };
            sb.region = '';
        }
    }

    /**
     * Add lists to supervisory board.
     * 
     * @returns {undefined}
     */
    function addListsToSBs() {
        var listsOfCandidats = extendedData.lists_of_candidates;
        for (var i = 0; i < listsOfCandidats.length; i++) {
            var sb = extendedData.supervisory_boards[iLOC[listsOfCandidats[i].supervisory_board_id]];
            sb.lists.push(listsOfCandidats[i]);
        }
    }
    
    function addRegionsToSBs() {
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            if(rls[r] !== 'international') {
                var sbs = rls[r].supervisory_boards;
                for (var s = 0; s < sbs.length; s++) {
                    sbs[s].region = rls[r].region;
                }
            }
        }
    }
    
    function addRegionsToLists() {
        var sbs = extendedData.supervisory_boards;
        for (var s = 0; s < sbs.length; s++) {
            var lists = sbs[s].lists;
            for (var l = 0; l < lists.length; l++) {
                lists[l].region = sbs[s].region;
            }
        }
    }

    /**
     * Adds votes to lists of candidates.
     * Adds candidates to lists of candidates.
     * Add parties to lists of candidates.
     * 
     * @returns {undefined}
     */
    function addVotesCandidatesAndPartiesToListsOfCandidates() {

        var candidatesInList = extendedData.candidates_in_list;
        for (var c = 0; c < candidatesInList.length; c++) {
            var listOfCandidates = extendedData.lists_of_candidates[iLOC[candidatesInList[c].listofcandidates_id]];
            var votesInternational = 0;
            for (var v in candidatesInList[c].votes) {
                votesInternational += candidatesInList[c].votes[v];
            }
            listOfCandidates.votes.international += votesInternational;
            listOfCandidates.votes.regional += candidatesInList[c].votes[listOfCandidates.region];
            listOfCandidates.candidates.push(candidatesInList[c]);
        }

        for (var l = 0; l < extendedData.lists_of_candidates.length; l++) {
            var list = extendedData.lists_of_candidates[l];
            var partiesOfList = [];
            var partyIdsOfList = [];
            for (c = 0; c < list.candidates.length; c++) {
                var partyJoins = list.candidates[c].party_joins;
                for (var pj = 0; pj < partyJoins.length; pj++) {
                    var partyIsInList = partyIdsOfList.indexOf(partyJoins[pj].party_id);
                    if (partyIsInList === -1) {
                        partiesOfList.push(extendedData.parties[iPa[partyJoins[pj].party_id]]);
                        partyIdsOfList.push(partyJoins[pj].party_id);
                    }
                }
            }
            list.parties = partiesOfList;
        }
    }

    /**
     * Add votes to supervisory board.
     * 
     * @returns {undefined}
     */
    function addVotesToSBs() {
        var listsOfCandidats = extendedData.lists_of_candidates;
        for (var i = 0; i < listsOfCandidats.length; i++) {
            var sb = extendedData.supervisory_boards[iLOC[listsOfCandidats[i].supervisory_board_id]];
            sb.votes.international += listsOfCandidats[i].votes.international;
            sb.votes.regional += listsOfCandidats[i].votes.regional;
        }
    }
    
    function setSeatsOfLists() {
        var sbs = extendedData.supervisory_boards;
        for (var i = 0; i < sbs.length; i++) {
            setSeatsOfListsThroughSainteLague(sbs[i]);
        }
    }

    function addFirstSeatsToParties() {
        var lists = extendedData.lists_of_candidates;
        for (var l = 0; l < lists.length; l++) {
            var list = lists[l];
            for (var a = 0; a < areas.length; a++) {
                var candidates = sortCandidatesByVotes(list.candidates, areas[a], list.region);
                for (var s = 0; s < list.seats[areas[a]]['first']; s++) {
                    if (typeof candidates[s] !== 'undefined') {
                        var candidate = candidates[s];
                        for (var pj = 0; pj < candidate.party_joins.length; pj++) {
                            var party = extendedData.parties[iPa[candidate.party_joins[pj].party_id]];
                            var rlIds = getRankinglistIdsBySBId(list.supervisory_board_id);
                            for (var r = 0; r < rlIds.length; r++) {
                                party.seats[rlIds[r]][areas[a]]['first'] += 1 / candidate.party_joins.length;
                            }
                        }
                    } else {
                        console.log('For the following list there are more seats than candidates: ', list);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Sort candidates according to number of votes, descending.
     * 
     * @param {type} candidates
     * @param {type} area
     * @param {type} region
     * @returns {unresolved}
     */
    function sortCandidatesByVotes(candidates, area, region) {
        candidates.sort(function (valueA, valueB) {
            //return a-b
            var a = getVotesOfAreaOfCandidate(valueA['votes'], area, region);
            var b = getVotesOfAreaOfCandidate(valueB['votes'], area, region);
            if (a === b) {
                return 0;
            }
            return (a < b) ? +1 : -1;
        });
        return candidates;
    }
    
    function getVotesOfAreaOfCandidate(votes, area, region){
        var areaVotes = 0;
        if(area === 'international'){
            for (var v in votes) {
                areaVotes += votes[v];
            }
        } else {
            areaVotes = votes[region];
        }
        return areaVotes;
    }

    /**
     * Get ranking list ids of ranking lists that have the supervisory board of the given sbId.
     * 
     * @param {type} sbId
     * @returns {Array}
     */
    function getRankinglistIdsBySBId(sbId) {
        var rlIds = [];
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            if (rls[r].sb_ids.indexOf(sbId) > -1) {
                rlIds.push(rls[r].id);
            }
        }
        return rlIds;
    }
    
    function addVotesForParties() {
        var rli = extendedData.ranking_list_international;
        for (var a = 0; a < areas.length; a++) {
            var rls = [];
            areas[a] == 'international' ? rls.push(rli) : rls = rli.regional_lists;
            for (var r = 0; r < rls.length; r++) {
                for (var s = 0; s < rls[r].supervisory_boards.length; s++) {
                    var sb = rls[r].supervisory_boards[s];
                    for (var l = 0; l < sb.lists.length; l++) {
                        var list = sb.lists[l];

                        for (var c = 0; c < list.candidates.length; c++) {
                            var candidate = list.candidates[c];
                            for (var pj = 0; pj < candidate.party_joins.length; pj++) {
                                var party = extendedData.parties[iPa[candidate.party_joins[pj].party_id]];
                                for (var a2 = 0; a2 < areas.length; a2++) {
                                    if(areas[a2] === 'international'){
                                        var votesInternational = 0;
                                        for (var v in candidate.votes) {
                                            votesInternational += candidate.votes[v];
                                        }
                                        party.votes[rls[r].id][areas[a2]] += votesInternational / candidate.party_joins.length;
                                    } else {
                                        party.votes[rls[r].id][areas[a2]] += candidate.votes[list.region] / candidate.party_joins.length;
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    }

    function addVotesByArea() {
        var parties = extendedData.parties;
        var rls = extendedData.ranking_lists;
        for (var p = 0; p < parties.length; p++) {
            for (var r = 0; r < rls.length; r++) {
                rls[r].allConnectedSB.international.votes += parties[p].votes[rls[r].id].international;
                rls[r].allConnectedSB.regional.votes += parties[p].votes[rls[r].id].regional;
            }
        }
    }

    function addSeatsByArea() {
        var sbs = extendedData.supervisory_boards;
        var rls = extendedData.ranking_lists;
        for (var r = 0; r < rls.length; r++) {
            for (var s = 0; s < rls[r].supervisory_boards.length; s++) {
                rls[r].allConnectedSB.international.seats += getInternationalSeats(sbs[s].seats.total);
                rls[r].allConnectedSB.regional.seats += getRegionalSeats(sbs[s].seats.total);
            }
        }
    }

    /**
     * Set seats of the lists of candidates of this supervisory board,
     * with the help of the Sainte Lague method.
     * 
     * @param {type} sb
     * @returns {undefined}
     */
    function setSeatsOfListsThroughSainteLague(sb) {
        for (var i = 0; i < areas.length; i++) {
            var areaVotes = sb.votes[areas[i]];

            var areaSeats = 0;
            if (areas[i] === 'regional') {
                areaSeats = getRegionalSeats(sb.seats.total);
            } else {
                areaSeats = getInternationalSeats(sb.seats.total);
            }

            var listsOfCandidates = getListsOfSB(sb.id);

            //var methodesOfSeatsDistribution = Ext.create('MyApp.logic.MethodesOfSeatsDistribution');
            var sainteLague = seatsDistribution.voteBySainteLague(listsOfCandidates, areaVotes, areaSeats, areas[i], '');
            //console.log('setSeatsOfListsThroughSainteLague sainteLague: ', sainteLague);
            for (var listId in sainteLague) {
                var seats = sainteLague[listId];
                for (var iList in listsOfCandidates) {
                    var list = listsOfCandidates[iList];

                    if (parseInt(listId) === list.id) {

                        list.seats[areas[i]].first = seats;
                        break;
                    }
                }
            }
        }

    }

    function getListsOfSB(sbId) {
        var lists = [];
        var allLists = extendedData.lists_of_candidates;
        for (var i = 0; i < allLists.length; i++) {
            if (allLists[i].supervisory_board_id === sbId) {
                lists.push(allLists[i]);
            }
        }
        return lists;
    }

    /**
     * add in the votes attribute of parties: corrected, difference
     * add in allConnectedSB: seatsToCorrect
     *
     * @returns {undefined}
     */
    function tooManyOrTooLessSeats() {
        var rli = extendedData.ranking_list_international;
        for (var a = 0; a < areas.length; a++) {
            var rls = [];
            areas[a] == 'international' ? rls.push(rli) : rls = rli.regional_lists;
            for (var r = 0; r < rls.length; r++) {
                var rl = rls[r];
                //var methodesOfSeatsDistribution = Ext.create('MyApp.logic.MethodesOfSeatsDistribution');
                var sainteLague = seatsDistribution.voteBySainteLague(createPartiesWithVotesForRl(rl.id), rl.allConnectedSB[areas[a]]['votes'], rl.allConnectedSB[areas[a]]['seats'], areas[a], 'tooManyOrTooLessSeats');
                //console.log('tooManyOrTooLessSeats() sainteLague: ', sainteLague);
                for (var partyId in sainteLague) {
                    var seatsCorrected = sainteLague[partyId];
                    var party = extendedData.parties[iPa[partyId]];
                    party['seats'][rl.id][areas[a]]['corrected'] += seatsCorrected;
                    var seatsDifference = seatsCorrected - party['seats'][rl.id][areas[a]]['first'];
                    party['seats'][rl.id][areas[a]]['differenceCounter'] += seatsDifference;
                    if (seatsDifference > 0) {
                        extendedData.ranking_lists[iRL[rl.id]].allConnectedSB[areas[a]].seatsToCorrect += seatsDifference;
                    }
                }
            }
        }
    }

    /**
     * Create an array of parties that have only the votes of a single ranking list.
     * 
     * @param {type} rlId
     * @returns {Array}
     */
    function createPartiesWithVotesForRl(rlId) {
        var parties = extendedData.parties;
        var parties2 = [];
        for (var p = 0; p < parties.length; p++) {
            var party2 = {
                id: parties[p].id,
                votes: parties[p].votes[rlId]
            };
            parties2.push(party2);
        }
        return parties2;
    }

    function setListOfVoteDifferences() {
        var rli = extendedData.ranking_list_international;
        for (var a = 0; a < areas.length; a++) {
            var rls = [];
            areas[a] == 'international' ? rls.push(rli) : rls = rli.regional_lists;
            for (var r = 0; r < rls.length; r++) {
                var rl = rls[r];
                for (var s = 0; s < rl.supervisory_boards.length; s++) {
                    var sb = rl.supervisory_boards[s];

                    for (var l = 0; l < sb.lists.length; l++) {// Was ist wenn es um mehrere Durchgänge einer Liste geht?
                        // Aber: mehr als 1 Sitz zusätzlich soll eine Liste auch nicht bekommen können.

                        var list = sb.lists[l];
                        list.candidates = sortCandidatesByVotes(list.candidates, areas[a], list.region);
                        /*var partyJoins = list.candidates[0].party_joins; // Only the candidate is considered, that has the most votes in the list.
                         var listParties = [];
                         for (var pj = 0; pj < partyJoins.length; pj++) {
                         listParties.push(extendedData.parties[iPa[partyJoins[pj].party_id]]);
                         }*/

                        var seatsDifferenceOfListParties = getSumOfSeatsDifferencesOfParties(list.parties, areas[a], rl.id);
                        if (seatsDifferenceOfListParties >= 1) { // So the parties of this list have together at least 1 seat too few (concerning their seats in all supervisory boards of a rankinglist).
                            //console.log('setListOfVoteDifferences(), list after "seatsDifferenceOfListParties >= 1": ', list);
                            //console.log('setListOfVoteDifferences(), list.name: ', list.name);
                            //console.log('setListOfVoteDifferences(), seatsDifferenceOfListParties: ', seatsDifferenceOfListParties);
                            var votesToGetASeat = list.votes[areas[a]];

                            var seatsOfAList = list.seats.regional.first + list.seats.international.first;
                            if (seatsOfAList > 0) {
                                votesToGetASeat = votesToGetASeat / (list.seats[areas[a]].first + 1);
                                // "+ 1": 
                                // So that the division can not be by 0 
                                // This is still possible when "$seatsOfAList > 0", because the code before "+ 1" only refers to 1 of 2 areas.
                                // So that when there is already a seat, the division does not begin with "1", which would not change the number of votes to get a seat ($votesToGetASeat).
                                // IS THIS PART OF C.1?
                                // No! If a party has already a seat in a SB, it can not have an additional seat there through correction of seat distribution.
                                // But this code makes possible: If this list/party has already a seat in this SB, it can get an other one under harder conditions than if it had not.
                                // Because it is not part of C.1: This should be OPTIONAL.
                            }

                            for (var l2 = 0; l2 < sb.lists.length; l2++) {
                                var list2 = sb.lists[l2];
                                if (list2.id === list.id) {
                                    continue;
                                }
                                var seatsDifferenceOfList2Parties = getSumOfSeatsDifferencesOfParties(list2.parties, areas[a], rl.id);
                                if (seatsDifferenceOfList2Parties <= -1) { // So the parties of this list2 have together at least 1 seat too much (concerning their seats in all supervisory boards of a rankinglist).
                                    //console.log('setListOfVoteDifferences(), list2 after "seatsDifferenceOfList2Parties <= -1": ', list2);
                                    //console.log('setListOfVoteDifferences(), list2.name: ', list2.name);
                                    //console.log('setListOfVoteDifferences(), seatsDifferenceOfList2Parties: ', seatsDifferenceOfList2Parties);
                                    var usedVotesOfMList = list2.votes[areas[a]];
                                    if (list2.seats[areas[a]].first > 1) {
                                        usedVotesOfMList = usedVotesOfMList / list2.seats[areas[a]].first;
                                    }

                                    var voteDifference = {};
                                    voteDifference.supervisoryBoard = sb;
                                    voteDifference.listTooFew = list;
                                    voteDifference.listTooMuch = list2;
                                    voteDifference.difference = (usedVotesOfMList - votesToGetASeat) * 100 / usedVotesOfMList;

                                    rl.listOfVoteDifferences[areas[a]].push(voteDifference);
                                    /*
                                     $listOfVoteDifferences[$this->areas[a]][$j]['supervisoryBoard'] = $sb;
                                     $listOfVoteDifferences[$this->areas[a]][$j]['tooFewSeats']['party'] = $listParty; //!! listParty nicht mehr verwendet
                                     $listOfVoteDifferences[$this->areas[a]][$j]['tooFewSeats']['listOfCandidates'] = $list;
                                     $listOfVoteDifferences[$this->areas[a]][$j]['tooMuchSeats']['party'] = $this->parties[$mParty]; 
                                     // instead of $this->parties[$mParty]:  $listPartyForTooMuch could be used with the same result
                                     $listOfVoteDifferences[$this->areas[a]][$j]['tooMuchSeats']['listOfCandidates'] = $listForTooMuch;
                                     $listOfVoteDifferences[$this->areas[a]][$j]['difference'] = ($usedVotesOfMParty - $votesToGetASeat) * 100 / $usedVotesOfMParty;
                                     */
                                }
                            }
                        }
                    }
                }
                sortListOfVoteDifferences(rl.listOfVoteDifferences, areas[a]);
            }
        }
    }

    function getSumOfSeatsDifferencesOfParties(parties, area, rlId) {
        var sum = 0;
        for (var p = 0; p < parties.length; p++) {
            sum += parties[p].seats[rlId][area].differenceCounter;
        }
        return sum;
    }

    function sortListOfVoteDifferences(list, area) {
        list[area].sort(function (valueA, valueB) {
            var a = valueA['difference'];
            var b = valueB['difference'];
            if (a === b) {
                return 0;
            }
            return (a > b) ? +1 : -1;
        });
    }

    /**
     * Sets the filtered list of vote differences
     *
     * @return void
     */
    function setFilteredListOfVoteDifferences() {
        transferFirstSeatsToCorrectedSeatsInLists();
        var rli = extendedData.ranking_list_international;
        for (var a = 0; a < areas.length; a++) {
            var rls = [];
            areas[a] == 'international' ? rls.push(rli) : rls = rli.regional_lists;
            for (var r = 0; r < rls.length; r++) {
                var rl = rls[r];
                var seatsToCorrect = {};
                seatsToCorrect[areas[a]] = rl.allConnectedSB[areas[a]].seatsToCorrect;

                var listVD = rl.listOfVoteDifferences;
                for (var vd = 0; vd < listVD[areas[a]].length; vd++) {
                    var voteDifference = listVD[areas[a]][vd];
                    if (seatsToCorrect[areas[a]] === 0) {
                        listVD[areas[a]] = listVD[areas[a]].slice(0, vd);
                        break;
                    }

                    //$partyWithTooFewSeats = $this->listOfVoteDifferences[$this->area[$i]][$j]['tooFewSeats']['party'];
                    //$partyWithTooMuchSeats = $this->listOfVoteDifferences[$this->area[$i]][$j]['tooMuchSeats']['party'];

                    //$seatsOfListWithTooMuchSeats = $this->listOfVoteDifferences[$this->area[$i]][$j]['tooMuchSeats']['listOfCandidates']->getSeats();
                    //if($seatsOfListWithTooMuchSeats[$this->area[$i]]['corrected'] < 1){
                    if (voteDifference.listTooMuch.seats[areas[a]].first === 0) {
                        //$this->listOfVoteDifferences[$this->area[$i]][$j]['filterStatus'] = 2;
                        voteDifference.filterStatus = 2;
                        // [[If list with partiesWithTooMuchSeats has NOT at least 1 seat in this SB FOR THIS AREA.]]
                        // (2) The LIST of the party with too MUCH seats has NOT at least 1 seat in this supervisory board for this area.
                        continue;
                    }

                    if (voteDifference.listTooMuch.seats[areas[a]].corrected === 0) {
                        //$this->listOfVoteDifferences[$this->area[$i]][$j]['filterStatus'] = 2;
                        voteDifference.filterStatus = 3;
                        // [[If list with partiesWithTooMuchSeats has NOT at least 1 seat in this SB FOR THIS AREA.]]
                        // (3) The LIST of the party with too MUCH seats has NOT ANY MORE at least 1 seat in this supervisory board for this area.
                        continue;
                    }

                    //$seatsOfPartyWithTooFewSeats = $partyWithTooFewSeats->getSeats();
                    //if($seatsOfPartyWithTooFewSeats[$this->area[$i]]['differenceCounter'] < 1){
                    var tooFewSeats = getSumOfSeatsDifferencesOfParties(voteDifference.listTooFew.parties, areas[a], rl.id);
                    if (tooFewSeats < 1) {
                        voteDifference.filterStatus = 4;
                        // [ If list with partiesWithTooFewSeats has NOT too few seats now; it already got additional seats. ]
                        // (4)The party with too FEW seats has NOT too few seats now; it already got additional seats.
                        continue;
                    }

                    //$seatsOfPartyWithTooMuchSeats = $partyWithTooMuchSeats->getSeats();
                    //if($seatsOfPartyWithTooMuchSeats[$this->area[$i]]['differenceCounter'] > -1){
                    var tooMuchSeats = getSumOfSeatsDifferencesOfParties(voteDifference.listTooMuch.parties, areas[a], rl.id);
                    if (tooMuchSeats > -1) {
                        voteDifference.filterStatus = 5;
                        // [ If list with partiesWithTooMuchSeats has NOT more seats than it should have any more; it has already given the seats that where too much. ]
                        // (5) The party with too MUCH seats has NOT more seats than it should have any more; it has already given the seats that where too much. 
                        continue;
                    }

                    //$seatsOfListWithTooFewSeats = $this->listOfVoteDifferences[$this->area[$i]][$j]['tooFewSeats']['listOfCandidates']->getSeats();

                    //var seatsOfListWithTooFewSeatsFirst;
                    var seatsOfListWithTooFewSeatsCorrected;
                    if (areas[a] === 'international') {
                        //$seatsOfListWithTooFewSeatsFirst = $seatsOfListWithTooFewSeats['regional']['first'] + $seatsOfListWithTooFewSeats['international']['first'];
                        //$seatsOfListWithTooFewSeatsCorrected = $seatsOfListWithTooFewSeats['regional']['corrected'] + $seatsOfListWithTooFewSeats['international']['corrected'];
                        seatsOfListWithTooFewSeatsCorrected = voteDifference.listTooFew.seats.regional.corrected + voteDifference.listTooFew.seats.international.corrected;
                    } else {
                        //console.log('setFilteredListOfVoteDifferences voteDifference', voteDifference);
                        //$seatsOfListWithTooFewSeatsFirst = $seatsOfListWithTooFewSeats[$this->area[$i]]['first'];
                        //$seatsOfListWithTooFewSeatsCorrected = $seatsOfListWithTooFewSeats[$this->area[$i]]['corrected'];
                        seatsOfListWithTooFewSeatsCorrected = voteDifference.listTooFew.seats[areas[a]].corrected;
                    }
                    //if($seatsOfListWithTooFewSeatsCorrected > $seatsOfListWithTooFewSeatsFirst){
                    if (seatsOfListWithTooFewSeatsCorrected === 1) {
                        voteDifference.filterStatus = 6;
                        // [ The list with partiesWithTooFewSeats already got a seat in this supervisory board through the vote-difference-procedure. ]
                        // (6) The LIST with parties with too FEW seats already got a seat in this supervisory board through the vote-difference-procedure.
                        continue;
                    }

                    voteDifference.filterStatus = 1;
                    rl.filteredListOfVoteDifferences[areas[a]].push(voteDifference);

                    seatsToCorrect[areas[a]] -= 1;
                    voteDifference.listTooMuch.seats[areas[a]].corrected -= 1; //MAYBE CHANGE: Different treatment of "corrected" in listOfCandidates and in parties.
                    voteDifference.listTooFew.seats[areas[a]].corrected += 1;

                    addChangedSeatToSB(voteDifference.listTooFew, areas[a]);

                    var listPartiesForMuch = voteDifference.listTooMuch.parties;
                    if (listPartiesForMuch.length === 1) {
                        extendedData.parties[iPa[listPartiesForMuch[0].id]].seats[rl.id][areas[a]].differenceCounter += 1;
                    } else {
                        changeDifferenceCounterOfListParties(voteDifference.listTooMuch, areas[a], 1);
                    }

                    var listPartiesForFew = voteDifference.listTooFew.parties;
                    if (listPartiesForFew.length === 1) {
                        extendedData.parties[iPa[listPartiesForFew[0].id]].seats[rl.id][areas[a]].differenceCounter -= 1;
                    } else {
                        changeDifferenceCounterOfListParties(voteDifference.listTooFew, areas[a], -1);
                    }
                    //$this->listOfVoteDifferences[$this->area[$i]][$j]['tooMuchSeats']['listOfCandidates']->setSeats(-1, $this->area[$i], 'corrected');
                    //$this->listOfVoteDifferences[$this->area[$i]][$j]['tooFewSeats']['listOfCandidates']->setSeats(1, $this->area[$i], 'corrected');
                    //$this->listOfVoteDifferences[$this->area[$i]][$j]['tooMuchSeats']['party']->setSeats(1, $this->area[$i], 'differenceCounter');
                    //$this->listOfVoteDifferences[$this->area[$i]][$j]['tooFewSeats']['party']->setSeats(-1, $this->area[$i], 'differenceCounter');

                }
            }
        }
    }

    /**
     * Transfers first seats to corrected seats in all lists of candidates.
     *
     * @return void
     */
    function transferFirstSeatsToCorrectedSeatsInLists() {
        for (var l = 0; l < extendedData.lists_of_candidates.length; l++) {
            var list = extendedData.lists_of_candidates[l];
            for (var a = 0; a < areas.length; a++) {
                list.seats[areas[a]].corrected = list.seats[areas[a]].first;
            }
        }
    }

    function addChangedSeatToSB(list, area) {
        var sb = extendedData.supervisory_boards[iSB[list.supervisory_board_id]];
        sb.seats[area].changed += 1;
    }

    function changeDifferenceCounterOfListParties(list, area, count) {
        if (count === -1) {

        }

        //partyJoinsForMuch...
        //- Bezug zu dem Kandidaten der area, der am wenigsten Stimmen bekommen hat von den Kandidaten, die durch diese Liste einen Sitz bekommen haben.
    }

    /**
     * Add vote differences to the supervisory boards of a rankinglist.
     * 
     * @returns {undefined}
     */
    function addVoteDifferencesToSBs() {
        var rli = extendedData.ranking_list_international;
        for (var a = 0; a < areas.length; a++) {
            var rls = [];
            areas[a] == 'international' ? rls.push(rli) : rls = rli.regional_lists;
            for (var r = 0; r < rls.length; r++) {
                var rl = rls[r];
                for (var vd = 0; vd < rl.filteredListOfVoteDifferences[areas[a]].length; vd++) {
                    var voteDifference = rl.filteredListOfVoteDifferences[areas[a]][vd];
                    var sb = extendedData.supervisory_boards[iSB[voteDifference.supervisoryBoard.id]];
                    sb.voteDifferences[areas[a]].push(voteDifference);
                }
            }
        }
    }

    function additionals() {
        addAreaSeatsToSBs();
    }

    function addAreaSeatsToSBs() {
        var sbs = extendedData.supervisory_boards;
        for (var i = 0; i < sbs.length; i++) {
            sbs[i].seats.regional.total = getRegionalSeats(sbs[i].seats.total);
            sbs[i].seats.international.total = getInternationalSeats(sbs[i].seats.total);
        }
    }

    function getRegionalSeats(seats) {
        return Math.floor(seats / 2);
    }

    function getInternationalSeats(seats) {
        return Math.ceil(seats / 2);
    }

    return {
        requires: [
            //MyApp.logic.MethodesOfSeatsDistribution
        ],
        setStartData: function (startD) {
            startData = startD;
        },
        getExtendedData: function () {
            return extendedData;
        },
        extendData: function () {
            //console.log('Rankinglist.js extendData startData', startData);
            //extendedData = Object.create(startData); // from ES5 (IE9+) on
            //javascript clone
            //  https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object#answer-3873968
            //__proto__

            extendedData = (JSON.parse(JSON.stringify(startData))); // create an Object independent from startData
            // Alternative, but not for IE: Object.assign()  (ES6 2015)

            createIndexes();
            beforeListCompare();
            tooManyOrTooLessSeats();
            setListOfVoteDifferences();
            setFilteredListOfVoteDifferences();
            addVoteDifferencesToSBs();

            additionals();
        }

    };


});