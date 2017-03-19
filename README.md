# Combo-Generator

[![Join the chat at https://gitter.im/combo-gen/Lobby](https://badges.gitter.im/combo-gen/Lobby.svg)](https://gitter.im/combo-gen/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This program is a combo generator for scratch djs.
## What Will This Thing Do?
At its lowest level, users will be able to select from a list of scratches which ones they know. Upon submission, the program will auto-generate a combination of these scratches into a loopable output. The combination will be displayed on screen for the user to see as well. The generated "sentence" should never be longer than the loop length if loop length is used.
## Proposed Build Plan
The plan is to build this using primarily [the Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for all the audio features and [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for visualizations. The rest will be simple HTML, CSS and Javascript.
I have never used the web Audio API or HTML5 Canvas API so the build will most likely be slow as I learn-as-I-go. My Javascript is sketchy at best and I don't know ES6 so expect clunky, unoptimized code.
## Proposed Features
Listed in no particular order. Features will most likely be added/removed based on my abilities and the amount of community support I get.
- [ ] Upload Libraries
- [ ] Support multiple libraries
- [ ] Selectable length (bars?)
- [ ] Selectable known patterns
- [ ] Optional background looper
- [ ] Tempo adjustments
  * Adjust BPM
  * Quantize shift
  * Double-time/Half-time
  * Independant of looper but maybe connected?
- [ ] Record user audio
- [ ] Metronome
