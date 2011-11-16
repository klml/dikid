$(document).ready(function() {
});
$("form").click(function() {
    $(this).find('input').removeAttr('readonly');
    preparesheet() ;
});
$(".depot").click(function() { // the last class from calling element will fetched from #depot
    var lastclass = $(this).attr("class").split(" ").pop() ;
    var depot = $("#depot ." + lastclass).html();
    $(this).replaceWith(depot);
    
});
$(".followup").click(function() { // TODO together with $(".depot").click ?
    keycopy( $(this).attr("rel") ); // TODO this and parnets
    initdate( $(this).attr("rel") ) ; // TODO initdat wird ert coy udn dann gesetzt ;(
    preparesheet() ;
});
$(".new").click(function() {
    initdate( $(this).attr("rel") ) ;
    preparesheet() ;
});
$(".picknplace").click(function() { // the last class from calling element will fetched from #depot
    alert(  );

$(this).closest('input ').val( $(this).html() );

//~ <span class=".picknplace" rel="state ">archive</span> selectable
});
$(".articledetailview span.buncher").click(function() {
$( '.sheet .bunch' ).toggle();
 $(this).toggleClass("active") ;
});
$(".sheet .toggler").click(function() {
  $(this).parent().find('.bunch').toggle();
});


function preparesheet() {
    $("form.newsheet textarea").keyup(function () {
        autofiller( $(this) );
    });
    $("form.newsheet input._id").change(function () {
        idcheck( $(this) ); 
    });
    $(".sheet > .key_line input").change(function () {
        safesheet( $(this) ); // TODO höher 
    });
    $("button.submit").click(function() {
        //~ idcheck( $(this) ); TODO
        safesheet( $(this) );
    });

    $(".datepicker").datepicker({
        defaultDate: +7,
        dateFormat: 'yy-mm-dd',
        numberOfMonths: 2,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        weekHeader: 'W',
        firstDay: 1,
        currentText: '  Heute',
        showButtonPanel: true 
    });
    
    $('input[name="prio"]').autocomplete(prios, {
        matchContains: true,
        minChars: 0,
        max: 40,
        scrollHeight: 280,
    });
    $('ul.selectable.puncts').append('<li>' + puncts.join("</li><li>") + '</li>');
    
    $("ul.selectable.puncts").selectable( {
    selected: function(event, ui) { 
        $('form.key_line input[name="punct"]').val($("ul.selectable.puncts .ui-selected").text() ) ;
        }
    });
    $('input.state').autocomplete(states, {
        matchContains: true,
        minChars: 0, //< combobox
        max: 40,
        scrollHeight: 280,
    }); 
    $('input[name="queues"]').autocomplete(queues, {
        matchContains: true,
        minChars: 0,
        max: 40,
        scrollHeight: 280,
    }); 
    $('input[name="users"]').autocomplete(users, {
        matchContains: true,
        minChars: 0,
        max: 40,
        scrollHeight: 280,
    });
    $('textarea').focus(); // TODO
}

function safesheet(safeid) {

        var newrev = new Array();
        // json.org string
        $(safeid).parent().find('.string').each(function(){ // TODO .serializeArray() trim;
          newrev.push( '"' + $(this).attr( 'name' ) + '" : "' + $(this).val() + '"');
          return newrev;
        });
       
        // json.org array
        $(safeid).parent().find('.array').each(function(){
            var value = $(this).val() ;
            if ( value == 0 ) { return newrev; } ; // TODO come on
            value = value.replace(/,/g, '","'); // eveliness? bttter JSON.parse() TODO
            newrev.push( '"' + $(this).attr( 'name' )  + '" : ["' + value + '"]');
            return newrev;
        });

        var _id = $(safeid).parent().find('._id').val()
        $.ajax({
            type: "PUT",
            url: "../../../../" + _id , //< TODO URL
            data: '{' + newrev + '}' ,
            success: function(msg){
                var msgJSON = eval('(' + msg + ')'); 
                $('#' + _id + " input[name='_rev']").val(msgJSON.rev); // new rev id for next safe
                $("input").attr('readonly','readonly');
                $("form.keyline .submit").hide('slow'); // shows "untouched"
                if ( $(safeid).parent().attr("class") == "newsheet") location.reload(); 
                // TODO if not logged in
            }
        });

}

