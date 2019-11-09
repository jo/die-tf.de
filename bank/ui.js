window.Ui = (function () {
  function init (model) {
    var renderFast = model.render.bind(model, true)
    var renderSlow = model.render.bind(model, false)

    function renderCurrentBoard() {
      model.renderBoard(model.config.currentBoardIndex)
    }

    var gui = new dat.GUI({
      width: 512
    })

    gui.add(model.config, 'name')
    
    var lath = gui.addFolder('Lath')
    var crossSection = lath.addFolder('Cross Section')
    crossSection.add(model.config.lath.crossSection, 'x').min(0).max(300).onChange(renderFast).onFinishChange(updateRange)
    crossSection.add(model.config.lath.crossSection, 'y').min(0).max(100).onChange(renderFast).onFinishChange(updateRange)
    crossSection.open()
    lath.open()


    var currentBoardIndex = gui.add(model.config, 'currentBoardIndex').min(0).max(model.config.boards.length - 1).step(1).onChange(renderBoardGui).listen()
    gui.add(model, 'addBoard').onFinishChange(updateBoardsRange)
    gui.add(model, 'removeCurrentBoard').onFinishChange(updateBoardsRange)

    function updateBoardsRange () {
      currentBoardIndex.max(model.config.boards.length - 1)
      renderBoardGui()
    }

    var board = gui.addFolder('Board')
    var dimension = board.addFolder('Dimension')
    dimension.open()
    var position = board.addFolder('Position')
    position.open()

    var length, width, thickness, positionX, positionY, positionZ, angle, modulo, layer
    function renderBoardGui () {
      if (length) dimension.remove(length)
      length = dimension.add(model.config.boards[model.config.currentBoardIndex].dimension, 'length').min(0).max(3000).onChange(renderCurrentBoard).listen()
      if (width) dimension.remove(width)
      width = dimension.add(model.config.boards[model.config.currentBoardIndex].dimension, 'width').min(0).max(2000).onChange(renderCurrentBoard).listen()
      if (thickness) dimension.remove(thickness)
      thickness = dimension.add(model.config.boards[model.config.currentBoardIndex].dimension, 'thickness').min(0).max(3000).onChange(renderCurrentBoard).listen()

      if (positionX) position.remove(positionX)
      positionX = position.add(model.config.boards[model.config.currentBoardIndex].position, 'x').min(0).max(3000).onChange(renderCurrentBoard).listen()
      if (positionY) position.remove(positionY)
      positionY = position.add(model.config.boards[model.config.currentBoardIndex].position, 'y').min(0).max(3000).onChange(renderCurrentBoard).listen()
      if (positionZ) position.remove(positionZ)
      positionZ = position.add(model.config.boards[model.config.currentBoardIndex].position, 'z').min(0).max(3000).onChange(renderCurrentBoard).listen()

      if (angle) board.remove(angle)
      angle = board.add(model.config.boards[model.config.currentBoardIndex], 'angle').min(-360).max(360).onChange(renderCurrentBoard)
      
      if (modulo) board.remove(modulo)
      modulo = board.add(model.config.boards[model.config.currentBoardIndex], 'modulo').min(1).max(42).step(1).onChange(updateLayerRange)
      if (layer) board.remove(layer)
      layer = board.add(model.config.boards[model.config.currentBoardIndex], 'layer').min(0).max(41).step(1).onChange(renderCurrentBoard).listen()
    
      updateRange()
    }

    function updateLayerRange () {
      if (model.config.boards[model.config.currentBoardIndex].layer > model.config.boards[model.config.currentBoardIndex].modulo - 1) model.config.boards[model.config.currentBoardIndex].layer = model.config.boards[model.config.currentBoardIndex].modulo - 1
      layer.max(model.config.boards[model.config.currentBoardIndex].modulo - 1)
      renderCurrentBoard()
    }
    
    function updateRange () {
      var x = model.config.lath.crossSection.x
      var y = model.config.lath.crossSection.y

      var max = {
        x: Math.floor(3000/x)*x,
        y: Math.floor(2000/y)*y
      }

      length.min(x).max(max.x)
      width.min(y).max(max.y)
      thickness.min(x).max(max.x)
      
      positionX.max(max.x)
      positionY.max(max.y)
      positionZ.max(max.x)
      
      renderSlow()
    }
    
    renderBoardGui()
    board.open()
  }

  return {
    init: init
  }
})()
