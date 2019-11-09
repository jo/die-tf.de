window.Model = function (config) {
  return {
    config: config,

    addBoard: function () {
      config.boards.push({
        dimension: { length: 1000, width: 1000, thickness: 60 },
        position: { x: 1000, y: 1000, z: 1000 },
        angle: 0,
        modulo: 2,
        layer: 0
      })
      var oldCurrentBoardIndex = config.currentBoardIndex
      config.currentBoardIndex = model.config.boards.length - 1
      this.renderBoard(oldCurrentBoardIndex)
      this.renderBoard(config.currentBoardIndex)
    },
    
    removeCurrentBoard: function () {
      if (config.boards.length === 1) return

      config.boards.splice(config.currentBoardIndex, 1)
      this.rasteredBoards.splice(config.currentBoardIndex, 1)
      this.obj.remove(this.renderedBoards[config.currentBoardIndex])
      this.renderedBoards.splice(config.currentBoardIndex, 1)
      config.currentBoardIndex = 0 
      this.renderBoard(config.currentBoardIndex)
    },

    rasteredBoards: [],
    renderedBoards: [],

    obj: new THREE.Object3D(),

    material: (function () {
      var texloader = new THREE.TextureLoader()

      return new THREE.MeshLambertMaterial({
        map: texloader.load('textures/wood.jpg')
      })
    })(),
    
    outlineMaterial: (function () {
      return new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 })
    })(),


    render: function (fast) {
      for (var i = 0; i < this.renderedBoards.length; i++) {
        this.obj.remove(this.renderedBoards[i])
      }
      this.renderedBoards = []

      for (var i = 0; i < this.config.boards.length; i++) {
        this.renderBoard(i, fast)
      }
    },

    rasterBoard: function (i) {
      var x = this.config.lath.crossSection.x
      var y = this.config.lath.crossSection.y

      this.rasteredBoards[i] = {
        dimension: {
          length: Math.round(this.config.boards[i].dimension.length/x),
          width: Math.round(this.config.boards[i].dimension.width/y),
          thickness: Math.round(this.config.boards[i].dimension.thickness/x)
        },
        position: {
          x: Math.round(this.config.boards[i].position.x/x),
          y: Math.round(this.config.boards[i].position.y/x),
          z: Math.round(this.config.boards[i].position.z/y)
        },
        angle: this.config.boards[i].angle
      }
      this.config.boards[i].dimension.length = this.rasteredBoards[i].dimension.length*x
      this.config.boards[i].dimension.width = this.rasteredBoards[i].dimension.width*y
      this.config.boards[i].dimension.thickness = this.rasteredBoards[i].dimension.thickness*x
      this.config.boards[i].position.x = this.rasteredBoards[i].position.x*x
      this.config.boards[i].position.y = this.rasteredBoards[i].position.y*x
      this.config.boards[i].position.z = this.rasteredBoards[i].position.z*y
    },

    renderBoard: function (i, fast) {
      this.rasterBoard(i)

      var config = this.config.boards[i]
      var raster = this.rasteredBoards[i]

      var board = new THREE.Object3D()

      if (i === this.config.currentBoardIndex) {
        var margin = 0
        var x = config.dimension.thickness + margin
        var y = config.dimension.length + margin
        var z = config.dimension.width + margin
        var box = new THREE.BoxGeometry(x, y, z)
        var outline = new THREE.Mesh(box, this.outlineMaterial)
        outline.position.set(x/2 - margin/2, y/2 - margin/2, z/2 - margin/2)
        board.add(outline)
      }

      if (fast) {
        var margin = 0
        var x = config.dimension.thickness + margin
        var y = config.dimension.length + margin
        var z = config.dimension.width + margin
        var box = new THREE.BoxGeometry(x, y, z)
        var outline = new THREE.Mesh(box, this.material)
        outline.position.set(x/2 - margin/2, y/2 - margin/2, z/2 - margin/2)
        board.add(outline)
      } else {
        var padding = 0

        for (var x = 0; x < raster.dimension.thickness; x++) {
          for (var z = 0; z < raster.dimension.width; z++) {
            if (z % config.modulo === config.layer) {
              var lx = this.config.lath.crossSection.x - padding
              var ly = config.dimension.length - padding
              var lz = this.config.lath.crossSection.y - padding
              var box = new THREE.BoxGeometry(lx, ly, lz)
              var lath = new THREE.Mesh(box, this.material)
              lath.position.set((1/2+x)*this.config.lath.crossSection.x + padding/2, config.dimension.length/2 + padding/2, (1/2+z)*this.config.lath.crossSection.y + padding/2)
              board.add(lath)
            }
          }
        }
      }

      board.position.set(config.position.x, config.position.y, config.position.z)
    
      board.rotation.z = Math.PI * config.angle / 180

      if (this.renderedBoards[i]) {
        this.obj.remove(this.renderedBoards[i])
      }
      this.obj.add(board)
      this.renderedBoards[i] = board
    }
  }
}