function idcheck(checkfield) {
    var checkid = $(checkfield).val();

    // longer than x
    if (checkid.length < minlengthid ) {  // if autolemma to short trigger size to
            expandedid = checkid + expandload ;
            $(checkfield).val(expandedid);
            // more like Vokalfreie mstrkrft Vowel-Dropping 
        }
    // existing 
    var quotecid = '"' + checkid + '"' ; // TODO
    $.ajax({
        url: '/' + database + '/_all_docs',
        dataType: 'json',
        data: {'key': quotecid },
        success: function(msg){
            if ( msg.rows != "" ) {
                $(checkfield).val( checkid + "1" ); // expand TODO define expand
            }
        }
    });
};

function autofiller(textarea) {
    var prose = $(textarea).val();

    lines = prose.split('\n');

    if (lines[1] ) { // ($(textarea).blur()) in function
        dentline = lines[0];
        $(textarea).parent().find('input[name="title"]').val(dentline);

        var autolemma = ""; // to define as string 
        dentlinewords = dentline.split(' '); 
        for (i=0 ; i<dentlinewords.length ; i++) {
            autolemma =  autolemma + dentlinewords[i][0] ;
        }

        $(textarea).parent().find('._id').val(ticketprefix + autolemma);

        // dentline last word is the prio and punct(uation)) !!eins111elf!!!
        var einself = dentline.replace(/.*\s(.*)$/g, '$1' ); 

        var prio = einself.match(/\!/g) ; // count of ! is the prio
        var priolength = "" ;
        if (prio) { priolength = prio.length };
        $(textarea).parent().find('input[name="prio"]').val(priolength);

        var punct = new Array( einself.match(/\?/) , einself.match(/fyi/i) , einself.match(/idee/i) ) ;  // TODO das muss auf glob puncts gehen
        var puncts = punct.join("") ;
        $(textarea).parent().find('input[name="punct"]').val(puncts);

        user = prose.match(/@.*?\s/g) ; // TODO remove @ TODo dont use witout leading space
        if (user) var users = user.join(",") ;
        //~ var users = prose.replace(/\@([\w\-]+)/g); // would be better  TODO
        $(textarea).parent().find('input[name="users"]').val(users);

   }
};

function keycopy(_id) { // TODO _id raus und this  parent() closest() und find() ?
    $('#' + _id + ' .newsheet input').each(function(){
      $(this).val( $('#' + _id + ' .key_line input[name=' + $(this).attr("name") + ']').val() ); // TDOD evtl doch per class und nicht per name?
    });

    // append for value? TODO
    var parents = $('#' + _id + ' .newsheet input[name=parents]' ).val();
    parents = parents.split(",");
    var parents = $.merge([_id], parents);
    var parents = parents.join(",");
    $('#' + _id + ' .newsheet input[name=parents]' ).val(parents);
    
    
    
    
};  


function initdate(_id) {
    $('#' + _id + ' .newsheet input[name=initdate]' ).val( new Date().getTime() );
};  



//~  nr2prio(value)"  TODO


// global stuff for dikid
// TODO use as JSON like couchapp.json or editable as wikipage
var date = new Date();
var database = "dikid";
var ticketprefix = "";   // something like "ticket", "bug_" 
var startsafetime = "9";
var minlengthid = "4";
var expandload = date. getFullYear() ; // year, month, second, random, counter, whatever
var expandload = Math.round( Math.random() * 10 ) ;

// TODO all below must be one JSON
keys = new Array (
"type" ,
"_id" ,
"prio" ,
"state",
"punct",
"queue",
"user" ,
"ddate"
)



types  = new Array ( "wiki", "ticket", "adr", "ressource");
prios  = new Array ( "Alerta", "hour", "day", "week", "kuer");
states = new Array ( "new", "progress", "response", "test", "onhold", "archive");
puncts = new Array ( "!", "?", "idea", "fyi");
users  = new Array ( "klml", "mike", "sulu", "gwen", "phl0w", "horst", "min", "pater", "kay", "hans-peter");
queues = new Array (
  "os.WickeT",
  "design.gwen",
  "dev.notzp",
  "klml.Home",
  "klml.konzum"
);  
