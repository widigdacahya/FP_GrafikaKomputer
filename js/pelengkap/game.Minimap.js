//Deklarasi
var game = window.game || {};
game.Gui = game.Gui || {};

game.Gui.MiniMap = function (width, height, parent) {
  this.parent = parent;
  this.width = width;
  this.height = height;
  this.blockSize = {
    width: 5,
    height: 5,
  };

  this.playerPosition = {
    x: 0,
    y: 0,
  };

  //embed
  this.miniMap = document.createElement("canvas");
  this.ctx = this.miniMap.getContext("2d");

  //Membuat map
  this.create = function (top, left, position, border) {
    var stylePosition = "position:absolute;";
    var styleUpper = "10" + "px;";
    var styleLeft = (left || "10") + "px;";
    var styleBorder = (border || "1px solid black") + ";";

    this.miniMap.setAttribute("width", this.width * this.blockSize.width);
    this.miniMap.setAttribute("height", this.height * this.blockSize.height);
    this.miniMap.setAttribute("id", "miniMap");
    this.miniMap.setAttribute("style", stylePosition + "top:" + styleUpper + "left:" + styleLeft + styleBorder);

    var domElement = document.getElementById(this.parent);
    if (domElement[0] != "undefined") {
      domElement.removeChild[domElement[0]];
    }
    domElement.appendChild(this.miniMap);
  };

  //Penanda pada map
  this.draw = function (x, y, id) {
    if (id == 0) {
      //Jalan utama menuju End Point
      this.ctx.fillStyle = "white";
    } else if (id == "S") {
      //Start Point
      this.ctx.fillStyle = "rgb(0, 204, 0)";
      this.playerPosition = {
        x: x,
        y: y,
      };
    } else if (id == "E") {
      //End Point
      this.ctx.fillStyle = "rgb(76, 0, 153)";
    } else if (id == "P") {
      //Letak Point
      this.ctx.fillStyle = "rgb(255, 255, 0)";
    } else {
      // unexplored
      this.ctx.fillStyle = "rgb(32, 32, 32)";
    }

    this.ctx.fillRect(x * 5, y * 5, 5, 5);
  };

  //Jalan Map yang terjelajah selain jalan utama akan nampak setelah dilewati
  this.update = function (newPlayerPosition) {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.playerPosition.x * this.blockSize.width, this.playerPosition.y * this.blockSize.height, this.blockSize.width, this.blockSize.height);
    this.ctx.fillStyle = "rgb(0, 204, 0)";
    this.ctx.fillRect(newPlayerPosition.x * this.blockSize.width, newPlayerPosition.y * this.blockSize.height, this.blockSize.width, this.blockSize.height);
    this.playerPosition = newPlayerPosition;
  };
};
