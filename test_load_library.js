var libDir = "dist/libs/scratches/", // define path for scratch sample libraries
   libSelect = document.getElementById("library"), // define select element for choosing scratch sameple library
   libFolder, // create variable to be used for storing current scratch sample library path
   totalSamples = 3; // total samples in library *{MAY NEED TO REVISIT IF THIS IS BEST WAY TO ACHIEVE THIS}*

var urlList = []; // create empty array for scratch sample filenames

var loopDir = "dist/libs/loopers/", // define path for looper files
   loopYes = document.getElementById("looper_yes"), //define radio button for includeing looper
   loopNo = document.getElementById("looper_no"), //define radio button for not including looper
   loopSelect = document.getElementById("looper"), // define select element for choosing looper
   selectedLoop; // create variable to hold value of looper file


// Update value of library folder based on value of selected option
// - - - - - - - - - - - - - - - - - - - -
libSelect.addEventListener("change", function () { // listen for change to value of selected options
   console.log(libSelect.value) // debug
   libFolder = libSelect.value; // make value of "libFolder" equal to value of current selected option

   urlList.length = 0; // Clear existing urlList

   if (libFolder === "undefined") { // test to make sure library exists
      console.log("there is no folder associated with this library") // debug
   } else {
      for (var i = 1; i <= totalSamples; i++) { // for every scratch sample
         urlList.push(libDir + libFolder + "/0" + i + ".mp3"); // Update file names and add to "urlList" array
      }
   }
   // Button States
   if (libSelect.value != "0") { // if the value of "libSelect" is "0"
      loadButton.removeAttribute("disabled"); // remove attribute "disabled" from load button
      playButton.removeAttribute("disabled"); // remove attribute "disabled" from play button
   } else { // if the value of "libSelect" is anything besides "0"
      loadButton.setAttribute("disabled", ""); // add attribute "disabled" from load button
      playButton.setAttribute("disabled", ""); // add attribute "disabled" from play button
   }
}, false);


// Include looper in playback
// - - - - - - - - - - - - - - - - - - - -
loopSelect.addEventListener("change", function () { // listen for change to value of selected options
   if (document.getElementById("looper_yes").checked === true) { // if value is "yes"
      selectedLoop = loopDir + loopSelect.value; // make value of "selectedLoop" equal to value of selected option
      console.log(selectedLoop); // debug
   } else {
      //      console.log("You have selected not to play a looper"); // debug
   }
}, false);

var playButton = document.getElementById("play"), // define play button element
   loadButton = document.getElementById("load"), // define load button element
   resetButton = document.getElementById("reset"); // define reset button element


// Event Handlers
// - - - - - - - - - - - - - - - - - - - -
loadButton.addEventListener("click", function () {
   audioCtx(); // create new Audio Context
   bufferArray.length = 0;
   bufferLoader.load(); // load selected samples
   if (loopYes.checked) {
      loadLooper(); // load selected looper
   }
}, false);
playButton.addEventListener("click", function () {
   if ((context.state === "running") && (playButton.getAttribute("playback") === "paused")) {
      if (playButton.getAttribute("loop_type") === "fresh") {
         shuffle(bufferArray);
      }
      playSamples(); // play selected samples
      playLooper(); // play selected looper
      playButton.innerHTML = "Pause Loop";
      playButton.setAttribute("playback", "active");
   } else if ((context.state === "running") && (playButton.getAttribute("playback") === "active")) {
      context.suspend();
      playButton.setAttribute("playback", "paused");
      playButton.innerHTML = "Play Loop"
   } else if (context.state === "suspended") {
      context.resume();
      playButton.innerHTML = "Pause Loop";
      playButton.setAttribute("playback", "active");
   }
}, false);
resetButton.addEventListener("click", function () {
   context.close();
   playButton.setAttribute("loop_type", "stale");
   audioCtx();
   bufferArray.length = 0;
   bufferLoader.load(); // load selected samples
   if (loopYes.checked) {
      loadLooper(); // load selected looper
   }
   playButton.innerHTML = "Play Loop";
   playButton.setAttribute("playback", "paused");
}, false);

