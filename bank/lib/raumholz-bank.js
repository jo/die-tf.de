(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RaumholzBank = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function waende (options) {
  var latten = []

  for (var k = 0; k < options.zwischenwaende + 2; k++) {
    for (var i = 0; i <= options.tiefe - 1; i++) {
      var drills = []
      if (i % 2 != 0) {
        if (i == 1 || i == options.tiefe - 1 - options.tiefe % 2) {
          // aussen
          if (isKielIndex(options, i+1)) {
            drills.push({ side: 'back', depth: 0.3, position: 1 })
          }
          if (isKielIndex(options, i-1)) {
            drills.push({ side: 'front', depth: 0.3, position: 1 })
          }
          latten.push({
            type: 'latte',
            group: 'wand',
            length: options.hoehe,
            rotation: [0, 0, 0],
            translation: [options.traufeLinks + k * options.zwischenwandAbstand, i, 0],
            drills: [
              { side: 'front', depth: 1, position: 2 },
              { side: 'front', depth: 1, position: options.hoehe - 1 }
            ].concat(drills)
          })
        } else {
          // innen
          if (isKielIndex(options, i+1)) {
            drills.push({ side: 'back', depth: 0.3, position: 0 })
          }
          if (isKielIndex(options, i-1)) {
            drills.push({ side: 'front', depth: 0.3, position: 0 })
          }
          latten.push({
            type: 'latte',
            group: 'wand',
            length: options.hoehe - options.bodenHoehe + options.bodenUeberhang + (options.bodenKiel ? 1 : 0),
            rotation: [0, 0, 0],
            translation: [options.traufeLinks + k * options.zwischenwandAbstand, i, options.bodenHoehe - options.bodenUeberhang - (options.bodenKiel ? 1 : 0)],
            drills: [
              { side: 'front', depth: 1, position: 1 },
              { side: 'front', depth: 1, position: options.hoehe - 2 }
            ].concat(drills)
          })
        }
      } else if (options.wandGeschlossen && ((!options.bodenInnenliegend && !options.deckeInnenliegend) || i > 1 && i < options.tiefe - 2)) {
        // Füllung
        for (var j = 0; j < options.zwischenboeden + 1; j++) {
          latten.push({
            type: 'latte',
            group: 'wand',
            length: options.zwischenbodenAbstand - 1,
            rotation: [0, 0, 0],
            translation: [options.traufeLinks + k * options.zwischenwandAbstand, i, options.bodenHoehe + 1 + j*options.zwischenbodenAbstand],
            drills: [
              { side: 'front', depth: 0.3, position: 1 },
              { side: 'back', depth: 0.3, position: 1 },
              { side: 'front', depth: 0.3, position: options.zwischenwandAbstand - 2 },
              { side: 'back', depth: 0.3, position: options.zwischenwandAbstand - 2 }
            ]
          })
        }
      }
    }
  }

  return latten
}

function decke (options) {
  var length = options.breite - options.traufeLinks + options.deckeTraufeLinks - options.traufeRechts + options.deckeTraufeRechts
  var latten = []
  var drills = []
  
  for (var i = 0; i < options.zwischenwaende + 2; i++) {
    drills.push({ side: 'front', depth: 1, position: options.deckeTraufeLinks + i*options.zwischenwandAbstand})
  }

  for (var i = options.deckeInnenliegend ? 1 : 0; i < options.tiefe - (options.deckeInnenliegend ? 1 : 0); i++) {
    if (i % 2 == 0) {
      var fuellungDrills = []

      if (options.deckeGeschlossen) {
        if (options.deckeTraufeLinks) {
          if (i > 0) {
            fuellungDrills.push({ side: 'front', depth: 0.3, position: 0 })
            fuellungDrills.push({ side: 'front', depth: 0.3, position: options.deckeTraufeLinks - 1 })
          }
          if (i < options.tiefe - 1) {
            fuellungDrills.push({ side: 'back', depth: 0.3, position: 0 })
            fuellungDrills.push({ side: 'back', depth: 0.3, position: options.deckeTraufeLinks - 1 })
          }
        }
        if (options.deckeTraufeRechts) {
          if (i > 0) {
            fuellungDrills.push({ side: 'front', depth: 0.3, position: options.breite - options.deckeTraufeRechts })
            fuellungDrills.push({ side: 'front', depth: 0.3, position: options.breite - 1 })
          }
          if (i < options.tiefe - 1) {
            fuellungDrills.push({ side: 'back', depth: 0.3, position: options.breite - options.deckeTraufeRechts })
            fuellungDrills.push({ side: 'back', depth: 0.3, position: options.breite - 1 })
          }
        }
        // doing this quattro loop just to be order equal with scad
        if (i > 0) {
          for (var k = 0; k < options.zwischenwaende + 2; k++) {
            fuellungDrills.push({ side: 'front', depth: 0.3, position: options.deckeTraufeLinks + k*options.zwischenwandAbstand + 1 })
          }
          for (var k = 0; k < options.zwischenwaende + 2; k++) {
            fuellungDrills.push({ side: 'front', depth: 0.3, position: options.deckeTraufeLinks + (k+1)*options.zwischenwandAbstand - 1 })
          }
        }
        if (i < options.tiefe - 1) {
          for (var k = 0; k < options.zwischenwaende + 2; k++) {
            fuellungDrills.push({ side: 'back', depth: 0.3, position: options.deckeTraufeLinks + k*options.zwischenwandAbstand + 1 })
          }
          for (var k = 0; k < options.zwischenwaende + 2; k++) {
            fuellungDrills.push({ side: 'back', depth: 0.3, position: options.deckeTraufeLinks + (k+1)*options.zwischenwandAbstand - 1 })
          }
        }
      }

      latten.push({
        type: 'latte',
        group: 'decke',
        length: length,
        rotation: [0, 90, 0],
        translation: [options.traufeLinks - options.deckeTraufeLinks, i, options.hoehe - 1],
        drills: drills.concat(fuellungDrills)
      })
      
      if (options.deckeKiel && isKielIndex(options, i)) {
        // kiel
        var kielDrills = []

        for (var n = 0; n < options.zwischenwaende + 2; n++) {
          kielDrills.push({ side: 'front', depth: 0.3, position: n*options.zwischenwandAbstand })
        }
        for (var n = 0; n < options.zwischenwaende + 2; n++) {
          kielDrills.push({ side: 'back', depth: 0.3, position: n*options.zwischenwandAbstand })
        }

        latten.push({
          type: 'latte',
          group: 'decke-kiel',
          length: options.breite - options.traufeLinks - options.traufeRechts,
          rotation: [0, 90, 0],
          translation: [options.traufeLinks, i, options.hoehe - 2],
          drills: [
            { side: 'top', depth: 0.3, position: 1 },
            { side: 'top', depth: 0.3, position: options.breite - options.traufeLinks - options.traufeRechts - 2 }
          ].concat(kielDrills)
        })
      }
    } else if (options.deckeGeschlossen) {
      if (options.deckeTraufeLinks) {
        latten.push({
          type: 'latte',
          group: 'decke',
          length: options.deckeTraufeLinks,
          rotation: [0, 90, 0],
          translation: [options.traufeLinks - options.deckeTraufeLinks, i, options.hoehe - 1],
          drills: [
            { side: 'front', depth: 0.3, position: 0 },
            { side: 'back',  depth: 0.3, position: 0 },
            { side: 'front', depth: 0.3, position: options.deckeTraufeLinks - 1 },
            { side: 'back',  depth: 0.3, position: options.deckeTraufeLinks - 1 }
          ]
        })
      }
      if (options.deckeTraufeRechts) {
        latten.push({
          type: 'latte',
          group: 'decke',
          length: options.deckeTraufeRechts,
          rotation: [0, 90, 0],
          translation: [options.breite - options.traufeRechts, i, options.hoehe - 1],
          drills: [
            { side: 'front', depth: 0.3, position: 0 },
            { side: 'back',  depth: 0.3, position: 0 },
            { side: 'front', depth: 0.3, position: options.deckeTraufeRechts - 1 },
            { side: 'back',  depth: 0.3, position: options.deckeTraufeRechts - 1 }
          ]
        })
      }
      for (var k = 0; k < options.zwischenwaende + 1; k++) {
        latten.push({
          type: 'latte',
          group: 'decke',
          length: options.zwischenwandAbstand - 1,
          rotation: [0, 90, 0],
          translation: [options.traufeLinks + 1 + k*options.zwischenwandAbstand, i, options.hoehe - 1],
          drills: [
            { side: 'front', depth: 0.3, position: 0 },
            { side: 'back',  depth: 0.3, position: 0 },
            { side: 'front', depth: 0.3, position: options.zwischenwandAbstand - 2 },
            { side: 'back',  depth: 0.3, position: options.zwischenwandAbstand - 2 }
          ]
        })
      }
    }
  }

  return latten
}

function boeden (options) {
  var length = options.breite - options.traufeLinks + options.bodenTraufeLinks - options.traufeRechts + options.bodenTraufeRechts

  var latten = []
  var drills = []

  for (var i = 0; i < options.zwischenwaende + 2; i++) {
    drills.push({ side: 'front', depth: 1, position: options.bodenTraufeLinks + i*options.zwischenwandAbstand })
  }

  for (var j = 0; j < options.zwischenboeden + 1; j++) {
    for (var i = options.bodenInnenliegend ? 1 : 0; i < options.tiefe - (options.bodenInnenliegend ? 1 : 0); i++) {
      if (i % 2 == 0) {
        // TODO: fuellungen drills
        // Kiel nur unten:
        // if (j == 0 && options.bodenKiel && isKielIndex(options, i)) {
        if (options.bodenKiel && isKielIndex(options, i)) {
          latten.push({
            type: 'latte',
            group: 'boden',
            length: length,
            rotation: [0, 90, 0],
            translation: [options.traufeLinks - options.bodenTraufeLinks, i, options.bodenHoehe + j*options.zwischenbodenAbstand],
            drills: [
              { side: 'bottom', depth: 0.3, position: options.bodenTraufeLinks + 1 },
              { side: 'bottom', depth: 0.3, position: length - options.bodenTraufeLinks - 2 }
            ].concat(drills)
          })

          var kielDrills = []

          for (var n = 0; n < options.zwischenwaende + 2; n++) {
            kielDrills.push({ side: 'front', depth: 0.3, position: n*options.zwischenwandAbstand })
          }
          for (var n = 0; n < options.zwischenwaende + 2; n++) {
            kielDrills.push({ side: 'back', depth: 0.3, position: n*options.zwischenwandAbstand })
          }
      
          // kiel
          latten.push({
            type: 'latte',
            group: 'boden-kiel',
            length: options.breite - options.traufeLinks - options.traufeRechts,
            rotation: [0, 90, 0],
            translation: [options.traufeLinks, i, options.bodenHoehe + j*options.zwischenbodenAbstand - 1],
            drills: [
              { side: 'top', depth: 0.3, position: 1 },
              { side: 'top', depth: 0.3, position: options.breite - options.traufeLinks - options.traufeRechts - 2 }
            ].concat(kielDrills)
          })
        } else {
          latten.push({
            type: 'latte',
            group: 'boden',
            length: length,
            rotation: [0, 90, 0],
            translation: [options.traufeLinks - options.bodenTraufeLinks, i, options.bodenHoehe + j*options.zwischenbodenAbstand],
            drills: drills
          })
        }
      } else if (options.bodenGeschlossen) {
        if (options.bodenTraufeLinks) {
          latten.push({
            type: 'latte',
            group: 'boden',
            length: options.bodenTraufeLinks,
            rotation: [0, 90, 0],
            translation: [options.traufeLinks - options.bodenTraufeLinks, i, options.bodenHoehe + j*options.zwischenbodenAbstand],
            drills: [
              { side: 'front', depth: 0.3, position: 0 },
              { side: 'back',  depth: 0.3, position: 0 },
              { side: 'front', depth: 0.3, position: options.bodenTraufeLinks - 1 },
              { side: 'back',  depth: 0.3, position: options.bodenTraufeLinks - 1 }
            ]
          })
        }
        if (options.bodenTraufeRechts) {
          latten.push({
            type: 'latte',
            group: 'boden',
            length: options.bodenTraufeRechts,
            rotation: [0, 90, 0],
            translation: [options.breite - options.traufeRechts, i, options.bodenHoehe + j*options.zwischenbodenAbstand],
            drills: [
              { side: 'front', depth: 0.3, position: 0 },
              { side: 'back',  depth: 0.3, position: 0 },
              { side: 'front', depth: 0.3, position: options.bodenTraufeRechts - 1 },
              { side: 'back',  depth: 0.3, position: options.bodenTraufeRechts - 1 }
            ]
          })
        }
        for (var k = 0; k < options.zwischenwaende + 1; k++) {
          latten.push({
            type: 'latte',
            group: 'boden',
            length: options.zwischenwandAbstand - 1,
            rotation: [0, 90, 0],
            translation: [options.traufeLinks + 1 + k*options.zwischenwandAbstand, i, options.bodenHoehe + j*options.zwischenbodenAbstand],
            drills: [
              { side: 'front', depth: 0.3, position: 0 },
              { side: 'back',  depth: 0.3, position: 0 },
              { side: 'front', depth: 0.3, position: options.zwischenwandAbstand - 2 },
              { side: 'back',  depth: 0.3, position: options.zwischenwandAbstand - 2 }
            ]
          })
        }
      }
    }
  }


  return latten
}

function isKielIndex (options, i) {
  return i >= options.kieloffset && i % options.kielrepeat == 0 && i <= options.tiefe - options.kieloffset
}

module.exports = function raumholzBank (options) {
  options = options || {}
  
  options.q = options.q || [6,4]

  options.breite = options.breite || 16
  options.hoehe = options.hoehe || 7
  options.tiefe = options.tiefe || 9
  
  options.deckeGeschlossen = 'deckeGeschlossen' in options ? options.deckeGeschlossen : false
  options.deckeTraufeLinks = 'deckeTraufeLinks' in options ? options.deckeTraufeLinks : 0
  options.deckeTraufeRechts = 'deckeTraufeRechts' in options ? options.deckeTraufeRechts : 0
  options.deckeKiel = 'deckeKiel' in options ? options.deckeKiel : false
  options.deckeInnenliegend = 'deckeInnenliegend' in options ? options.deckeInnenliegend : 0

  options.bodenGeschlossen = 'bodenGeschlossen' in options ? options.bodenGeschlossen : false
  options.bodenTraufeLinks = 'bodenTraufeLinks' in options ? options.bodenTraufeLinks : 0
  options.bodenTraufeRechts = 'bodenTraufeRechts' in options ? options.bodenTraufeRechts : 0
  options.bodenHoehe = 'bodenHoehe' in options ? options.bodenHoehe : 2
  options.bodenUeberhang = 'bodenUeberhang' in options ? options.bodenUeberhang : 0
  options.bodenKiel = 'bodenKiel' in options ? options.bodenKiel : true
  options.bodenInnenliegend = 'bodenInnenliegend' in options ? options.bodenInnenliegend : 0

  options.zwischenboeden = options.zwischenboeden || 0
  options.zwischenwaende = options.zwischenwaende || 0
  options.wandGeschlossen = 'wandGeschlossen' in options ? options.wandGeschlossen : false


  // Constrains
  if (options.breite < 2) options.breite = 2
  if (options.hoehe < 4) options.hoehe = 4
  if (options.tiefe < 5) options.tiefe = 5
  if (options.tiefe % 2 === 0) options.tiefe++

  if (options.bodenHoehe > options.hoehe - 2) options.bodenHoehe = options.hoehe - 2
  if (options.bodenKiel && options.bodenHoehe < 1) options.bodenHoehe = 1
  if (options.bodenUeberhang > options.bodenHoehe) options.bodenUeberhang = options.bodenHoehe
  if (options.bodenKiel && options.bodenUeberhang > options.bodenHoehe - 1) options.bodenUeberhang = options.bodenHoehe - 1
  
  // Traufen
  if (options.breite - options.deckeTraufeLinks < 2) {
    options.deckeTraufeLinks = options.breite - 2
  }
  if (options.breite - options.bodenTraufeLinks < 2) {
    options.bodenTraufeLinks = options.breite - 2
  }
  if (options.breite - options.deckeTraufeLinks - options.deckeTraufeRechts < 2) {
    options.deckeTraufeRechts = options.breite - options.deckeTraufeLinks - 2
  }
  if (options.breite - options.bodenTraufeLinks - options.bodenTraufeRechts < 2) {
    options.bodenTraufeRechts = options.breite - options.bodenTraufeLinks - 2
  }
  if (options.breite - options.deckeTraufeLinks - options.bodenTraufeRechts < 2) {
    options.bodenTraufeRechts = options.breite - options.deckeTraufeLinks - 2
  }
  if (options.breite - options.bodenTraufeLinks - options.deckeTraufeRechts < 2) {
    options.deckeTraufeRechts = options.breite - options.bodenTraufeLinks - 2
  }

  // Zwischenwände
  if (options.zwischenwaende > options.breite - options.deckeTraufeLinks - options.deckeTraufeRechts - 2) {
    options.zwischenwaende = options.breite - options.deckeTraufeLinks - options.deckeTraufeRechts - 2
  }

  
  // Calculations
  options.traufeLinks = Math.max(options.deckeTraufeLinks, options.bodenTraufeLinks)
  options.traufeRechts = Math.max(options.deckeTraufeRechts, options.bodenTraufeRechts)

  options.zwischenbodenAbstand = Math.round((options.hoehe - options.bodenHoehe - options.zwischenboeden - 2)/(options.zwischenboeden + 1) + 1)
  // Höhe anpassen, um gleichmäßige Zwischenbodenabstände zu erreichen
  options.hoehe = options.bodenHoehe + (options.zwischenboeden + 1) * options.zwischenbodenAbstand + 1

  options.zwischenwandAbstand = Math.round((options.breite - options.traufeLinks - options.traufeRechts - options.zwischenwaende - 2)/(options.zwischenwaende + 1) + 1)
  // Breite anpassen, um gleichmäßige Zwischenwandabstände zu erreichen
  options.breite = (options.zwischenwaende + 1) * options.zwischenwandAbstand + 1 + options.traufeLinks + options.traufeRechts

  options.kieloffset = options.tiefe >= 9 ? 4 : 2
  options.kielrepeat = options.tiefe < 9 ? 2 : ((options.tiefe - 5) % 4 == 0 ? 4 : 2)


  return []
    .concat(waende(options))
    .concat(decke(options))
    .concat(boeden(options))
}

},{}]},{},[1])(1)
});