/****
* In terminal, run:
*   $ node app.js     (to launch this node app)
*/

var express     = require('express');
var colors      = require('colors');
var http        = require('http');
var fs = require('fs');
var com = require('serialport');

var message = new Buffer('1');

var systemReady = false;
var clientConnected = false;
var handshakeState = 0;
var port = 9090;
var portHandler;
var requests= [];
var latestIDInQueue = -1 ;
var latestPerformedRequestID;
var latestInsertedRequestID;
var IDWaitingForInsertion = -1;
/*
*CONFIGURING THE SERIAL CONNECTION TO XBEE
*/

//if you want the raspberry pi 
//var serialPort = new com.SerialPort("/dev/ttyacm 0 or 1", {

var serialPort = new com.SerialPort("/dev/cu.usbmodem1411", {
    baudrate: 9600,
    parser: com.parsers.byteLength(5)
  },true,function(error){
    console.log(error);

  });

function openXbeePort(){
  console.log("a");
  serialPort.open(function(error){
  });
}

serialPort.on('open',function() {
  console.log('XBEE CONNECTED!!');
  systemReady = true;

});
serialPort.on('data', function(data) {
  var incomingBuffer= data.toString();

//  console.log(incomingBuffer);
  
  
  switch(incomingBuffer[0]) {
        case 'T':
            var insertedData = parseInt(incomingBuffer.slice(1,5));
            io.emit('temp_update',insertedData);    
            break;
        case 'H':
            var insertedData = parseInt(incomingBuffer.slice(1,5));
            io.emit('humidity_update',insertedData);    
            break;
        case 'L':
            var insertedData = parseInt(incomingBuffer.slice(1,5));
            io.emit('light_update',insertedData);    
            break;
        default:
            console.log('UNKNOWN MESSAGE FROM ARDUINO!');
            break;
  }
  

});
serialPort.on('close',function() {
  console.log('Port closed! Please restart the server!');
  systemReady = false;
});
/****
* CONFIGURE the express application
*/
var app = express();
app.use(express.static(__dirname+ '/public'));
/****
* START THE HTTP SERVER
*/
var server=http.createServer(app).listen(port, function(){
  console.log('  HTTP Express Server Running!  '.white.inverse);
  var listeningString = ' Magic happening on port: '+ port +"  ";
  console.log(listeningString.cyan.inverse);
});

var io = require('socket.io')(server);
io.on('connection', function(websocket){
  
  
  console.log("NEW WEB CLIENT CONNECTED".green);
  
  if( systemReady == false ){
  }else{
  

    websocket.on('status', function(data){
        if( data == true){
          serialPort.write(new Buffer('S'),function(){
      
            console.log("Start was sent!");
          });
        }else if ( data == false){
          serialPort.write(new Buffer('E'),function(){
      
            console.log("End was sent!");
          });
        }

         
      });
    websocket.on('gate', function(data){
        if( data == true){
          serialPort.write(new Buffer('O'),function(){
      
            console.log("Start was sent!");
          });
        }else if ( data == false){
          serialPort.write(new Buffer('C'),function(){
      
            console.log("End was sent!");
          });
        }

         
      });
  }
       
});
