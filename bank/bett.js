var modelContainer, materialContainer;
var camera, trackballControls, scene, renderer, control;

var lattensorten = {
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
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  
	camera.position.x = 400;
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

  var drillOptions = {
    display: false,
    schraubdurchmesser: 1,
    tinybit: 0.001
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

    var drillsToDisplay = options.drills.filter(function (drill) {
      return drill.depth === 1
    })
    
    if (drillOptions.display && drillsToDisplay.length) {
      var boxBSP = new ThreeBSP(mesh)

      drillsToDisplay.forEach(function (drill) {
        var length

        if (drill.side === 'front' || drill.side === 'back') {
          length = drill.depth * latteOptions.q[1] + 2 * drillOptions.tinybit
        }
        if (drill.side === 'top' || drill.side === 'bottom') {
          length = drill.depth * latteOptions.q[0] + 2 * drillOptions.tinybit
        }
          
        var drillG = new THREE.CylinderGeometry(drillOptions.schraubdurchmesser/2, drillOptions.schraubdurchmesser/2, length, 16)
        var drillM = new THREE.Mesh(drillG, material)
       
        
        if (drill.side === 'front') {
          drillM.rotation.x = Math.PI/2
          drillM.position.set(0, drill.position * latteOptions.q[0], drill.depth/2 * latteOptions.q[1] - latteOptions.q[1]/2)
        }

        if (drill.side === 'top') {
          drillM.rotation.z = Math.PI/2
          drillM.position.set(drill.depth/2 * latteOptions.q[0] - latteOptions.q[0]/2, drill.position * latteOptions.q[0], 0)
        }
        
        if (drill.side === 'back') {
          drillM.rotation.x = Math.PI/2
          drillM.position.set(0, drill.position * latteOptions.q[0], drill.depth/-2 * latteOptions.q[1] + latteOptions.q[1]/2)
        }
        
        if (drill.side === 'bottom') {
          drillM.rotation.z = Math.PI/2
          drillM.position.set(drill.depth/-2 * latteOptions.q[0] + latteOptions.q[0]/2, drill.position * latteOptions.q[0], 0)
        }

        var drillBSP = new ThreeBSP(drillM)
      
        boxBSP = boxBSP.subtract(drillBSP)
      })

      mesh = boxBSP.toMesh(material)
    }
   
    
    var pivot = new THREE.Object3D()
    pivot.add(mesh)


    pivot.position.set(options.translation[0]*latteOptions.q[0], options.translation[2]*latteOptions.q[0], options.translation[1]*latteOptions.q[1])
    
    pivot.rotation.x = Math.PI * options.rotation[0] / 180
    pivot.rotation.z = Math.PI * options.rotation[1] / -180
    pivot.rotation.y = Math.PI * options.rotation[2] / 180
    
    return pivot
  }

	var guiConfig = {
		"preset": "Bett",
		"closed": false,
		"remembered": {
			"Bett": {
				"0": {
          lattensorte: '6x4 KVH',
          breite: 26,
          hoehe: 12,
          tiefe: 59,
          lehnstand: 0,
          vorstand: 0,
          stuetzenzahl: 2,
          rahmendicke: 3,
          senkung: 3,
          vornoffen: false,
          lehne: 0
        }
			},
			"Sessel": {
				"0": {
          lattensorte: '6x4 KVH',
          breite: 16,
          hoehe: 12,
          tiefe: 31,
          lehnstand: 3,
          vorstand: 0,
          stuetzenzahl: 2,
          rahmendicke: 7,
          vornoffen: true,
          senkung: 4,
          lehne: 9
        }
			},
			"Garderobe": {
				"0": {
					"lattensorte": "6x6 KVH",
					"breite": 6,
					"hoehe": 12,
					"tiefe": 31,
					"lehnstand": 0,
					"vorstand": 0,
					"stuetzenzahl": 2,
					"rahmendicke": 11,
					"vornoffen": true,
					"senkung": 9,
					"lehne": 17
				}
			},
			"Sofa": {
				"0": {
          lattensorte: '6x4 KVH',
          breite: 18,
          hoehe: 12,
          tiefe: 64,
          lehnstand: 3,
          vorstand: 0,
          stuetzenzahl: 2,
          rahmendicke: 5,
          vornoffen: true,
          senkung: 4,
          lehne: 9
        }
			}
		},
		"folders": {}
	}
  

	var BettOptions = function() {
    this.lattensorte = defaultLattensorte
    this.breite = 16
    this.hoehe = 7
    this.tiefe = 9
    this.lehnstand = 3
    this.vorstand = 3
    this.stuetzenzahl = 2
    this.rahmendicke = 5
    this.vornoffen = false
    this.senkung = 3
    this.lehne = 9
	};

	var bettOptions = new BettOptions();
	var gui = new dat.GUI({ load: guiConfig });
  
	gui.remember(bettOptions);


  function fastUpdateBett () {
    var display = drillOptions.display
    drillOptions.display = false
    updateBett()
    drillOptions.display = display
  }
	
  gui.add(bettOptions, 'lattensorte', Object.keys(lattensorten))
    .onChange(updateBett)
  gui.add(bettOptions, 'breite').min(2).max(50).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
    .listen()
	gui.add(bettOptions, 'hoehe').min(7).max(32).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
	gui.add(bettOptions, 'tiefe').min(5).max(64).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
	gui.add(bettOptions, 'lehnstand').min(0).max(8).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
    .listen()
	gui.add(bettOptions, 'vorstand').min(0).max(8).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
    .listen()
	gui.add(bettOptions, 'stuetzenzahl').min(2).max(12).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
    .listen()
	gui.add(bettOptions, 'rahmendicke').min(1).max(13).step(2)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
    .listen()
	gui.add(bettOptions, 'vornoffen')
    .onChange(updateBett)
	gui.add(bettOptions, 'senkung').min(0).max(9).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)
	gui.add(bettOptions, 'lehne').min(0).max(23).step(1)
    .onChange(fastUpdateBett).onFinishChange(updateBett)


  function bettGroup(latten) {
    var group = new THREE.Object3D()

    latten.forEach(function (l) {
      group.add(latte(l))
    })

    return group
  }

  var mybett
  var mybettStapel

  function updateBett() {
    latteOptions.q = lattensorten[bettOptions.lattensorte].q

    if (mybett) scene.remove(mybett)

    var latten = Bett(bettOptions)

    mybett = bettGroup(latten)
    scene.add(mybett)

    if (mybettStapel) scene.remove(mybettStapel)
    
    latten.sort(function (a, b) {
      return b.length - a.length
    })

    mybettStapel = bettGroup(latten)
    var size = Math.ceil(Math.sqrt(mybettStapel.children.length))
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        var item = mybettStapel.children[i*size + j]
        if (item) {
          item.position.set(-1 * j * (latteOptions.q[1] + 0.3), i * (latteOptions.q[0] + 0.3), 0)
          item.rotation.set(Math.PI/2, Math.PI/2, 0)
        }
      }
    }
    mybettStapel.rotation.set(0, Math.PI/2, 0)
    mybettStapel.position.set(bettOptions.breite * latteOptions.q[0] + 100, 0, 0)
    scene.add(mybettStapel)

    updateMaterial(bettOptions, latteOptions, latten)
  }
  

  updateBett()
  
  var size = latteOptions.q[0] * 112;

  // grid
  // var grid = new THREE.GridHelper(size, latteOptions.q[0]*70, new THREE.Color(0x888888), new THREE.Color(0xbbbbbb));
  // grid.position.set(0, 0, 0);
  // scene.add(grid);

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

