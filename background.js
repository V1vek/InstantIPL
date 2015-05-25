var schedule = {
  match: [ 
    { 'id': 41, 'date': 15, 'month': 4, 'time': 20  },
    { 'id': 42, 'date': 18, 'month': 4, 'time': 16  },
    { 'id': 43, 'date': 18, 'month': 4, 'time': 20  },
    { 'id': 44, 'date': 19, 'month': 4, 'time': 16  },
    { 'id': 45, 'date': 19, 'month': 4, 'time': 20  },
    { 'id': 46, 'date': 20, 'month': 4, 'time': 16  },
    { 'id': 47, 'date': 20, 'month': 4, 'time': 20  },
    { 'id': 48, 'date': 21, 'month': 4, 'time': 20  },
    { 'id': 49, 'date': 22, 'month': 4, 'time': 16  },
    { 'id': 50, 'date': 22, 'month': 4, 'time': 20  },
    { 'id': 51, 'date': 23, 'month': 4, 'time': 16  },
    { 'id': 52, 'date': 23, 'month': 4, 'time': 20  },
    { 'id': 53, 'date': 24, 'month': 4, 'time': 16  },
    { 'id': 54, 'date': 24, 'month': 4, 'time': 20  },
    { 'id': 55, 'date': 25, 'month': 4, 'time': 16  },
    { 'id': 56, 'date': 25, 'month': 4, 'time': 20  },
    { 'id': 57, 'date': 27, 'month': 4, 'time': 20  },
    { 'id': 58, 'date': 28, 'month': 4, 'time': 20  },
    { 'id': 59, 'date': 30, 'month': 4, 'time': 20  },
    { 'id': 60, 'date': 1,  'month': 5, 'time': 20  }
  ]
};


var urlMain = 'http://dynamic.pulselive.com/dynamic/data/core/cricket/2012/ipl2014/ipl2014-';
var notificationSettings;


for(var i=0; i<schedule.match.length; i++) {
  var date = schedule.match[i].date;
  var month = schedule.match[i].month;
  var hours = schedule.match[i]["time"];
  var timeStamp = +new Date(2014, month, date, hours, 0, 0, 0);
  var strtTime1 = +new Date();
  var dt = new Date();
  dt = dt.getDate();
  if(timeStamp>strtTime1) {
    var chckBalls = 0;
    chrome.alarms.create('getInfo', {
      when: timeStamp,
      periodInMinutes: 0.20
    });
    var id = schedule.match[i]["id"];
    var schIndex = i;
    var url = urlMain + id + '/scoring.js';
    break;
  }
  
  if(timeStamp < strtTime1 && dt == date) {

    var nw = +new Date();
    var chckBalls = 0;
    chrome.alarms.create('getInfo', {
      when: nw,
      periodInMinutes: 0.26
    });
    var id = schedule.match[i]["id"];
    var schIndex = i;
    var url = urlMain + id + '/scoring.js';
    break;
  }
}

chrome.alarms.onAlarm.addListener(strt);

