var socket= io();

var temp;
var light;
var humidity;
var stateSys = false;


var contentSize = 0;
var oldContent = "";
var currentContent = "";
var backgroundInterval;
var backgroundInterval2;
var modes = ["horizontal scanning","vertical scanning","in and out","snake","random block","blink all"];

socket.on('error', function (data) {
    console.log(data);
});
/*socket.on('insert', function (data) {
    console.log(data);

    $('<div style="display: none;" id="requests"class="row"><div class="large-3 columns">&nbsp;</div><div class="large-1 columns"><div class="panel ids">'+ data.ID +'</div></div><div class="large-5 columns"><div class="panel modes">'+ data.MODE +' : '+modes[data.MODE - 1] +'</div></div><div class="large-3 columns">&nbsp;</div></div>' ).appendTo($( ".content" )).slideDown( "slow", function() {
      if( $( "#requests" ).length == 1){

      
      clearInterval(backgroundInterval);
      backgroundInterval = setInterval(function(){
      $('.modes').first().toggleClass("blink");
      },1000);
      clearInterval(backgroundInterval2);
      backgroundInterval2 = setInterval(function(){
      $('.ids').first().toggleClass("blink");
      },1000);
    }
      });
    
  
});

socket.on('remove', function (data) {

  $('#requests').first().slideUp( "slow", function() {
      $('#requests').first().remove();
      clearInterval(backgroundInterval);
    backgroundInterval = setInterval(function(){
    $('.modes').first().toggleClass("blink");
    },1000);
    clearInterval(backgroundInterval2);
    backgroundInterval2 = setInterval(function(){
    $('.ids').first().toggleClass("blink");
    },1000);
});
});*/

socket.on('temp_update', function(data){
  console.log("new Temp:" + data);
  var temp = document.getElementById("temperature");
  temp.innerText = data;
  temp = data;
change();
});
socket.on('light_update', function(data){
  console.log("new Light:" + data);
  var temp = document.getElementById("light");
  temp.innerText = data;
  light = data;
  change()
});
socket.on('humidity_update', function(data){
  console.log("new Humid:" + data);
  humidity = data;
  change();
});
/*
function loadJSON()
{
   var jqxhr = $.getJSON('http://samantehrani.com/quilt/view/js/model.json', function(data) {
     currentContent = JSON.stringify(data);
     if( currentContent != oldContent ){
      console.log("here");
        socket.emit('newMessageReceived', data); 
        console.log(data.texts.length );
        oldContent= currentContent;
     }
    });
   jqxhr.always(function() {
   loadJSON();
  }); 
}
*/
$( document ).ready(function() {
    $('#gate').on('click',function  () {
        var button = document.getElementById("gate");          
      if( button.innerText == "Open Gate"){
      
      socket.emit('gate',true);
      button.innerText ="Close Gate";
    

    }else{
      
      socket.emit('gate',false);
      button.innerText = "Open Gate";
    
      
    }

    });

    $('#start').on('click',function(){
      
    var button = document.getElementById("start");          
    if( button.innerText == "Turn On"){
      stateSys = true;
      socket.emit('status',true);
      button.innerText ="Turn Off";
      var state = document.getElementById("systemState");          
      if ( state.innerText == "System is Truned Off!"){
        state.innerText = "Below The Treshhold!";
        state.style.background = "green";
      }

    }else{


       socket.emit('gate',false);
       var gate = document.getElementById("gate");          
      gate.innerText = "Open Gate";
    

      stateSys = false;
      socket.emit('status',false);
      button.innerText = "Turn On";
      var temp = document.getElementById("temperature");
      temp.innerText = "----";
      var light = document.getElementById("light");
      light.innerText = "----";
      var state = document.getElementById("systemState");          
      
        state.innerText = "System is Truned Off!";
        state.style.background = "white";
        var gate = document.getElementById("gate"); 
    gate.style.display = "none";
      
    }

    });

});

function setup() {
  var c = document.getElementById("holder");

  createCanvas(810, 200,'p2d',true);
  resizeCanvas(810, 200);
  stroke(0); 
  fill(51,55,69);
}

function draw() {
  background(246,247,146);
  rect(0,0,mouseX,height);
}

function change(){

  if( stateSys ){
    var llight = document.getElementById("light");
      var light = llight.innerText;
      var ltemp = document.getElementById("temperature");
      var temp = ltemp.innerText;

  if( light >20 && temp >20){
      
    var state = document.getElementById("systemState");            
    state.innerText = "Ready To Open Gates!";
    var gate = document.getElementById("gate"); 
    gate.style.display = "block";

  }else{

    var state = document.getElementById("systemState");            
    state.innerText = "Below The Treshhold!";
    var gate = document.getElementById("gate"); 
    gate.style.display = "none";
  }
}
}


