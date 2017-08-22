export default {
  getSupervisoryBoards(state) {
    var sbs = showSBBasics(state);
    //return (state.msg).toUpperCase();
    return sbs;
  },
  getMessage(state) {
    return (state.msg).toUpperCase()
  },
  getCounter(state) {
    return (state.counter)
  }
}

function showSBBasics(state) {
    console.log('showSBBasics x100 ');
    console.log('state.msg: ', state.msg);
    console.log('state.extendedData: ', state.extendedData);
    console.log('showSBBasics x200 ');
    
    var counter = 0;
    /*while((state.extendedData.ranking_list_international === undefined) && (counter < 10)){
    //while(state.extendedData.ranking_list_international === undefined){
        var seconds = new Date().getTime() / 1000;
        console.log('showSBBasics seconds: ', seconds);
        setTimeout(function(){ var a = 1; }, 1000);
        counter++;
    }*/
    /*while((state.extendedData.ranking_list_international === undefined) && (counter < 10)){
    //while(state.extendedData.ranking_list_international === undefined){
        setTimeout(function(){ var seconds = new Date().getTime() / 1000; console.log('showSBBasics seconds: ', seconds);}, 1000);
        counter++;
    }
    console.log('showSBBasics counter: ', counter);*/
    //var seconds = new Date().getTime() / 1000; 
    //console.log('showSBBasics seconds: ', seconds);
//    setTimeout(function(){ 
//        var seconds = new Date().getTime() / 1000; console.log('showSBBasics seconds: ', seconds);
    
        var sbs = state.extendedData.ranking_list_international.supervisory_boards;
        console.log('showSBBasics sbs: ', sbs);
        for(var i = 0; i < sbs.length; i++) {
            sbs[i]["vue_seats"] = sbs[i].seats.total;
            sbs[i]["vue_seats_area"] = sbs[i].seats.international.total;
            sbs[i]["vue_seats_changed"] = sbs[i].seats.international.changed;
            sbs[i]["vue_votes"] = sbs[i].votes.international;
        }
        return sbs;
//    }, 1000);
}