function strt() {  
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var r = xhr.responseText;
        r = r.substring(10,r.length-2);
        var rsp = JSON.parse(r);
        var ipl = rsp;

        if (localStorage["allballs"] != undefined) {
          notificationSettings= { 
            'allBalls': localStorage["allballs"], 
            'wickets': localStorage["wickets"], 
            'fours': localStorage["fours"], 
            'six': localStorage["six"]
          };
        }
        else {
          notificationSettings = {'allBalls': true};
        } 

        var strikeId = ipl.currentState.facingBatsman;
        var currMatch = ipl.matchInfo.teams["0"].team["abbreviation"] + " vs " + ipl.matchInfo.teams["1"].team["abbreviation"];
        var battingOrder1 = ipl.matchInfo.battingOrder[0];
        
        if(battingOrder1==undefined) {
          setTimeout(function(){}, 300000);
        }
        var battingOrder2 = ipl.matchInfo.battingOrder[1];
        var currInnings = ipl.currentState.currentInningsIndex;

        if(currInnings==0) {
          var teamId = ipl.matchInfo.teams[battingOrder1];
          var battingTeam = teamId.team["abbreviation"];
        }
        else {
          var teamId = ipl.matchInfo.teams[battingOrder2];
          var battingTeam = teamId.team["abbreviation"];
        }

        for(var i=0; i<11; i++) {
          var batId = teamId.players[i].id;
          if(batId==strikeId) {
            var strikeName = teamId.players[i].fullName;
            break;
          }
        }

        var currOvr = ipl.currentState.recentOvers;
        currOvr = (currOvr[currOvr["length"]-1]);
        var currBall = (currOvr.ovBalls["length"])-1;
        var ovr = "Overs: " + ipl.innings[currInnings].overProgress;
        var currRun = ipl.innings[currInnings].scorecard.runs;
        var currWkts = ipl.innings[currInnings].scorecard.wkts
  
        var currScore = "Runs: " + currRun + "/" + currWkts;
        var run = currOvr.ovBalls[currBall];

        var notRun = currScore + "\n" + ovr ;
        var bowlr="";

        var complOvr = ipl.innings[currInnings].overProgress;

        if(currInnings==1) {
          var target = ipl.innings["0"].scorecard.runs;
          if(target<currRun || currWkts==10 || complOvr==20) {
            chrome.alarms.clear("getInfo");
            schIndex = schIndex + 1;
            var date = schedule.match[schIndex].date;
            var month = schedule.match[schIndex].month;
            var hours = schedule.match[schIndex]["time"];
            var timeStamp = +new Date(2014, month, date, hours, 0, 0, 0);
            var id = schedule.match[schIndex]["id"];
            chrome.alarms.create('getInfo', {
              when: timeStamp,
              periodInMinutes: 0.26
            });
            var url = urlMain + id + '/scoring.js';
            setTimeout(function(){
              var cmnt = ipl.matchInfo.matchStatus["text"];
              var notification = window.webkitNotifications.createNotification(
                'http://i.imgur.com/a5EXmrs.png',
                currMatch,
                cmnt 
              );
              notification.show();
              setTimeout(function(){
                notification.cancel();
              }, 6000);
            }, 20000);
            return;
          }
        }

        if(run==4) {
          var notRun = currScore + "\n" + ovr + "\n" + strikeName + " scored FOUR!"
        }
        if(run==6) {
          var notRun = currScore + "\n" + ovr + "\n" + strikeName + " scored SIX!"
        }
        if(run=='W') {  
          var n = ipl.innings[currInnings].scorecard.battingStats.length;
          var fow = ipl.innings[currInnings].scorecard.fow;
          var wktId = ipl.innings[currInnings].scorecard.fow[fow.length-1].playerId;
            for(var i=0; i<n; i++) {
              var plId = ipl.innings[currInnings].scorecard.battingStats[i].playerId;
              if(wktId==plId) {
                bowlr = ipl.innings[currInnings].scorecard.battingStats[i].mod.text;
                break;
              }
          }
          var notRun = currScore + "\n" + ovr + "\n" + "OUT!" + "\n" + strikeName + " " + bowlr;
        }      

        if(chckBalls != ovr) {    
          var notification = window.webkitNotifications.createNotification(
            'http://i.imgur.com/a5EXmrs.png',
            currMatch,
            battingTeam + ": " + notRun 
          );
        if(notificationSettings.allBalls=='true')
          notification.show();
        if(notificationSettings.six=='true' && run==6) {
          notification.show();
        }
        if(notificationSettings.fours=='true' && run==4) {
          notification.show();  
        } 
        if(notificationSettings.wickets=='true' && run=='W') {
          notification.show();
        }
        chckBalls = ovr;

        setTimeout(function(){
          notification.cancel();
        }, 6000);
      }
    }
  }
  xhr.send();
}