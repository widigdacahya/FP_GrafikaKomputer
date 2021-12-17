// var width = window.innerWidth * 0.995;
// var height = window.innerHeight * 0.995;
var width = window.innerWidth;
var height = window.innerHeight;
var canvasContainer = document.getElementById("canvasContainer");
var renderer, camera, scene;
var input, miniMap, cameraHelper;
var map = new Array();
var running = true;
var scale = 1;
var score = 0;
var poin = [];
var mouse = { x: 0, y: 0 };
var finishDoor;

function touchStarted() {
  getAudioContext().resume();
}

//starting game
function start() {
  initializeScene();
  mainLoop();
}

window.onload = function () {
  initializeEngine();
  loadMap();
};
//Inisiaisasi scene
function initializeEngine() {
  //renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(width, height);
  //   renderer.body.appendChild(renderer.domElement);
  renderer.clear();

  //Kabut

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x1a1a1a, 10, 250);

  //Kamera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.y = 50;
  camera.rotation.order = "YXZ"; // this is not the default
  scene.add(camera);

  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  const sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("assets/sound/forest.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.7);
    sound.play();
  });

  const ambLight = new THREE.AmbientLight(0x000000); // soft white light
  scene.add(ambLight);

  //LightPoint jadi child Kamera
  const light = new THREE.PointLight(0xffffff, 1, 300);
  camera.add(light);

  document.getElementById("canvasContainer").appendChild(renderer.domElement);

  //Pengaturan Kamera
  input = new game.Input();
  cameraHelper = new game.GameHelper.CameraHelper(camera);

  window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // //Pointer Lock Controls
  // canvasContainer.requestPointerLock = canvasContainer.requestPointerLock;
  // document.exitPointerLock = document.exitPointerLock;
  // canvasContainer.onclick = function () {
  //   canvasContainer.requestPointerLock();
  // };
  // document.addEventListener("pointerlockchange", lockChangeAlert, false);

  // function lockChangeAlert() {
  //   if (document.pointerLockElement === canvasContainer) {
  //     console.log("The pointer lock status is now locked");
  //     document.addEventListener("mousemove", moveCamera, false);
  //   } else {
  //     console.log("The pointer lock status is now unlocked");
  //     document.removeEventListener("mousemove", moveCamera, false);
  //   }
  // }

  // document.addEventListener("click", function (e) {
  //   e.preventDefault;
  // });

  showText_1();
}

var scored;

function showText_1() {
  // alert("Happy Playing");

  var messageContainer = document.createElement("div");
  messageContainer.style.position = "absolute";
  messageContainer.style.backgroundColor = "#666";
  messageContainer.style.border = "1px solid #333";

  var message = document.createElement("h1");
  // message.innerHTML = "Use W/A/S/D to move and arrow left/right rotate the camera. Click to enter fps mode";
  message.innerHTML = "Use W/A/S/D to move and arrow left/right rotate the camera. Get the poin to increase your score";
  message.style.textAlign = "center";
  message.style.color = "#ddd";
  message.style.padding = "15px";

  messageContainer.appendChild(message);

  document.body.appendChild(messageContainer);

  messageContainer.style.left = window.innerWidth / 2 - messageContainer.offsetWidth / 2 + "px";
  messageContainer.style.top = window.innerHeight / 2 - messageContainer.offsetHeight / 2 + "px";

  var timer = setTimeout(function () {
    clearTimeout(timer);
    document.body.removeChild(messageContainer);
  }, 3500);

  var ScoreContainer = document.createElement("div");
  ScoreContainer.style.position = "absolute";
  ScoreContainer.style.display = "flex";

  var Score = document.createElement("h4");
  Score.innerHTML = "score";
  Score.style.textAlign = "center";
  Score.style.color = "#ddd";
  Score.style.padding = "10px";
  Score.style.background = "#000";

  var Scoring = document.createElement("h4");
  Scoring.innerHTML = "0";
  Scoring.style.textAlign = "center";
  Scoring.style.color = "#ddd";
  Scoring.style.padding = "10px";
  Scoring.style.background = "#000";

  scored = Scoring;

  ScoreContainer.appendChild(Score);
  ScoreContainer.appendChild(Scoring);
  document.body.appendChild(ScoreContainer);

  ScoreContainer.style.left = width / 2 - ScoreContainer.offsetWidth / 2 + "px";
  ScoreContainer.style.top = height / 7 - ScoreContainer.offsetHeight / 2 + "px";
}

