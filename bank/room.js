window.Room = (function () {
  var raycaster = new THREE.Raycaster()
  var mouse = new THREE.Vector2()
  var INTERSECTED

  var scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0xeeeeee, 0.00001)

  var model

  function Camera () {
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000)

    camera.position.x = 6000
    camera.position.y = 2000
    camera.position.z = 4000

    return camera
  }


  function Axis () {
    return new THREE.AxisHelper(10000)
  }


  function Lights () {
    var light1 = new THREE.DirectionalLight(0xeeeeee)
    light1.position.set(10, 10, 1.2)

    var light2 = new THREE.DirectionalLight(0x666666)
    light2.position.set(-10, -10, 2)

    var light3 = new THREE.AmbientLight(0x666666)

    return [light1, light2, light3]
  }


  function Renderer (container) {
    var renderer = new THREE.WebGLRenderer({ antialias: false })

    renderer.setClearColor(0xeeeeee)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    container.appendChild(renderer.domElement)

    return renderer
  }


  // navigation controls
  function initControls (camera, domElement) {
    var controls = new THREE.TrackballControls(camera, domElement)
    
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8
    controls.noZoom = false
    controls.noPan = false
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    controls.keys = [ 65, 83, 68 ]

    return controls
  }



  function init (container, m) {
    model = m

    var camera = Camera()
    var renderer = Renderer(container)
    var controls = initControls(camera, renderer.domElement)
    
    var axis = Axis()
    scene.add(axis)
    
    var lights = Lights()
    lights.forEach(function (light) {
      scene.add(light)
    })

    model.render()
    scene.add(model.obj)

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    window.addEventListener('resize', onWindowResize, false)

    animate(controls, renderer, camera)
  }

	function onDocumentMouseMove(e) {
		e.preventDefault()
		mouse.x = (e.clientX / window.innerWidth) * 2 - 1
		mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
	}

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    controls.handleResize()
  }


  function animate (controls, renderer, camera) {
    requestAnimationFrame(animate.bind(null, controls, renderer, camera))

    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(model.obj.children, true)
		
		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				// if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
				INTERSECTED = intersects[0].object
				// console.log('intersection changed')
				// INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
				// INTERSECTED.material.opacity = 0.5
			}
		} else {
			// if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
			INTERSECTED = null
		}

    renderer.render(scene, camera)
    controls.update()
  }

  return {
    init: init
  }
})()
