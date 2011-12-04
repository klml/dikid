$(document).ready(function() {
    $('form.key_line button').hide('fast'); // TODO direct in css?
});

$(".depot").click(function() { // the last class from calling element will fetched from #depot TODO lastone is not defined 
    var lastclass = $(this).attr("class").split(" ").pop() ;
    var depot = $("#depot ." + lastclass).html();
    $(this).after(depot);
    $(this).toggle();
});
$(".newbunch").click(function() {
    preparesheet() ;
    initdate( $(this).attr("rel") ) ;
});
$(".followup").click(function() {
    var _id = $(this).parents('.sheet').attr('id') ;
    keycopy( _id ); 
    initdate( _id ) ; // TODO initdat wird erst kopiert und dann überschrieben ;(
    preparesheet() ;
});

$("form input").click(function() {
    //$(this).find('input').removeAttr('readonly');
    $(this).parents('form.key_line').find('button').show('fast');
    preparesheet() ;
});

$(".articledetailview span.hide").click(function() {
 $('.sheet').addClass('collapsed');
 $(this).parent().addClass('active') ;
});
$(".articledetailview span.show").click(function() {
 $('.sheet').removeClass('collapsed');
 $(this).parent().removeClass('active') ;
});
$(".sheet h1, .sheet h2, .sheet h3, .sheet h4, .sheet span.toggler").click(function() { // TODO h1 and more only at collapsed
 $(this).parent().toggleClass('collapsed') ;
});
$('.val2link b').click(function() {
 var val2link = $(this).parent() ;
 
 var elem = val2link.prev('input').val() ;
 elem = elem.split(",");  // this would be so nice with the couch-side JSON array, but i dont have it
  $(elem).each(function(index, parent) {
   var a = $("<a />", { href: parent, html: parent });
   $(val2link).find('em').before(a) ;
  });

 val2link.find('b, em').toggle();
 val2link.prev('input').hide();
});
$('.val2link em').click(function() {
 var val2link = $(this).parent() ;

 val2link.find('a').remove();
 val2link.find('b, em').toggle();
 val2link.prev('input').show();
});
$(".picknrun").click(function() { 
 var target = $(this).attr("rel") ;
 var value = $(this).attr("name") ;

 $(this).parent().find('input.' + target).val( value );
 submit( $(this).parent() ) ; 
});
function preparesheet() {
    $("form.newsheet textarea").keyup(function () {
        autofiller( $(this) );
    });
    $("form.newsheet input._id").change(function () {
        idcheck( $(this) ); 
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
    $('.x').click(function() {
        $(this).parents('.sheet, #headnew').find('.depot').toggle();
        $(this).parent().remove();
    });
    $('form').submit(function() {
        submit(this) ;
    });
}
function submit(form) {
    // json.org string
    var newrev = new Array();
    $(form).find('.string').each(function(){ // .serializeArray() will not work, dont need GET but JSON values   TODO trim;
      newrev.push( '"' + $(this).attr( 'name' ) + '" : "' + $(this).val() + '"');
      return newrev ;
    });

    // json.org array
    $(form).find('.array').each(function(){
        var value = $(this).val() ;
        if ( value == 0 ) { return newrev; } ; // TODO come on
        value = value.replace(/,/g, '","'); // eveliness? better JSON.parse() TODO
        newrev.push( '"' + $(this).attr( 'name' )  + '" : ["' + value + '"]');
        return newrev;
    });

    var _id = $(form).find('input._id').val();

    $.ajax({
        type: "PUT",
        url: "../../../../" + _id , //< TODO URL
        data: '{' + newrev + '}' ,
        success: function(msg){
            var msgJSON = eval('(' + msg + ')'); 
            $('#' + _id + " input[name='_rev']").val(msgJSON.rev); // new rev id for next safe
            $("form.key_line button").hide('slow'); // shows "untouched"
            if ( $('#' + _id + " input[name='state']").val() == 'archive' ) $('#' + _id ).remove() ;
            if ( msgJSON.rev[0] + msgJSON.rev[1] == '1-' ) location.reload();  // newsheet

            // TODO not logged in
        }
    });
  return false;
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
        dentline = lines[0]; //  TODO trim;
        $(textarea).parent().find('input[name="title"]').val(dentline);

        var autolemma = ""; // to define as string 
        dentlinewords = dentline.split(' '); 
        for (i=0 ; i<dentlinewords.length ; i++) {
            autolemma =  autolemma + dentlinewords[i][0] ;
        }

        $(textarea).parent().find('._id').val(ticketprefix + autolemma);   // TODO idcheck

        // dentline last word is the prio and punct(uation)) !!eins111elf!!!
        var einself = dentline.replace(/.*\s(.*)$/g, '$1' ); 

        var prio = einself.match(/\!/g) ; // count of ! is the prio
        if (prio) { 
                $(textarea).parent().find('input[name="prio"]').val(prio.length);
        };

        var punct = new Array( einself.match(/\?/) , einself.match(/fyi/i) , einself.match(/idee/i) ) ;  // TODO das muss auf glob puncts gehen
        $(textarea).parent().find('input[name="punct"]').val( punct.join("") );

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
    
    $('#' + _id + ' .newsheet input.parents' ).val( function(i, val)  { // TODO more parent
    if ( val != "" ) return _id + "," + val ;
    return _id ;
    }) ;

    
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