function initializeScene() {
  //Membuat Minimap

  miniMap = new game.Gui.MiniMap(map[0].length, map.length, "canvasContainer");
  miniMap.create();

  //Create Alas Plane
  var loader = new THREE.TextureLoader();

  var platformWidth = map[0].length * 100; //Alas dikali 100 karena tiap wall memiliki size 100
  var platformHeight = map.length * 100;

  var floorGeometry = new THREE.BoxGeometry(platformWidth, 5, platformHeight);
  var alas = new THREE.Mesh(
    floorGeometry,
    new THREE.MeshPhongMaterial({
      map: loader.load("assets/images/textures/Dirt.jpg"),
    })
  );
  alas.receiveShadow = true;
  repeatTexture(alas.material.map, 2);

  alas.position.set(-50, 1, -50);
  scene.add(alas);

  //Skybox
  let loaderBgBox = new THREE.CubeTextureLoader();
  let skyBoxBg = loaderBgBox.load([
    "assets/images/textures/posx.png",
    "assets/images/textures/negx.png",
    "assets/images/textures/posy.png",
    "assets/images/textures/negy.png",
    "assets/images/textures/posz.png",
    "assets/images/textures/negz.png",
  ]);
  let skyBoxBgDarker = loaderBgBox.load([
    "assets/images/textures/posX-j.jpg",
    "assets/images/textures/negX-j.jpg",
    "assets/images/textures/posY-j.jpg",
    "assets/images/textures/negY-j.jpg",
    "assets/images/textures/posZ-j.jpg",
    "assets/images/textures/negZ-j.jpg",
  ]);
  scene.background = skyBoxBgDarker;

  //Membuat Wall, Pada map Wall memiliki value 2
  var size = {
    x: 100,
    y: 100,
    z: 100,
  };

  var position = {
    x: 0,
    y: 0,
    z: 0,
  };

  var wallGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  var wallMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("assets/images/textures/dark-brick.jpg"),
  });

  repeatTexture(wallMaterial.map, 4);

  // Map generation
  for (var y = 0, ly = map.length; y < ly; y++) {
    for (var x = 0, lx = map[x].length; x < lx; x++) {
      position.x = -platformWidth / 2 + size.x * x;
      position.y = 50;
      position.z = -platformHeight / 2 + size.z * y;

      //Start disini misal tidak didefinisikan start awal di map
      if (x == 0 && y == 0) {
        cameraHelper.origin.x = position.x;
        cameraHelper.origin.y = position.y;
        cameraHelper.origin.z = position.z;
      }

      //Array Map bernilai 2 diberi wall
      if (map[y][x] > 1) {
        var wall3D = new THREE.Mesh(wallGeometry, wallMaterial);
        wall3D.position.set(position.x, position.y, position.z);
        scene.add(wall3D);
      }

      //map Awal(Starting Point)
      if (map[y][x] === "S") {
        camera.position.set(position.x, position.y, position.z);
        cameraHelper.origin.position.x = position.x;
        cameraHelper.origin.position.y = position.y;
        cameraHelper.origin.position.z = position.z;
        cameraHelper.origin.position.mapX = x;
        cameraHelper.origin.position.mapY = y;
        cameraHelper.origin.position.mapZ = 0;
      }

      //Membuat poin reflective

      //letak Poin
      if (map[y][x] === "P") {
        const radius = 10.0;
        const detail = 5;
        let ball = new THREE.Mesh(
          new THREE.DodecahedronGeometry(radius, detail),
          new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 150,
            envMap: skyBoxBg,
          })
        );
        ball.castShadow = true;
        ball.position.set(position.x, position.y - 25, position.z);
        poin.push(ball);
        scene.add(ball);
      }

      // pertanda endpoint
      if (map[y][x] === "E") {
        finishDoor = new THREE.Mesh(
          new THREE.OctahedronGeometry(40, 0),
          new THREE.MeshPhongMaterial({
            envMap: skyBoxBgDarker,
          })
        );
        finishDoor.castShadow = true;
        finishDoor.position.set(position.x, position.y - 15, position.z);

        scene.add(finishDoor);
      }

      //Generate minimap

      miniMap.draw(x, y, map[y][x]);
    }
  }
}

