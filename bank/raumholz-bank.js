var modelContainer, materialContainer;
var camera, trackballControls, scene, renderer, control;

var lattensorten = {
  '19x13': {
    q: [1.9, 1.3 ],
    preis: 0.50
  },
  '2x2': {
    q: [2, 2 ],
    preis: 0.50
  },
  '3x2': {
    q: [ 3, 2 ],
    preis: 0.50
  },
  '4.8x2.4 rauh': {
    q: [ 3.8, 2.8 ],
    preis: 0.50
  },
  '5.8x3.8 rauh': {
    q: [ 5.8, 3.8 ],
    preis: 0.94
  },
  '6x4 KVH': {
    q: [ 6, 4 ],
    preis: 1.35
  },
  '6x6 KVH': {
    q: [ 6, 6 ],
    preis: 2.10
  },
  '100x18 Brett': {
    q: [ 10, 1.8 ],
    preis: 1.20
  }
}
var defaultLattensorte = '6x4 KVH'

var preise = {
  marge: 1,
  schnitt: 0.86,
  drill: 0.86/4,
  schraubenProMeter: 1.58,
  schraube: 0.3,
  mutter: 17.43/100
}
  

init();
animate();


function init() {
  materialContainer = document.getElementById('material-container');

	// camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  
	camera.position.x = 600;
	camera.position.y = 200;
	camera.position.z = 400;


  // world
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xeeeeee, 0.0001);


  var texloader = new THREE.TextureLoader();
  var texture = texloader.load("textures/wood.jpg", render.bind(null, true));
  var material = new THREE.MeshLambertMaterial({ map: texture });


  var latteOptions = {
    q: lattensorten[defaultLattensorte].q
  }


  function latte(options) {
    options = options || {}
    options.group = options.group || 'default'
    options.length = options.length || 1
    options.rotation = options.rotation || [0,0,0]
    options.translation = options.translation || [0, 0, 0]
    options.drills = options.drills || []
    
    // console.log("latte", options.group, options.length, options.rotation, options.translation, options.drills)

    var laenge = options.length * latteOptions.q[0]

    var boxG = new THREE.BoxGeometry(latteOptions.q[0], laenge, latteOptions.q[1])
    var mesh = new THREE.Mesh(boxG, material)

    mesh.position.set(0, laenge/2 - latteOptions.q[0]/2, 0)
    
    var pivot = new THREE.Object3D()
    pivot.add(mesh)

    pivot.position.set(options.translation[0]*latteOptions.q[0], options.translation[2]*latteOptions.q[0], options.translation[1]*latteOptions.q[1])
    
    pivot.rotation.x = Math.PI * options.rotation[0] / 180
    pivot.rotation.z = Math.PI * options.rotation[1] / -180
    pivot.rotation.y = Math.PI * options.rotation[2] / 180
    
    return pivot
  }

	var guiConfig = {
		preset: 'Bank',
		closed: false,
		remembered: {
			'Bank': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 16,
          hoehe: 7,
          tiefe: 9,
          
          deckeGeschlossen: false,
          deckeTraufeLinks: 3,
          deckeTraufeRechts: 3,
          deckeKiel: false,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 1,
          bodenTraufeRechts: 1,
          bodenHoehe: 2,
          bodenUeberhang: 0,
          bodenKiel: true,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 0,
          wandGeschlossen: false
        })
			},
			'Schlichte Bank': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 16,
          hoehe: 7,
          tiefe: 9,
          
          deckeGeschlossen: true,
          deckeTraufeLinks: 0,
          deckeTraufeRechts: 0,
          deckeKiel: false,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 0,
          bodenTraufeRechts: 0,
          bodenHoehe: 2,
          bodenUeberhang: 0,
          bodenKiel: true,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 0,
          wandGeschlossen: false
        })
			},
			'Lange Bank': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 42,
          hoehe: 7,
          tiefe: 9,
          
          deckeGeschlossen: false,
          deckeTraufeLinks: 4,
          deckeTraufeRechts: 4,
          deckeKiel: false,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 1,
          bodenTraufeRechts: 1,
          bodenHoehe: 2,
          bodenUeberhang: 0,
          bodenKiel: true,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 2,
          wandGeschlossen: false
        })
			},
			'Kartentisch': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 14,
          hoehe: 11,
          tiefe: 21,
          
          deckeGeschlossen: true,
          deckeTraufeLinks: 1,
          deckeTraufeRechts: 1,
          deckeKiel: true,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 0,
          bodenTraufeRechts: 0,
          bodenHoehe: 6,
          bodenUeberhang: 0,
          bodenKiel: false,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 0,
          wandGeschlossen: false
        })
			},
			'Stehpult': {
				0: raster2Options({
          lattensorte: '6x6 KVH',
          
          breite: 11,
          hoehe: 18,
          tiefe: 7,
          
          deckeGeschlossen: true,
          deckeTraufeLinks: 2,
          deckeTraufeRechts: 2,
          deckeKiel: true,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 1,
          bodenTraufeRechts: 1,
          bodenHoehe: 2,
          bodenUeberhang: 0,
          bodenKiel: true,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 0,
          wandGeschlossen: false
        })
			},
			'Werkbank': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 31,
          hoehe: 13,
          tiefe: 17,
          
          deckeGeschlossen: true,
          deckeTraufeLinks: 3,
          deckeTraufeRechts: 3,
          deckeKiel: true,
          deckeInnenliegend: false,
          
          bodenGeschlossen: true,
          bodenTraufeLinks: 0,
          bodenTraufeRechts: 0,
          bodenHoehe: 3,
          bodenUeberhang: 0,
          bodenKiel: true,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 2,
          wandGeschlossen: false
        })
			},
			'Regal': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 22,
          hoehe: 32,
          tiefe: 7,
          
          deckeGeschlossen: true,
          deckeTraufeLinks: 0,
          deckeTraufeRechts: 0,
          deckeKiel: false,
          deckeInnenliegend: true,
          
          bodenGeschlossen: true,
          bodenTraufeLinks: 0,
          bodenTraufeRechts: 0,
          bodenHoehe: 3,
          bodenUeberhang: 0,
          bodenKiel: false,
          bodenInnenliegend: true,
          
          zwischenboeden: 3,
          zwischenwaende: 0,
          wandGeschlossen: true
        })
			},
			'Lagerregal': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 51,
          hoehe: 32,
          tiefe: 13,
          
          deckeGeschlossen: false,
          deckeTraufeLinks: 0,
          deckeTraufeRechts: 0,
          deckeKiel: false,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 0,
          bodenTraufeRechts: 0,
          bodenHoehe: 3,
          bodenUeberhang: 0,
          bodenKiel: false,
          bodenInnenliegend: false,
          
          zwischenboeden: 3,
          zwischenwaende: 3,
          wandGeschlossen: false
        })
			},
			'Bett': {
				0: raster2Options({
          lattensorte: '6x4 KVH',
          
          breite: 22,
          hoehe: 7,
          tiefe: 51,
          
          deckeGeschlossen: false,
          deckeTraufeLinks: 4,
          deckeTraufeRechts: 4,
          deckeKiel: false,
          deckeInnenliegend: false,
          
          bodenGeschlossen: false,
          bodenTraufeLinks: 0,
          bodenTraufeRechts: 0,
          bodenHoehe: 2,
          bodenUeberhang: 0,
          bodenKiel: false,
          bodenInnenliegend: true,
          
          zwischenboeden: 0,
          zwischenwaende: 0,
          wandGeschlossen: false
        })
			}
		},
		folders: {}
	}
  

  var raumholzOptions = {}
  
  raster2raumholzOptions({
    lattensorte: defaultLattensorte,

    breite: 16,
    hoehe: 7,
    tiefe: 9,
    
    deckeGeschlossen: false,
    deckeTraufeLinks: 0,
    deckeTraufeRechts: 0,
    deckeKiel: false,
    deckeInnenliegend: false,
    
    bodenGeschlossen: false,
    bodenTraufeLinks: 0,
    bodenTraufeRechts: 0,
    bodenHoehe: 2,
    bodenUeberhang: 0,
    bodenKiel: true,
    bodenInnenliegend: true,
    
    zwischenboeden: 0,
    zwischenwaende: 0,
    wandGeschlossen: false
  })

  function raster2Options (raster) {
    var q = lattensorten[raster.lattensorte].q

    var raumholzOptions = {}

    for (var key in raster) {
      if (typeof raster[key] === 'number') {
        var d = key === 'tiefe' ? q[1] : q[0]
        raumholzOptions[key] = raster[key] * d
      } else {
        raumholzOptions[key] = raster[key]
      }
    }

    return raumholzOptions
  }

  function raster2raumholzOptions (raster) {
    var q = lattensorten[raster.lattensorte].q

    for (var key in raster) {
      if (typeof raster[key] === 'number') {
        var d = key === 'tiefe' ? q[1] : q[0]
        raumholzOptions[key] = raster[key] * d
      } else {
        raumholzOptions[key] = raster[key]
      }
    }
  }

  function raumholzOptions2raster () {
    var q = lattensorten[raumholzOptions.lattensorte].q

    var raster = {}
    
    for (var key in raumholzOptions) {
      if (typeof raster[key] === 'number') {
        var d = key === 'tiefe' ? q[1] : q[0]
        raster[key] = Math.round(raumholzOptions[key] / d)
      } else {
        raster[key] = raumholzOptions[key]
      }
    }
    
    return raster
  }


	var gui = new dat.GUI({
    load: guiConfig,
    width: 512
  });
  
	gui.remember(raumholzOptions);


  gui.add(raumholzOptions, 'lattensorte', Object.keys(lattensorten))
    .onChange(updateRaumholz)
  
  gui.add(raumholzOptions, 'breite').min(2).max(300).step(0.01)
    .onChange(updateRaumholz)
    .listen()
	gui.add(raumholzOptions, 'hoehe').min(4).max(300).step(0.01)
    .onChange(updateRaumholz)
	gui.add(raumholzOptions, 'tiefe').min(5).max(200).step(0.01)
    .onChange(updateRaumholz)
	
  var decke = gui.addFolder('Decke')
	decke.add(raumholzOptions, 'deckeGeschlossen')
    .onChange(updateRaumholz)
  decke.add(raumholzOptions, 'deckeTraufeLinks').min(0).max(100).step(0.01)
    .onChange(updateRaumholz).listen()
	decke.add(raumholzOptions, 'deckeTraufeRechts').min(0).max(100).step(0.01)
    .onChange(updateRaumholz).listen()
	decke.add(raumholzOptions, 'deckeKiel')
    .onChange(updateRaumholz)
	decke.add(raumholzOptions, 'deckeInnenliegend')
    .onChange(updateRaumholz)
	
  var boden = gui.addFolder('Boden')
	boden.add(raumholzOptions, 'bodenGeschlossen')
    .onChange(updateRaumholz)
  boden.add(raumholzOptions, 'bodenTraufeLinks').min(0).max(100).step(0.01)
    .onChange(updateRaumholz).listen()
	boden.add(raumholzOptions, 'bodenTraufeRechts').min(0).max(100).step(0.01)
    .onChange(updateRaumholz).listen()
  boden.add(raumholzOptions, 'bodenHoehe').min(0).max(100).step(0.01)
    .onChange(updateRaumholz).listen()
	boden.add(raumholzOptions, 'bodenUeberhang').min(0).max(100).step(0.01)
    .onChange(updateRaumholz).listen()
	boden.add(raumholzOptions, 'bodenKiel')
    .onChange(updateRaumholz)
	boden.add(raumholzOptions, 'bodenInnenliegend')
    .onChange(updateRaumholz)

	gui.add(raumholzOptions, 'zwischenwaende').min(0).max(12).step(1)
    .onChange(updateRaumholz).listen()
	gui.add(raumholzOptions, 'zwischenboeden').min(0).max(12).step(1)
    .onChange(updateRaumholz).listen()
	gui.add(raumholzOptions, 'wandGeschlossen')
    .onChange(updateRaumholz)


  function raumholzGroup(latten) {
    var group = new THREE.Object3D()

    latten.forEach(function (l) {
      group.add(latte(l))
    })

    return group
  }

  var myraumholz

  function updateRaumholz() {
    latteOptions.q = lattensorten[raumholzOptions.lattensorte].q

    var raster = raumholzOptions2raster()
    var latten = RaumholzBank(raster)
    raster2raumholzOptions(raster)
    
    if (myraumholz) scene.remove(myraumholz)
    myraumholz = raumholzGroup(latten)
    scene.add(myraumholz)
    
    updateMaterial(raumholzOptions, latteOptions, latten)
  }
  

  updateRaumholz()
  
  var size = latteOptions.q[0] * 112;

  // axis
  var axisHelper = new THREE.AxisHelper(size)
  scene.add(axisHelper)


  // lights
  light = new THREE.DirectionalLight(0xeeeeee);
  light.position.set(10, 10, 1.2);
  scene.add(light);

  light = new THREE.DirectionalLight(0x666666);
  light.position.set(-10, -10, 2);
  scene.add(light);

  light = new THREE.AmbientLight(0x666666);
  scene.add(light);


  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);



  // setup container and render
  modelContainer = document.getElementById('model-container');
  modelContainer.appendChild(renderer.domElement);



	// navigation
  trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.2;
  trackballControls.panSpeed = 0.8;

  trackballControls.noZoom = false;
  trackballControls.noPan = false;

  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;

  trackballControls.keys = [ 65, 83, 68 ];
  trackballControls.addEventListener('change', render);


  window.addEventListener('resize', onWindowResize, false);

  render();
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  trackballControls.handleResize();

  render();
}

