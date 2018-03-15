export default {
  getSupervisoryBoards(state) {
    var sbs = showSBBasics(state);
    //return (state.msg).toUpperCase();
    return sbs;
  },
  getSupervisoryBoardById(state) {
		//console.log('getters getSupervisoryBoardById state: ', state);
		var sbs = state.extendedData.current_ranking_list.supervisory_boards;
		for(var i = 0; i < sbs.length; i++) {
			if(sbs[i].id == state.route.params.sb_id) {
				 return sbs[i];
			}
		}
    throw 'No SB found for the given id.';
  },
	getCurrentRankingList(state) {
		return state.extendedData.current_ranking_list;
	},
	getRegionOfRL(state) {
		return state.extendedData.current_ranking_list.region;
	},
  getMessage(state) {
    return (state.msg).toUpperCase()
  },
  getCounter(state) {
    return (state.counter)
  },
  getExtendedData(state) {
    return state.extendedData;
  }
}

function showSBBasics(state) {
	console.log('showSBBasics x100 ');
	console.log('state.msg: ', state.msg);
	console.log('state.extendedData: ', state.extendedData);
	console.log('showSBBasics x200 ');
    
	var counter = 0;
    /*while((state.extendedData.current_ranking_list === undefined) && (counter < 10)){
    //while(state.extendedData.current_ranking_list === undefined){
        var seconds = new Date().getTime() / 1000;
        console.log('showSBBasics seconds: ', seconds);
        setTimeout(function(){ var a = 1; }, 1000);
        counter++;
    }*/
    /*while((state.extendedData.current_ranking_list === undefined) && (counter < 10)){
    //while(state.extendedData.current_ranking_list === undefined){
        setTimeout(function(){ var seconds = new Date().getTime() / 1000; console.log('showSBBasics seconds: ', seconds);}, 1000);
        counter++;
    }
    console.log('showSBBasics counter: ', counter);*/
    //var seconds = new Date().getTime() / 1000; 
    //console.log('showSBBasics seconds: ', seconds);
//    setTimeout(function(){ 
//        var seconds = new Date().getTime() / 1000; console.log('showSBBasics seconds: ', seconds);
    
	var sbs = state.extendedData.current_ranking_list.supervisory_boards;
	var region = state.extendedData.current_ranking_list.region
	console.log('showSBBasics sbs: ', sbs);
	for(var i = 0; i < sbs.length; i++) {
		if (region == 'international') {
			sbs[i]["vue_seats"] = sbs[i].seats.international.total + ' of ' + sbs[i].seats.total;
			sbs[i]["vue_seats_changed"] = showSeatsChanged(sbs[i].seats.regional.changed, sbs[i].seats.international.changed, 'international');
			sbs[i]["vue_votes"] = sbs[i].votes.international;
		} else {
			sbs[i]["vue_seats"] = sbs[i].seats.regional.total + ' of ' + sbs[i].seats.total;
			sbs[i]["vue_seats_changed"] =  showSeatsChanged(sbs[i].seats.regional.changed, sbs[i].seats.international.changed, 'regional');
			sbs[i]["vue_votes"] = sbs[i].votes.regional;
		}
	}
	return sbs;
//    }, 1000);
}

function showSeatsChanged(regional, international, area) {
	var total = regional + international;
	var areaVotes = (area == 'regional') ? regional : international;
	var output = '';
	if(total == areaVotes){
		output = total;
	} else {
		output = areaVotes + ' of ' + total;
	}
	return output;
}