(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Bett = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function stuetzen (options) {
  var latten = []

  for (var k = 0; k < options.stuetzenzahl; k++) {
    for (var i = 0; i <= options.tiefe - 1; i++) {
      if (i % 2 != 0) {
        if (k > 0 && (i < options.rahmendicke || i > options.tiefe - 1 - options.rahmendicke)) {
          latten.push({
            type: 'latte',
            group: 'stuetze',
            length: options.hoehe,
            rotation: [0, 0, 0],
            translation: [options.lehnstand + k * options.stuetzabstand, i, 0],
            drills: [
              { side: 'front', depth: 1, position: 2 },
              { side: 'front', depth: 1, position: options.hoehe - 1 }
            ]
          })
        } else {
          if (k == 0) {
            latten.push({
              type: 'latte',
              group: 'stuetze',
              length: options.hoehe - 1 + options.lehne,
              rotation: [0, options.lehnstand * -4, 0],
              translation: [options.lehnstand + k * options.stuetzabstand, i, 1],
              drills: [
                { side: 'front', depth: 1, position: 1 },
                { side: 'front', depth: 1, position: options.hoehe - 2 }
              ]
            })
          } else if (k == options.stuetzenzahl - 1) {
            latten.push({
              type: 'latte',
              group: 'stuetze',
              length: options.vornoffen ? options.hoehe - options.senkung - 1 : options.hoehe - 1,
              rotation: [0, 0, 0],
              translation: [options.lehnstand + k * options.stuetzabstand, i, 1],
              drills: [
                { side: 'front', depth: 1, position: 1 },
                { side: 'front', depth: 1, position: options.hoehe - 2 }
              ]
            })
          } else {
            latten.push({
              type: 'latte',
              group: 'stuetze',
              length: options.hoehe - options.senkung - 1,
              rotation: [0, 0, 0],
              translation: [options.lehnstand + k * options.stuetzabstand, i, 1],
              drills: [
                { side: 'front', depth: 1, position: 1 },
                { side: 'front', depth: 1, position: options.hoehe - 2 }
              ]
            })
          }
        }
      }
    }
  }

  return latten
}

function rahmen (options) {
  var latten = []
  var drills = []

  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'front', depth: 1, position: options.lehnstand + i*options.stuetzabstand })
  }

  for (var i = 0; i <= options.tiefe - 1; i++) {
    if (i < options.rahmendicke || i > options.tiefe - options.rahmendicke - 1) {
      if (i % 2 == 0) {
        latten.push({
          type: 'latte',
          group: 'rost',
          length: options.breite,
          rotation: [0, 90, 0],
          translation: [0, i, options.hoehe - 1],
          drills: drills
        })
      } else {
        latten.push({
          type: 'latte',
          group: 'rost',
          length: options.breite - options.ueberstand - 2,
          rotation: [0, 90, 0],
          translation: [options.lehnstand + 1, i, options.hoehe - 1],
          drills: []
        })
      }
    }
  }

  return latten
}

function fassung (options) {
  var latten = []
  var drills = []

  for (var i = 0; i < options.senkung; i++) {
    latten.push({
      type: 'latte',
      group: 'rost',
      length: options.breite,
      rotation: [0, 90, 0],
      translation: [0, options.rahmendicke - 1, options.hoehe - 1 - i],
      drills: drills
    })
    latten.push({
      type: 'latte',
      group: 'rost',
      length: options.breite,
      rotation: [0, 90, 0],
      translation: [0, options.tiefe - options.rahmendicke, options.hoehe - 1 - i],
      drills: drills
    })
  }

  return latten
}

function rost (options) {
  var latten = []
  var drills = []

  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'front', depth: 1, position: options.lehnstand + i*options.stuetzabstand })
  }

  for (var i = options.rahmendicke - 1; i <= options.tiefe - options.rahmendicke; i++) {
    if (i % 2 == 0) {
      latten.push({
        type: 'latte',
        group: 'rost',
        length: options.breite,
        rotation: [0, 90, 0],
        translation: [0, i, options.hoehe - options.senkung - 1],
        drills: drills
      })
    }
  }

  return latten
}

function fach (options) {
  var fachueberstand = options.ueberstand === 0 ? 0 : 1
  var length = options.breite - options.ueberstand + 2 * fachueberstand

  var latten = []
  var drills = []

  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'front', depth: 1, position: fachueberstand + i*options.stuetzabstand })
  }

  for (var i = 2; i <= options.tiefe - 2; i++) {
    if (i % 2 == 0) {
      latten.push({
        type: 'latte',
        group: 'fach',
        length: length,
        rotation: [0, 90, 0],
        translation: [options.lehnstand - fachueberstand, i, 2],
        drills: drills
      })
    }
  }

  return latten
}

module.exports = function bett (options) {
  options = options || {}
  options.breite = options.breite || 37
  options.hoehe = options.hoehe || 12
  options.tiefe = options.tiefe || 37
  options.vorstand = 'vorstand' in options ? options.vorstand : 1
  options.lehnstand = 'lehnstand' in options ? options.lehnstand : 1
  options.stuetzenzahl = options.stuetzenzahl || 2
  options.rahmendicke = options.rahmendicke || 3
  options.vornoffen = 'vornoffen' in options ?  options.vornoffen : false
  options.senkung = 'senkung' in options ? options.senkung : 3
  options.lehne = 'lehne' in options ? options.lehne : 9

  if (options.breite < 2) options.breite = 2
  if (options.hoehe < 7) options.hoehe = 7
  if (options.tiefe < 5) options.tiefe = 5
  if (options.tiefe % 2 === 0) options.tiefe++
  
  options.ueberstand = options.vorstand + options.lehnstand

  if (options.breite - options.ueberstand < 2) options.vorstand = options.lehnstand = Math.floor((options.breite - 2)/2)
  if (options.stuetzenzahl < 2) options.stuetzenzahl = 2
  if (options.stuetzenzahl > options.breite - options.ueberstand) options.stuetzenzahl = options.breite - options.ueberstand
  if (options.rahmendicke % 2 === 0) options.rahmendicke++

  options.stuetzabstand = Math.floor((options.breite - options.ueberstand - options.stuetzenzahl)/(options.stuetzenzahl - 1) + 1)
  options.breite = (options.stuetzenzahl - 1) * options.stuetzabstand + 1 + options.ueberstand

  return []
    .concat(stuetzen(options))
    .concat(rahmen(options))
    .concat(fassung(options))
    .concat(rost(options))
    .concat(fach(options))
}

},{}]},{},[1])(1)
});