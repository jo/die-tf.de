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
  scene.fog = new THREE.FogExp2(0xeeeeee, 0.00001);
  
  // var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  // scene.add( light );


  // var texloader = new THREE.TextureLoader();
  // var texture = texloader.load("textures/wood.jpg", render.bind(null, true));
  // var material = new THREE.MeshLambertMaterial({ map: texture });
  const m1 = new THREE.MeshBasicMaterial({color: 'silver'});
  // material = m1
  //
  //
  var texture = new THREE.TextureLoader().load( 'textures/wood.jpg' );

  // immediately use the texture for material creation
  var material = new THREE.MeshBasicMaterial( { map: texture } );


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
      return drill.depth
      // return drill.depth === 1
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
		"preset": "Bank",
		"closed": false,
		"remembered": {
			"Bank": {
				"0": {
          lattensorte: '6x4 KVH',
          breite: 16,
          hoehe: 7,
          tiefe: 9,
          ueberstand: 3,
          stuetzenzahl: 2,
          vollsitz: false
        }
			},
			"Arbeitstisch": {
				"0": {
          lattensorte: '6x4 KVH',
          breite: 34,
          hoehe: 13,
          tiefe: 21,
          ueberstand: 3,
          stuetzenzahl: 4,
          vollsitz: true
        }
			},
			"Pult": {
				"0": {
          lattensorte: '6x6 KVH',
          breite: 11,
          hoehe: 18,
          tiefe: 7,
          ueberstand: 2,
          stuetzenzahl: 2,
          vollsitz: true
        }
			},
			"Tischchen": {
				"0": {
          lattensorte: '6x4 KVH',
          breite: 12,
          hoehe: 13,
          tiefe: 27,
          ueberstand: 3,
          stuetzenzahl: 2,
          vollsitz: true
        }
			}
		},
		"folders": {}
	}
  

	var BankOptions = function() {
    this.lattensorte = defaultLattensorte
    this.breite = 16
    this.hoehe = 7
    this.tiefe = 9
    this.ueberstand = 3
    this.stuetzenzahl = 2
    this.vollsitz = false
	};

	var bankOptions = new BankOptions();
	var gui = new dat.GUI({ load: guiConfig });
  
	gui.remember(bankOptions);


  function fastUpdateBank () {
    var display = drillOptions.display
    drillOptions.display = false
    updateBank()
    drillOptions.display = display
  }
	
  gui.add(bankOptions, 'lattensorte', Object.keys(lattensorten))
    .onChange(updateBank)
  gui.add(bankOptions, 'breite').min(2).max(50).step(1)
    .onChange(fastUpdateBank).onFinishChange(updateBank)
    .listen()
	gui.add(bankOptions, 'hoehe').min(4).max(32).step(1)
    .onChange(fastUpdateBank).onFinishChange(updateBank)
	gui.add(bankOptions, 'tiefe').min(5).max(64).step(1)
    .onChange(fastUpdateBank).onFinishChange(updateBank)
	gui.add(bankOptions, 'ueberstand').min(0).max(8).step(1)
    .onChange(fastUpdateBank).onFinishChange(updateBank)
    .listen()
	gui.add(bankOptions, 'stuetzenzahl').min(2).max(12).step(1)
    .onChange(fastUpdateBank).onFinishChange(updateBank)
    .listen()
	gui.add(bankOptions, 'vollsitz')
    .onChange(updateBank)
    .listen()


  function bankGroup(latten) {
    var group = new THREE.Object3D()

    latten.forEach(function (l) {
      group.add(latte(l))
    })

    return group
  }

  var mybank
  var mybankStapel

  function updateBank() {
    latteOptions.q = lattensorten[bankOptions.lattensorte].q

    var latten = Bank(bankOptions)
    
    if (mybank) scene.remove(mybank)
    mybank = bankGroup(latten)
    scene.add(mybank)

    if (mybankStapel) scene.remove(mybankStapel)
    
    latten.sort(function (a, b) {
      return b.length - a.length
    })

    mybankStapel = bankGroup(latten)
    var size = Math.ceil(Math.sqrt(mybankStapel.children.length))
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        var item = mybankStapel.children[i*size + j]
        if (item) {
          item.position.set(-1 * j * (latteOptions.q[1] + 0.3), i * (latteOptions.q[0] + 0.3), 0)
          item.rotation.set(Math.PI/2, Math.PI/2, 0)
        }
      }
    }
    mybankStapel.rotation.set(0, Math.PI/2, 0)
    mybankStapel.position.set(bankOptions.breite * latteOptions.q[0] + 20, 0, 0)
    scene.add(mybankStapel)

    updateMaterial(bankOptions, latteOptions, latten)
  }
  

  updateBank()
  
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

  // trackballControls.update();


  window.addEventListener('resize', onWindowResize, false);

  
  
  render();
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
    count: bankOptions.stuetzenzahl * 2,
    length: bankOptions.stuetzenzahl * 2 * bankOptions.tiefe * latteOptions.q[1] / 100
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
    'Breite: ' + round(bankOptions.breite * latteOptions.q[0]) + 'cm',
    'Höhe: ' + round(bankOptions.hoehe * latteOptions.q[0]) + 'cm',
    'Tiefe: ' + round(bankOptions.tiefe * latteOptions.q[1]) + 'cm',
    'Überstand: ' + round(bankOptions.ueberstand * latteOptions.q[1]) + 'cm',
    'Fachhöhe: ' + round((bankOptions.hoehe - 4) * latteOptions.q[1]) + 'cm',
    'Fachbreite: ' + round((bankOptions.stuetzabstand - 1) * latteOptions.q[0]) + 'cm',
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
  renderer.render(scene, camera);
}

function render(textureLoaded) {
  if (textureLoaded) loaded = true
  if (loaded) renderer.render(scene, camera);
}

