var game = window.game || {};
game.GameHelper = game.GameHelper || {};

//Pengaturan default Kamera
game.GameHelper.CameraHelper = function(camera) {
    this.translation = 3.5;
    this.rotation = 0.025;
    this.origin = {
        position: {
            x: 0,
            y: 0,
            z: 0,
            mapX: 0,
            mapY: 0,
            mapZ: 0
        },
        x: 0,
        y: 0,
        z: 0
    };

    this.camera = camera;
};