var context = new(window.AudioContext || window.webkitAudioContext)(); // create new Audio Context

var looper = null; // set initial valude of looper to "null"

function loadLooper(url) { // define function for loading looper

   var request = new XMLHttpRequest(); // define "request" variable

   request.open("GET", url, true); // initialize request with (method, url, async) 

   request.responseType = "arraybuffer"; // define response type of XMLHttpRequest as "audiobuffer"

   request.onload = function () { // define function to run when the requested file is loaded

      context.decodeAudioData(request.response, function (buffer) { // decode audio file data received from "request.reponse", sends to callback function

         looper = buffer; // set value of variable "looper" to the value of the newly decoded audio file
         
         console.log("sample loaded"); // log message to console when loading is complete
         
      })
   }

   request.send(); // send the request

}

function playLooper(buffer) { // define function for playing audio

   var source = context.createBufferSource(); // create a buffer source node inside of Audio Context and assign to variable "source"

   source.buffer = looper; // define what to play through variable "source"

   source.connect(context.destination); // connect variable "source" to system speakers

   source.start(0); // play the source now
}