// control input states
loopYes.addEventListener("change", function () {
   if (loopYes.checked == true) { // if "looper_yes" is checked
      loopSelect.removeAttribute("disabled"); // remove "disabled" attirbute from looper select
   }
}, false);
loopNo.addEventListener("change", function () {
   if (loopNo.checked == true) { // if "looper_no" is checked
      loopSelect.setAttribute("disabled", ""); // add "disabled" attribute to looper select
   }
}, false);


// Set up Audio Context
// - - - - - - - - - - - - - - - - - - - -
var context, // set variable for Audio Context
   bufferLoader, // set variable for buffer loader function
   bufferArray = [], // set empty array for audio buffers
   loopBuffer; // set variable for looper buffer

function audioCtx() { // define function for creating new Audio Context
   context = new(window.AudioContext || window.webkitAudioContext)(), // clean up for prefixed versions
      bufferLoader = new BufferLoader(context, urlList, loadSampleLibrary); // create new Audio Context using "context" variable, the URLs of the selected samples then load buffers.
   looperLoader = new BufferLoader(context, selectedLoop, loadLooper);
}

function loadLooper() {
   loopBuffer = context.createBufferSource();
   var request = new XMLHttpRequest();
   request.open('GET', selectedLoop, true);
   request.responseType = 'arraybuffer';

   request.onload = function () {
      var audioData = request.response;

      context.decodeAudioData(audioData, function (buffer) {
            loopBuffer.buffer = buffer;

            loopBuffer.connect(context.destination);
            loopBuffer.loop = true;
         },

         function (e) {
            console.log("Error with decoding audio data" + e.err);
         });
   }
   request.send();
   console.log(loopBuffer); // debug
}

function loadSampleLibrary(bufferList) {
   //   bufferArray.length = 0; // empty bufferArray to ensure samples are not used twice *{NEED TO FIND A WAY TO DUPLICATE SAMPLES}*
   console.log(bufferList); // debug
   console.log("starting buffer list is " + bufferList.length + " in length"); //debug
   // for each sample in the bufferList array
   bufferList.forEach(function (sampleBuffer) {
      console.log(sampleBuffer); //debug
      var source = sampleBuffer; // set value of "source" to value of "sampleBuffer"
      source = context.createBufferSource(); // create new buffer source from value of "source"
      source.buffer = sampleBuffer; // set value of "buffer" for buffer source to value of "sampleBuffer"
      source.connect(context.destination); // connect buffer to system speakers
      bufferArray.push(source); // add "source" to bufferArray
      console.log(source + " has been connected"); // debug
      //      source.start(); // debug
   });

}


// Play Samples
// - - - - - - - - - - - - - - - - - - - -
function playSamples() {
   //   shuffle(bufferArray);
   console.log(bufferArray); // debug


   // This works *{NEED TO REWRITE SO IT AUTOMATICALLY CYCLES THROUGH ENTIRE ARRAY}*
   bufferArray[0].start();
   bufferArray[0].onended = function () {
      bufferArray[1].start();
   }
   bufferArray[1].onended = function () {
      bufferArray[2].start();
   }
}

// Shuffle samples using Fisher-Yates shuffle algorithm
function shuffle(array) {
   var currentIndex = array.length,
      temporaryValue,
      randomIndex;

   // While there remain elements to shuffle...
   while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
   }

   return array;
}

function playLooper() {
   if (loopYes.checked) {
      loopBuffer.start();
   }
}


// - - - - - - - - - - - - - - - - - - - -
// BufferLoader.js (https://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js)
// - - - - - - - - - - - - - - - - - - - -

function BufferLoader(context, urlList, callback) {
   this.context = context;
   this.urlList = urlList;
   this.onload = callback;
   this.bufferList = new Array();
   this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
   // Load buffer asynchronously
   var request = new XMLHttpRequest();
   request.open("GET", url, true);
   request.responseType = "arraybuffer";

   var loader = this;

   request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(request.response, function (buffer) {
            if (!buffer) {
               alert('error decoding file data: ' + url);
               return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length)
               loader.onload(loader.bufferList);
         },
         function (error) {
            console.error('decodeAudioData error', error);
         }
      );
   }

   request.onerror = function () {
      alert('BufferLoader: XHR error');
   }

   request.send();
}

BufferLoader.prototype.load = function () {
   for (var i = 0; i < this.urlList.length; ++i) {
      this.loadBuffer(this.urlList[i], i);
      var sample = urlList[i];
      console.log(sample); // Debug
   }
}