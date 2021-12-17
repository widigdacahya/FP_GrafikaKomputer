/** @namespace */
var game = window.game || {};

game.Input = function() {
    this.keys = {
        up: false,
        down: false,
        left: false,
        right: false,

        a: false,
        d: false,
        s: false,
        w: false,
    };

    this.keyboardState = {
        current: null,
        last: null
    };

    var _this = this;


    this._onKeyboardDown = function(event) {
        _this._onKeyStateChange(event, true);
    };

    this._onKeyboardUp = function(event) {
        _this._onKeyStateChange(event, false);
    };

    document.addEventListener('keydown', this._onKeyboardDown, false);
    document.addEventListener('keyup', this._onKeyboardUp, false);
};

game.Input.prototype.destroy = function() {
    document.removeEventListener('keydown', this._onKeyboardDown, false);
    document.removeEventListener('keyup', this._onKeyboardUp, false);
};


game.Input.prototype._onKeyStateChange = function(event, pressed) {
    event.preventDefault();

    switch (event.keyCode) {
        case 37:
            this.keys.left = pressed;
            break; // Left
        case 38:
            this.keys.up = pressed;
            break; // UP
        case 39:
            this.keys.right = pressed;
            break; //Right
        case 40:
            this.keys.down = pressed;
            break; // Down
        case 65:
            this.keys.a = pressed;
            break; //  A
        case 68:
            this.keys.d = pressed;
            break; //  D
        case 83:
            this.keys.s = pressed;
            break; //  S
        case 87:
            this.keys.w = pressed;
            break; //  W

    }
};


game.Input.prototype.pressed = function(key) {
    return this.keys[key];
};