//movement
function update() {
  if (input.keys.w) {
    moveCamera("up");
  } else if (input.keys.s) {
    moveCamera("down");
  }

  if (input.keys.a) {
    moveCamera("left");
  } else if (input.keys.d) {
    moveCamera("right");
  }

  if (input.keys.left) {
    moveCamera("cameraleft");
  } else if (input.keys.right) {
    moveCamera("cameraright");
  }

  if (input.keys.up) {
    moveCamera("cameraup");
  } else if (input.keys.down) {
    moveCamera("camerabelow");
  }
}

//Pengaturan Score
function setScore(newscore) {
  score = newscore;
  scored.innerHTML = newscore;
}

//Pergerakan kamera
function moveCamera(direction, num, delta) {
  var collides = false;
  var position = {
    x: camera.position.x,
    z: camera.position.z,
  };
  var rotationY = camera.rotation.y;
  var rotationX = camera.rotation.x;
  var rotationZ = camera.rotation.z;

  if (num == 1) var offset = 50;
  else var offset = 40;

  var moveParameters = {
    translation: typeof delta != "undefined" ? delta.translation : cameraHelper.translation,
    rotation: typeof delta != "undefined" ? delta.rotation : cameraHelper.rotation,
  };

  switch (direction) {
    case "up":
      position.x -= Math.sin(-camera.rotation.y) * -moveParameters.translation;
      position.z -= Math.cos(-camera.rotation.y) * moveParameters.translation;
      break;
    case "down":
      position.x -= Math.sin(camera.rotation.y) * -moveParameters.translation;
      position.z += Math.cos(camera.rotation.y) * moveParameters.translation;
      break;
    case "left":
      position.x += Math.cos(camera.rotation.y) * -moveParameters.translation;
      position.z += Math.sin(camera.rotation.y) * moveParameters.translation;
      break;
    case "right":
      position.x -= Math.cos(camera.rotation.y) * -moveParameters.translation;
      position.z -= Math.sin(camera.rotation.y) * moveParameters.translation;
      break;
    case "cameraleft":
      rotationY += moveParameters.rotation;
      break;
    case "cameraright":
      rotationY -= moveParameters.rotation;
      break;

    // mau kamerannya bisa liat atas bawah [belum bisa]
    case "cameraup":
      rotationZ -= moveParameters.rotation;
      break;
    case "camerabelow":
      rotationZ += moveParameters.rotation;
      break;
    // case "cameraRotation":
    //     break;
  }

  // Current position on the map
  var tx = Math.abs(Math.floor((cameraHelper.origin.x + camera.position.x * -1) / 100));
  var ty = Math.abs(Math.floor((cameraHelper.origin.z + camera.position.z * -1) / 100));

  // next position
  var newTx = Math.abs(Math.floor((cameraHelper.origin.x + position.x * -1 + offset) / 100));
  var newTy = Math.abs(Math.floor((cameraHelper.origin.z + position.z * -1 + offset) / 100));

  // Menjaga agar tidak keluar map
  if (newTx >= map[0].length) {
    newTx = map[0].length;
  }
  if (newTx < 0) {
    newTx = 0;
  }
  if (newTy >= map.length) {
    newTy = map.length;
  }
  if (newTy < 0) {
    newTy = 0;
  }

  //Jika posisi player ada di map bervalue selain 1 dan 0
  //Map bernilai 1 dan 0 adalah jalan pada maze
  if (map[newTy][newTx] != 1 && map[newTy][newTx] != 0 && !isNaN(map[newTy][newTx])) {
    collides = true;
  } else if (map[newTy][newTx] == "E") {
    // Jika sampai pada End Point maka tidak dapat bergerak
    running = false;
  }

  //Pergerakan hanya terjadi jika nilai collides false
  if (collides == false) {
    camera.rotation.y = rotationY;
    camera.rotation.x = rotationX;
    camera.position.x = position.x;
    camera.position.z = position.z;

    miniMap.update({
      x: newTx,
      y: newTy,
    });
  } else {
    //nabrak
  }

  //Penghitungan Score saat Event mengambil Poin
  for (var i = poin.length - 1; i >= 0; i--) {
    var a = poin[i];

    if (camera.position.x - 40 <= a.position.x && a.position.x <= camera.position.x + 40 && camera.position.z - 40 <= a.position.z && a.position.z <= camera.position.z + 40) {
      score = score + 1;
      a.position.x += 1000;
      setScore(score);
      scene.remove(a);
      // play soundeffect
      // create an AudioListener and add it to the camera
      const listenerPoin = new THREE.AudioListener();
      camera.add(listenerPoin);

      // create a global audio source
      const soundPoin = new THREE.Audio(listenerPoin);

      // load a sound and set it as the Audio object's buffer
      const audioPoinLoader = new THREE.AudioLoader();
      audioPoinLoader.load("assets/sound/coin.mp3", function (buffer) {
        soundPoin.setBuffer(buffer);
        soundPoin.setLoop(false);
        soundPoin.setVolume(0.7);
        soundPoin.play();
      });
    }
  }
}

