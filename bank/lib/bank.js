(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Bank = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function stuetzen (options) {
  var latten = []

  for (var k = 0; k < options.stuetzenzahl; k++) {
    for (var i = 0; i <= options.tiefe - 1; i++) {
      if (i % 2 != 0) {
        if (i == 1 || i == options.tiefe - 1 - options.tiefe % 2) {
          var drills = []
          if (isKielIndex(options, i+1)) {
            drills.push({ side: 'back', depth: 0.3, position: 1 })
          }
          if (isKielIndex(options, i-1)) {
            drills.push({ side: 'front', depth: 0.3, position: 1 })
          }
          latten.push({
            type: 'latte',
            group: 'stuetze',
            length: options.hoehe,
            rotation: [0, 0, 0],
            translation: [options.ueberstand + k * options.stuetzabstand, i, 0],
            drills: [
              { side: 'front', depth: 1, position: 2 },
              { side: 'front', depth: 1, position: options.hoehe - 1 }
            ].concat(drills)
          })
        } else {
          var drills = []
          if (isKielIndex(options, i+1)) {
            drills.push({ side: 'back', depth: 0.3, position: 0 })
          }
          if (isKielIndex(options, i-1)) {
            drills.push({ side: 'front', depth: 0.3, position: 0 })
          }
          latten.push({
            type: 'latte',
            group: 'stuetze',
            length: options.hoehe - 1,
            rotation: [0, 0, 0],
            translation: [options.ueberstand + k * options.stuetzabstand, i, 1],
            drills: [
              { side: 'front', depth: 1, position: 1 },
              { side: 'front', depth: 1, position: options.hoehe - 2 }
            ].concat(drills)
          })
        }
      }
    }
  }

  return latten
}

function sitz (options) {
  var latten = []
  var drills = []

  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'front', depth: 1, position: options.ueberstand + i*options.stuetzabstand })
  }

  for (var i = 0; i <= options.tiefe - 1; i++) {
    if (i % 2 == 0) {
      var vollsitzDrills = []

      if (options.vollsitz) {
        if (options.ueberstand) {
          if (i > 0) {
            vollsitzDrills.push({ side: 'front', depth: 0.3, position: 0 })
            vollsitzDrills.push({ side: 'front', depth: 0.3, position: options.ueberstand - 1 })
            vollsitzDrills.push({ side: 'front', depth: 0.3, position: options.breite - options.ueberstand })
            vollsitzDrills.push({ side: 'front', depth: 0.3, position: options.breite - 1 })
          }
          if (i < options.tiefe - 1) {
            vollsitzDrills.push({ side: 'back', depth: 0.3, position: 0 })
            vollsitzDrills.push({ side: 'back', depth: 0.3, position: options.ueberstand - 1 })
            vollsitzDrills.push({ side: 'back', depth: 0.3, position: options.breite - options.ueberstand })
            vollsitzDrills.push({ side: 'back', depth: 0.3, position: options.breite - 1 })
          }
        }
        // doing this quattro loop just to be order equal with scad
        if (i > 0) {
          for (var k = 0; k < options.stuetzenzahl; k++) {
            vollsitzDrills.push({ side: 'front', depth: 0.3, position: options.ueberstand + k*options.stuetzabstand + 1 })
          }
          for (var k = 0; k < options.stuetzenzahl; k++) {
            vollsitzDrills.push({ side: 'front', depth: 0.3, position: options.ueberstand + (k+1)*options.stuetzabstand - 1 })
          }
        }
        if (i < options.tiefe - 1) {
          for (var k = 0; k < options.stuetzenzahl; k++) {
            vollsitzDrills.push({ side: 'back', depth: 0.3, position: options.ueberstand + k*options.stuetzabstand + 1 })
          }
          for (var k = 0; k < options.stuetzenzahl; k++) {
            vollsitzDrills.push({ side: 'back', depth: 0.3, position: options.ueberstand + (k+1)*options.stuetzabstand - 1 })
          }
        }
      }

      latten.push({
        type: 'latte',
        group: 'sitz',
        length: options.breite,
        rotation: [0, 90, 0],
        translation: [0, i, options.hoehe - 1],
        drills: drills.concat(vollsitzDrills)
      })
    } else if (options.vollsitz) {
      if (options.ueberstand) {
        latten.push({
          type: 'latte',
          group: 'sitz',
          length: options.ueberstand,
          rotation: [0, 90, 0],
          translation: [0, i, options.hoehe - 1],
          drills: [
            { side: 'front', depth: 0.3, position: 0 },
            { side: 'back',  depth: 0.3, position: 0 },
            { side: 'front', depth: 0.3, position: options.ueberstand - 1 },
            { side: 'back',  depth: 0.3, position: options.ueberstand - 1 }
          ]
        })
        latten.push({
          type: 'latte',
          group: 'sitz',
          length: options.ueberstand,
          rotation: [0, 90, 0],
          translation: [options.breite - options.ueberstand, i, options.hoehe - 1],
          drills: [
            { side: 'front', depth: 0.3, position: 0 },
            { side: 'back',  depth: 0.3, position: 0 },
            { side: 'front', depth: 0.3, position: options.ueberstand - 1 },
            { side: 'back',  depth: 0.3, position: options.ueberstand - 1 }
          ]
        })
      }
      for (var k = 0; k < options.stuetzenzahl - 1; k++) {
        latten.push({
          type: 'latte',
          group: 'sitz',
          length: options.stuetzabstand - 1,
          rotation: [0, 90, 0],
          translation: [options.ueberstand + 1 + k*options.stuetzabstand, i, options.hoehe - 1],
          drills: [
            { side: 'front', depth: 0.3, position: 0 },
            { side: 'back',  depth: 0.3, position: 0 },
            { side: 'front', depth: 0.3, position: options.stuetzabstand - 2 },
            { side: 'back',  depth: 0.3, position: options.stuetzabstand - 2 }
          ]
        })
      }
    }
  }

  return latten
}