function updateMaterial (bettOptions, latteOptions, latten) {
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
    count: bettOptions.stuetzenzahl * 2,
    length: bettOptions.stuetzenzahl * 2 * bettOptions.tiefe * latteOptions.q[1] / 100
  }

  var meterpreis = lattensorten[bettOptions.lattensorte].preis
    
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
  kosten.verschnitt = kosten.lattenmeter * 0.1 + kosten.schrauben * 0.1
  var summe = kosten.lattenmeter
    + kosten.schnitte
    + kosten.drills
    + kosten.schrauben
    + kosten.muttern
    + kosten.verschnitt

  var gewicht = latteOptions.q[0] * latteOptions.q[1] / 20

  materialContainer.innerHTML = [
    '<b>Abmessungen</b>',
    'Breite: ' + round(bettOptions.breite * latteOptions.q[0]) + 'cm',
    'Höhe: ' + round(bettOptions.hoehe * latteOptions.q[0]) + 'cm',
    'Tiefe: ' + round(bettOptions.tiefe * latteOptions.q[1]) + 'cm',
    'Lehnstand: ' + round(bettOptions.lehnstand * latteOptions.q[1]) + 'cm',
    'Vorstand: ' + round(bettOptions.vorstand * latteOptions.q[1]) + 'cm',
    'Senkung: ' + round(bettOptions.senkung * latteOptions.q[0]) + 'cm',
    'Bettkastentiefe: ' + round((bettOptions.breite - bettOptions.vorstand - bettOptions.lehnstand - 2) * latteOptions.q[0]) + 'cm',
    'Bettkastenbreite: ' + round((bettOptions.tiefe - 2*bettOptions.rahmendicke - 2) * latteOptions.q[1]) + 'cm',
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
    '<b>Längen</b>',
    Object.keys(holz.laengen).map(function (l) {
      return holz.laengen[l] + 'x ' + round(l) + 'cm'
    }).join('\n')
  ].join('\n')
}

function round (value) {
  var mm = Math.round(value*100)
  return mm/100
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

