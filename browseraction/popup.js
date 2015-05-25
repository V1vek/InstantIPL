
var iplNotifications = iplNotifications || {}; 

$(document).ready(function(){

    if (localStorage["allballs"] != undefined) {
        iplNotifications= { 
            'allBalls': localStorage["allballs"], 
            'wickets': localStorage["wickets"], 
            'fours': localStorage["fours"], 
            'six': localStorage["six"]
        };

    $(':checked').prop('checked', false);

    if(iplNotifications.allBalls=='true')
        $('#allBalls').prop('checked', true);
    if(iplNotifications.wickets=='true')
        $('#wickets').prop('checked', true);
    if(iplNotifications.fours=='true')
        $('#four').prop('checked', true);
    if(iplNotifications.six=='true')
        $('#six').prop('checked', true);
    }
    else {
        localStorage["allballs"] = true;
    }


    $(':checkbox').change(function() {
        if($('#allBalls').is(':checked')) {
            $('#wickets').prop('checked', false);
            $('#four').prop('checked', false);
            $('#six').prop('checked', false);
        }

        iplNotifications= { 
            'allBalls': $('#allBalls').is(':checked'), 
            'wickets': $('#wickets').is(':checked'), 
            'fours': $('#four').is(':checked'), 
            'six': $('#six').is(':checked') 
        };

        localStorage["allballs"] = iplNotifications.allBalls;
        localStorage["wickets"] = iplNotifications.wickets;
        localStorage["fours"] = iplNotifications.fours;
        localStorage["six"] = iplNotifications.six;    
    });

});