var loaded = false

function animate() {
  requestAnimationFrame(animate);
  trackballControls.update();
  if (loaded) renderer.render(scene, camera);
}

function render(textureLoaded) {
  if (textureLoaded) loaded = true
  if (loaded) renderer.render(scene, camera);
}

function updateMaterial (bankOptions, latteOptions, latten) {
  var holz = latten.reduce(function (memo, latte) {
    var l = latte.length * latteOptions.q[0]
    memo.length += l
    memo.count++
    memo.laengen[l] = memo.laengen[l] || 0
    memo.laengen[l]++
    memo.drills += latte.drills.length

    return memo
  }, {
    count: 0,
    length: 0,
    laengen: {},
    drills: 0
  })

  var schrauben = {
    count: (bankOptions.zwischenwaende + 2) * (bankOptions.zwischenboeden + 2),
    length: (bankOptions.zwischenwaende + 2) * (bankOptions.zwischenboeden + 2) * bankOptions.tiefe * latteOptions.q[1] / 100
  }

  var meterpreis = lattensorten[bankOptions.lattensorte].preis

  var schnitte = Object.keys(holz.laengen).reduce(function (memo, l) {
    return memo + holz.laengen[l] / 3
  }, 0)

  var kosten = {
    lattenmeter: preise.marge * meterpreis * holz.length / 100,
    schnitte: preise.marge * preise.schnitt * schnitte,
    drills: preise.marge * preise.drill * holz.drills,
    schrauben: preise.marge * schrauben.length * preise.schraubenProMeter + schrauben.count * preise.schraube,
    muttern: preise.marge * 2*schrauben.count * preise.mutter
  }
  kosten.verschnitt = kosten.lattenmeter * 0.3 + kosten.schrauben * 0.3
  var summe = kosten.lattenmeter
    + kosten.schnitte
    + kosten.drills
    + kosten.schrauben
    + kosten.muttern
    + kosten.verschnitt

  var gewicht = latteOptions.q[0] * latteOptions.q[1] / 20

  materialContainer.innerHTML = [
    '<b>Abmessungen</b>',
    'Breite: ' + round(bankOptions.breite * latteOptions.q[0]) + 'cm',
    'Höhe: ' + round(bankOptions.hoehe * latteOptions.q[0]) + 'cm',
    'Tiefe: ' + round(bankOptions.tiefe * latteOptions.q[1]) + 'cm',
    'Fachhöhe: ' + round((bankOptions.zwischenbodenAbstand - 1) * latteOptions.q[1]) + 'cm',
    'Fachbreite: ' + round((bankOptions.zwischenwandAbstand - 1) * latteOptions.q[0]) + 'cm',
    'Gewicht: ' + round(gewicht * holz.length / 100) + 'kg',
    '',
    '<b>Material</b>',
    'Latten: ' + holz.count + ' (' + Object.keys(holz.laengen).length + ' Längen)',
    'Lattenmeter: ' + round(holz.length / 100) + 'm',
    'Bohrungen: ' + holz.drills,
    'Schrauben: ' + schrauben.count,
    'Schraubenmeter: ' + round(schrauben.length) + 'm',
    '',
    '<b>Kosten</b>',
    'Holz: ' + round(kosten.lattenmeter) + '€',
    'Schrauben/Muttern: ' + round(kosten.schrauben + kosten.muttern) + '€',
    'Zuschnitt: ' + round(kosten.schnitte) + '€',
    'Bohrungen: ' + round(kosten.drills) + '€',
    'Verschnitt: ' + round(kosten.verschnitt) + '€',
    '<i>Summe: ' + round(summe) + '€</i>',
    '',
    '<b>Latten</b>',
    Object.keys(holz.laengen).map(function (l) {
      return holz.laengen[l] + 'x ' + round(l) + 'cm'
    }).join('\n')
  ].join('\n')
}

function round (value) {
  var mm = Math.round(value*100)
  return mm/100
}