function timeFunction() {
  setTimeout(function () {
    window.location.href = "endgame.html";
  }, 4500);
}
//Loop
function mainLoop(time) {
  if (running) {
    // finishDoor.rotation.x += 3;
    update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(mainLoop, renderer.domElement);
  } else {
    gameFinish();
    timeFunction();
  }
}

//Jika sampai Finish
function gameFinish() {
  var messageContainer = document.createElement("div");
  messageContainer.style.position = "absolute";
  messageContainer.style.backgroundColor = "#666";
  messageContainer.style.border = "1px solid #333";
  messageContainer.style.justifyContent = "center";
  messageContainer.style.alignItems = "center";
  messageContainer.style.textAlign = "center";

  var message = document.createElement("h1");
  message.innerHTML = "Congratulationnn, Your Score is : " + String(score);
  message.style.textAlign = "center";
  message.style.color = "#ddd";
  message.style.padding = "15px";

  messageContainer.appendChild(message);
  //messageContainer.appendChild(button);

  document.body.appendChild(messageContainer);

  messageContainer.style.left = window.innerWidth / 2 - messageContainer.offsetWidth / 2 + "px";
  messageContainer.style.top = window.innerHeight / 2 - messageContainer.offsetHeight / 2 + "px";
  var timer = setTimeout(function () {
    clearTimeout(timer);
    document.body.removeChild(messageContainer);
  }, 3500);
}

var incrementoX = Math.PI / (window.innerWidth / 2);
var incrementoY = Math.PI / (window.innerHeight / 2);
var angleX = 0;
var angleY = 0;

//Maps Open
function loadMap() {
  var r = Math.floor(Math.random() * 3) + 1;
  var ajax = new XMLHttpRequest();
  ajax.open("GET", "assets/maps/maze3d-" + r + ".json", true);
  ajax.onreadystatechange = function () {
    if (ajax.readyState == 4) {
      map = JSON.parse(ajax.responseText);
      start();
    }
  };
  ajax.send(null);
}

//Texture Repeat
function repeatTexture(texture, size) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = size;
  texture.repeat.y = size;
  return texture;
}