function fach (options) {
  var fachueberstand = options.ueberstand === 0 ? 0 : 1
  var length = options.breite - 2 * options.ueberstand + 2 * fachueberstand

  var latten = []
  var drills = []

  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'front', depth: 1, position: fachueberstand + i*options.stuetzabstand })
  }

  for (var i = 2; i <= options.tiefe - 2; i++) {
    if (i % 2 == 0) {
      if (isKielIndex(options, i)) {
        // latte über Kiel
        latten.push({
          type: 'latte',
          group: 'fach',
          length: length,
          rotation: [0, 90, 0],
          translation: [options.ueberstand - fachueberstand, i, 2],
          drills: [
            { side: 'bottom', depth: 0.3, position: fachueberstand + 1 },
            { side: 'bottom', depth: 0.3, position: length - fachueberstand - 2 }
          ].concat(drills)
        })
      } else {
        latten.push({
          type: 'latte',
          group: 'fach',
          length: length,
          rotation: [0, 90, 0],
          translation: [options.ueberstand - fachueberstand, i, 2],
          drills: drills
        })
      }
    }
  }

  return latten
}

function kiel (options) {
  var latten = []
  var drills = []

  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'front', depth: 0.3, position: i*options.stuetzabstand })
  }
  for (var i = 0; i < options.stuetzenzahl; i++) {
    drills.push({ side: 'back', depth: 0.3, position: i*options.stuetzabstand })
  }

  for (var i = options.kieloffset; i <= options.tiefe - options.kieloffset; i++) {
    if (isKielIndex(options, i)) {
      latten.push({
        type: 'latte',
        group: 'kiel',
        length: options.breite - 2 * options.ueberstand,
        rotation: [0, 90, 0],
        translation: [options.ueberstand, i, 1],
        drills: [
          { side: 'top', depth: 0.3, position: 1 },
          { side: 'top', depth: 0.3, position: options.breite - 2 * options.ueberstand - 2 }
        ].concat(drills)
      })
    }
  }

  return latten
}

function isKielIndex (options, i) {
  return i >= options.kieloffset && i % options.kielrepeat == 0 && i <= options.tiefe - options.kieloffset
}

module.exports = function bank (options) {
  options = options || {}
  options.breite = options.breite || 16
  options.hoehe = options.hoehe || 7
  options.tiefe = options.tiefe || 9
  options.ueberstand = 'ueberstand' in options ? options.ueberstand : 3
  options.stuetzenzahl = options.stuetzenzahl || 2
  options.vollsitz = 'vollsitz' in options ? options.vollsitz : false

  if (options.breite < 2) options.breite = 2
  if (options.hoehe < 4) options.hoehe = 4
  if (options.tiefe < 5) options.tiefe = 5
  if (options.tiefe % 2 === 0) options.tiefe++
  if (options.breite - 2*options.ueberstand < 2) options.ueberstand = Math.floor((options.breite - 2)/2)
  if (options.stuetzenzahl < 2) options.stuetzenzahl = 2
  if (options.stuetzenzahl > options.breite - 2*options.ueberstand) options.stuetzenzahl = options.breite - 2*options.ueberstand

  options.stuetzabstand = Math.floor((options.breite - 2*options.ueberstand - options.stuetzenzahl)/(options.stuetzenzahl - 1) + 1)
  options.breite = (options.stuetzenzahl - 1) * options.stuetzabstand + 1 + 2*options.ueberstand

  options.kieloffset = options.tiefe >= 9 ? 4 : 2
  options.kielrepeat = options.tiefe < 9 ? 2 : ((options.tiefe - 5) % 4 == 0 ? 4 : 2)

  return []
    .concat(stuetzen(options))
    .concat(sitz(options))
    .concat(fach(options))
    .concat(kiel(options))
}

},{}]},{},[1])(1)
});