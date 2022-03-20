const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const siz = [10, 20] // Width, Height
const lockdelay = 500
let das = 120
let arr = 20
let sdr = 50
let shake = 0.95
const screensize = [window.innerHeight, window.innerWidth]
const magnitude = (screensize[0] / (siz[1] * 2))
const droprate = 500
let setkey = ""
//swap position and velocity
let velocity = [0, 0]
const sounds = {
   "combo": [
      [
         new Howl({ src: ["src/Audio/combo1_1.wav"] }),
         new Howl({ src: ["src/Audio/combo1_2.wav"] }),
         new Howl({ src: ["src/Audio/combo1_3.wav"] }),
         new Howl({ src: ["src/Audio/combo1_4.wav"] }),
         new Howl({ src: ["src/Audio/combo1_5.wav"] }),
         new Howl({ src: ["src/Audio/combo1_6.wav"] }),
         new Howl({ src: ["src/Audio/combo1_7.wav"] })
      ],
      [
         new Howl({ src: ["src/Audio/combo2_1.wav"] }),
         new Howl({ src: ["src/Audio/combo2_2.wav"] }),
         new Howl({ src: ["src/Audio/combo2_3.wav"] }),
         new Howl({ src: ["src/Audio/combo2_4.wav"] }),
         new Howl({ src: ["src/Audio/combo2_5.wav"] }),
         new Howl({ src: ["src/Audio/combo2_6.wav"] }),
         new Howl({ src: ["src/Audio/combo2_7.wav"] })
      ],
      [
         new Howl({ src: ["src/Audio/combo3_1.wav"] }),
         new Howl({ src: ["src/Audio/combo3_2.wav"] }),
         new Howl({ src: ["src/Audio/combo3_3.wav"] }),
         new Howl({ src: ["src/Audio/combo3_4.wav"] }),
         new Howl({ src: ["src/Audio/combo3_5.wav"] }),
         new Howl({ src: ["src/Audio/combo3_6.wav"] }),
         new Howl({ src: ["src/Audio/combo3_7.wav"] })
      ],
      [
         new Howl({ src: ["src/Audio/combo4_1.wav"] }),
         new Howl({ src: ["src/Audio/combo4_2.wav"] }),
         new Howl({ src: ["src/Audio/combo4_3.wav"] }),
         new Howl({ src: ["src/Audio/combo4_4.wav"] }),
         new Howl({ src: ["src/Audio/combo4_5.wav"] }),
         new Howl({ src: ["src/Audio/combo4_6.wav"] }),
         new Howl({ src: ["src/Audio/combo4_7.wav"] })
      ]

   ],
   "combobreak": new Howl({ src: ["src/Audio/combobreak.wav"] }),
   "hd": new Howl({ src: ["src/Audio/harddrop.wav"] }),
   "move": new Howl({ src: ["src/Audio/move.wav"] }),
   "move2": new Howl({ src: ["src/Audio/move2.wav"], volume: 0.25 }),
   "rotate": new Howl({ src: ["src/Audio/rotate.wav"] }),
   "hold": new Howl({ src: ["src/Audio/hold.wav"] })



}
function playsound(name, item = -1, item2 = -1) {
   if (item >= 0) {
      sounds[name][item][item2].play()
   } else {
      sounds[name].play()
   }
}

const newrow = new Array(siz[0]).fill(0)
const holdamount = 5
let keybinds = {
   "right": "ArrowRight",
   "left": "ArrowLeft",
   "sd": "ArrowDown",
   "hd": "Space",
   "r": "ArrowUp",
   "l": "KeyZ",
   "hold": "KeyC"

}
let softdrop = false
let softdroptime = 0
let vboard = []
let board = []
let hold = -1
let canhold = true
let start
let bag = [0, 1, 2, 3, 4, 5, 6]
let vnext = []
let position = [0, 0]
bag = shuffleArray([0, 1, 2, 3, 4, 5, 6])
bag = [...bag, ...shuffleArray([0, 1, 2, 3, 4, 5, 6])]
let keyheld = 0
let timedirpress = 0
let current = [[3, 2], getnext(), 0]
let prev = 0;
let elp;
let nextmovetime;
let isfloor = false
let timetouchedfloor = -1

// Score System
let score = 0
let multiplier = 1
let maxMul = 7

// Num of Elements
let elementNum = 0

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function waitButtonPress(e) {
   document.getElementById("startGameButton").addEventListener("click", () => {
      load()
   })
}
function setCookie(cname, cvalue, exdays) {
   const d = new Date();
   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
   let expires = "expires=" + d.toUTCString();
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(';');
   for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}
function keyup(e) {
   if (!play) {

      return
   }
   switch (e.code) {
      case keybinds["right"]:
         if (keyheld > 0) {
            keyheld = 0
         } break;
      case keybinds["left"]:
         if (keyheld < 0) {
            keyheld = 0
         } break;
      case keybinds["sd"]:
         softdrop = false
         break;
   }
}
function keydown(e) {
   if (!play) {
      if (!setkey == "") {
         setCookie(setkey, e.code, 1000)

         loadKeybinds()
         console.log(`ctrl${setkey}`)
         document.getElementById(`ctrl${setkey}`).innerHTML = e.code
         setkey = ""
      }
      return
   }
   let key = e.code
   switch (key) {
      case keybinds["r"]:
         rotstuff("r")
         break;
      case keybinds["sd"]:
         if (!softdrop) {
            softdrop = true
            softdroptime = elp
         }
         break;
      case keybinds["l"]:
         rotstuff("l")
         break;
      case keybinds["right"]:
         if (keyheld <= 0) {

            move("r")
         }
         break;
      case keybinds["left"]:
         if (keyheld >= 0) {
            move("l")
         }
         break;
      case keybinds["hold"]:
         if (canhold) {
            playsound("hold")
            canhold = false
            if (hold < 0) {
               hold = current[1]
               resetblock()

            } else {
               let temp = current[1]
               //hold=current
               current = [[3, 2], hold, 0]
               hold = temp
            }
         } else {

         }
         break;
      case keybinds["hd"]:
         let temp = hd()
         position[1] -= (temp[0][1] - current[0][1]) * (4 * shake)
         current = temp
         putblock(current)
         resetblock()
         checklineclear()
         canhold = true
         playsound("hd")
         break
   }
}
const blocks = {
   0: [
      [
         [0, 0, 0, 0],
         [1, 1, 1, 1],
         [0, 0, 0, 0],
         [0, 0, 0, 0]
      ], [
         [0, 0, 1, 0],
         [0, 0, 1, 0],
         [0, 0, 1, 0],
         [0, 0, 1, 0]
      ], [
         [0, 0, 0, 0],
         [0, 0, 0, 0],
         [1, 1, 1, 1],
         [0, 0, 0, 0]
      ], [
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0]
      ],
   ],
   1: [
      [
         [0, 2, 0],
         [2, 2, 2],
         [0, 0, 0]
      ], [
         [0, 2, 0],
         [0, 2, 2],
         [0, 2, 0]
      ], [
         [0, 0, 0],
         [2, 2, 2],
         [0, 2, 0]
      ], [
         [0, 2, 0],
         [2, 2, 0],
         [0, 2, 0]
      ],
   ],
   2: [
      [
         [3, 3, 0],
         [0, 3, 3],
         [0, 0, 0]
      ], [
         [0, 0, 3],
         [0, 3, 3],
         [0, 3, 0]
      ], [
         [0, 0, 0],
         [3, 3, 0],
         [0, 3, 3]
      ], [
         [0, 3, 0],
         [3, 3, 0],
         [3, 0, 0]
      ],
   ],

   3: [
      [
         [0, 4, 4],
         [4, 4, 0],
         [0, 0, 0]
      ], [
         [0, 4, 0],
         [0, 4, 4],
         [0, 0, 4]
      ], [
         [0, 0, 0],
         [0, 4, 4],
         [4, 4, 0]
      ], [
         [4, 0, 0],
         [4, 4, 0],
         [0, 4, 0]
      ],
   ],

   4: [
      [
         [5, 0, 0],
         [5, 5, 5],
         [0, 0, 0]
      ], [
         [0, 5, 5],
         [0, 5, 0],
         [0, 5, 0]
      ], [
         [0, 0, 0],
         [5, 5, 5],
         [0, 0, 5]
      ], [
         [0, 5, 0],
         [0, 5, 0],
         [5, 5, 0]
      ],
   ],
   5: [
      [
         [0, 0, 6],
         [6, 6, 6],
         [0, 0, 0]
      ], [
         [0, 6, 0],
         [0, 6, 0],
         [0, 6, 6]
      ], [
         [0, 0, 0],
         [6, 6, 6],
         [6, 0, 0]
      ], [
         [6, 6, 0],
         [0, 6, 0],
         [0, 6, 0]
      ],
   ],
   6: [
      [
         [0, 0, 0, 0],
         [0, 7, 7, 0],
         [0, 7, 7, 0],
         [0, 0, 0, 0]
      ], [
         [0, 0, 0, 0],
         [0, 7, 7, 0],
         [0, 7, 7, 0],
         [0, 0, 0, 0]
      ], [
         [0, 0, 0, 0],
         [0, 7, 7, 0],
         [0, 7, 7, 0],
         [0, 0, 0, 0]
      ], [
         [0, 0, 0, 0],
         [0, 7, 7, 0],
         [0, 7, 7, 0],
         [0, 0, 0, 0]
      ],
   ]
}
wallkick = [
   {
      "r": [
         [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
         [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
         [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
         [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
      ],
      "l": [
         [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
         [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
         [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
         [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
      ],
   },
   {
      "r": [
         [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
         [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
         [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
         [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, 2]],
      ],
      "l": [
         [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
         [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
         [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
         [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
      ],
   }
]
function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
   }
   return array
}
function getnext() {
   if (bag.length < 9) {
      bag = [...bag, ...shuffleArray([0, 1, 2, 3, 4, 5, 6])]

   }
   return bag.shift()
}
vhold = []
function loadhold() {
   let gridhtml = (size, x, y) => `<div class="empty" id="h${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`
   let outer = document.getElementById("hold")
   let content = ""
   for (let i = 0; i < 4; i++) {
      content += "<div class=\"row\">"
      for (let j = 0; j < 4; j++) {
         content += gridhtml(magnitude / 1.5, i, j)
      }
      content += "</div>"
   }
   outer.innerHTML = content
   for (let i = 0; i < 4; i++) {
      vhold.push([])
      for (let j = 0; j < 4; j++) {
         vhold[i].push(document.getElementById(`h${i} ${j}`))

      }

   }


}
function resetGame() {
   hold = -1
   bag = shuffleArray([0, 1, 2, 3, 4, 5, 6])
   bag = [...bag, ...shuffleArray([0, 1, 2, 3, 4, 5, 6])]
   for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
         board[y][x] = 0
      }
   }
   lineClearSum = 0
   combocount = 0
   current = [[3, 2], getnext(), 0]
   rendnext()
   rendhold()
   score = 0
   updateDataLabels()

   endgame = false
   play = true

}
function loadnext() {
   let gridhtml = (size, x, y, n) => `<div class="empty" id="n${n} ${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`
   let outer = document.getElementById("next")
   let content = ""
   for (let n = 0; n < 5; n++) {
      content += "<div>"
      for (let y = 0; y < 4; y++) {
         content += "<div class=\"row\">"
         for (let x = 0; x < 4; x++) {
            content += gridhtml(magnitude / 1.5, x, y, n)
         }
         content += "</div>"
      }
      content += "</div>"
   }
   outer.innerHTML = content
   for (let n = 0; n < 5; n++) {
      vnext.push([])
      for (let y = 0; y < 4; y++) {
         vnext[n].push([])
         for (let x = 0; x < 4; x++) {
            vnext[n][y].push(document.getElementById(`n${n.toString().charAt(0)} ${x} ${y}`))
         }
      }
   }
}

function setDefaultKeybinds() {
   for (let key of Object.keys(keybinds)) {
      setCookie(key, keybinds[key], 1000)

   }

}
function loadKeybinds() {
   for (let key of Object.keys(keybinds)) {
      keybinds[key] = getCookie(key)
      document.getElementById(`ctrl${key}`).innerHTML = keybinds[key]
   }
   console.log(keybinds)

}
function setDefaultSettings() {
   setCookie("das", das, 1000)
   setCookie("sdr", sdr, 1000)
   setCookie("arr", arr, 1000)
   setCookie("shake", 0.95, 1000)
}
function loadSettings() {
   das = parseInt(getCookie("das"))
   sdr = parseInt(getCookie("sdr"))
   arr = parseInt(getCookie("arr"))
   shake = parseFloat(getCookie("shake"))
   console.log(das, sdr, arr, shake)

}
let play = false
function load() {
   if (getCookie("hold") == "") {
      setDefaultKeybinds()
      setDefaultSettings()
      console.log(keybinds)
      settingsOnStartup()
   }
   loadKeybinds()
   loadSettings()
   console.log(keybinds)

   gridhtml = (size, x, y) => `<div class="grid " id="${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`

   let outer = document.getElementById("board")
   let content = ""
   for (let i = 0; i < siz[1]; i++) {
      content += "<div class=\"row\">"
      for (let j = 0; j < siz[0]; j++) {
         content += gridhtml(magnitude, i, j)
      }
      content += "</div>"
   }
   outer.innerHTML = content
   for (let i = 0; i < siz[1] + 5; i++) {
      if (i < siz[1]) {
         vboard.push([])
      }
      board.push([])
      for (let j = 0; j < siz[0]; j++) {
         board[i].push(0)
         if (i < siz[1]) {
            vboard[i].push(document.getElementById(`${i} ${j}`))
         }
      }

   }

   console.log(board, vboard)
   loadhold()
   loadnext()
   play = true

   setpad()
   updateDataLabels()

   window.requestAnimationFrame(loop)

}
let paddingsize = magnitude * 2
function setpad() {
   padding = {
      "top": document.getElementById("motionTop"),
      "bottom": document.getElementById("motionBottom"),
      "right": document.getElementById("motionRight"),
      "left": document.getElementById("motionLeft"),
   }
   console.log(padding)
   padding["top"].style.height = `${paddingsize}px`
   padding["bottom"].style.height = `${paddingsize}px`

   padding["right"].style.width = `${paddingsize * 2}px`
   padding["left"].style.width = `${paddingsize * 2}px`
}
let padding = {
}

function setposition(pos) {
   let size = paddingsize
   padding["top"].style.height = `${size - pos[1]}px`
   padding["bottom"].style.height = `${size + pos[1]}px`
   padding["left"].style.width = `${(size + pos[0]) * 2}px`
   padding["right"].style.width = `${(size - pos[0]) * 2}px`
}
function hd() {
   let temp = current
   while (true) {
      if (!checkpos(temp)) {

         return [[temp[0][0], temp[0][1] - 1], temp[1], temp[2]]

      }
      temp = [[temp[0][0], temp[0][1] + 1], temp[1], temp[2]]
   }
}
function move(dir) {
   if (dir == "r") {
      keyheld = 1
   } else {
      keyheld = -1
   }
   timedirpress = elp
   let temp = [[current[0][0] + keyheld, current[0][1]], current[1], current[2]]
   if (checkpos(temp)) {
      playsound("move")
      current = temp
      timetouchedfloor = elp
   } else {
      position[0] += keyheld * (8 * shake)
   }

}
function checkpos(cur) {
   shape = blocks[cur[1]][cur[2]]
   for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
         if (shape[i][j] != 0) {
            let posib = [cur[0][0] + j, cur[0][1] + i]
            if (posib[0] < 0 || posib[1] < 0 || posib[0] >= siz[0] || posib[1] >= siz[1] + 5) {
               return false
            } else if (board[posib[1]][posib[0]] != 0) {
               return false
            }
         }
      }
   }
   return true;
}
function rotate(cur, dir) {
   let kickl = []
   if (cur[1] == 6) {
      playsound("rotate")
      return [true, cur]
   } else if (cur[1] == 0) {
      kickl = wallkick[0][dir][cur[2]]
   } else {
      kickl = wallkick[1][dir][cur[2]]
   }
   if (dir == "r") {
      dir = 1;
   } else {
      dir = -1;
   }
   for (let i = 0; i < kickl.length; i++) {
      let tempcur = [[cur[0][0] + kickl[i][0], cur[0][1] - kickl[i][1]], cur[1], (4 + cur[2] + dir) % 4]
      if (checkpos(tempcur)) {

         playsound("rotate")
         return [true, tempcur]
      }
   }
   return [false, cur]

}
function putblock(cur) {

   console.log(JSON.parse(JSON.stringify(board)))
   shape = blocks[cur[1]][cur[2]]
   for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {

         if (shape[i][j] != 0) {
            let posib = [cur[0][0] + j, cur[0][1] + i]

            console.log(JSON.parse(JSON.stringify(posib)), JSON.parse(JSON.stringify(board[posib[1]][posib[0]])), JSON.parse(JSON.stringify(cur)))
            board[posib[1]][posib[0]] = shape[i][j]
         }
      }
   }
   console.log(JSON.parse(JSON.stringify(board)))

}
let joinshapes = true
function rend(cur) {
   for (let i = 5; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
         if (board[i][j] == 0) {
            vboard[i - 5][j].className = "grid"
         } else {
            if (!endgame) {
               let classes = `grid b${board[i][j]}`
               if (i > 0 && board[i - 1][j] != board[i][j]) {
                  classes += " bt"
               }
               if (i < board.length - 1 && board[i + 1][j] != board[i][j]) {
                  classes += " bb"
               }
               if (j > 0 && board[i][j - 1] != board[i][j]) {
                  classes += " bl"
               }
               if (j < board[0].length - 1 && board[i][j + 1] != board[i][j]) {
                  classes += " br"
               }
               vboard[i - 5][j].className = classes
               console.log(classes)
            } else {
               vboard[i - 5][j].className = `grid b${0}`

            }
         }
      }
   }
   let h = hd()
   shape = blocks[h[1]][h[2]]
   for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
         if (shape[i][j] != 0) {
            let posib = [h[0][0] + j, h[0][1] + i - 5]
            if (posib[1] >= 0) {
               vboard[posib[1]][posib[0]].className = `grid ho`

            }
         }
      }
   }
   if (!endgame) {
      shape = blocks[cur[1]][cur[2]]
      for (let i = 0; i < shape.length; i++) {
         for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] != 0) {
               let posib = [cur[0][0] + j, cur[0][1] + i - 5]
               if (posib[1] >= 0) {
                  if (!endgame) {
                     vboard[posib[1]][posib[0]].className = `grid b${shape[i][j].toString().charAt(0)}`
                  } else {
                     vboard[posib[1]][posib[0]].className = `grid b${0}`

                  }

               }
            }
         }
      }
   }
   rendhold()
   rendnext()


}
function rendhold() {
   if (hold == -1) {
      for (let i = 0; i < vhold.length; i++) {
         for (let j = 0; j < vhold[0].length; j++) {
            vhold[i][j].className = 'grid empty'
         }
      }
      return
   }
   shape = blocks[hold][0]
   for (let i = 0; i < vhold.length; i++) {
      for (let j = 0; j < vhold[0].length; j++) {
         vhold[i][j].className = 'grid empty'
      }
   }
   for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
         if (shape[i][j] != 0) {
            let posib = [j, i]
            if (posib[1] >= 0) {
               vhold[posib[1]][posib[0]].className = `grid b${shape[i][j]}`
               vhold[posib[1]][posib[0]].style.opacity = "1"
               if (!canhold) {
                  vhold[posib[1]][posib[0]].style.opacity = "0.5"
               }
            }
         }
      }
   }
}
function rendnext() {
   for (let n = 0; n < vnext.length; n++) {
      for (let i = 0; i < vnext[0].length; i++) {
         for (let j = 0; j < vnext[0][0].length; j++) {
            vnext[n][i][j].className = 'grid empty'
         }
      }
   }
   for (let n = 0; n < vnext.length; n++) {
      shape = blocks[bag[n]][0]
      for (let i = 0; i < shape.length; i++) {
         for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] != 0) {
               let posib = [j, i]
               if (posib[1] >= 0) {
                  vnext[n][posib[1]][posib[0]].className = `grid b${shape[i][j]}`
               }
            }
         }
      }
   }
}
let combocount = 0
let lineClearSum = 0
let endgame = false
function checklineclear() {
   let i = 0
   let linecleared = 0
   while (i < board.length) {
      if (!board[i].includes(0)) {
         linecleared += 1
         board.splice(i, 1)
         board.unshift(JSON.parse(JSON.stringify(newrow)))
         score += 10 + (combocount * 5)
         if (multiplier == maxMul) {
            multiplier += 1
         }
      }
      i++
   }
   elementNum += 1
   lineClearSum += linecleared
   if (linecleared > 0) {
      combocount += 1
      if (combocount < 8) {
         playsound("combo", linecleared - 1, combocount - 1)
      } else {
         playsound("combo", linecleared - 1, 6)
      }
   } else {
      if (combocount > 3) {
         playsound("combobreak")
      }

      combocount = 0


   }
   if (board[4].reduce((a, b) => a + b, 0) != 0) {

      play = false
      endgame = true


      console.log("DIE")
   }
   updateDataLabels()
}
function rotstuff(dir) {
   let temp = rotate(current, dir)
   if (temp[0]) {
      timetouchedfloor = elp
      current = temp[1]
   }
}
function resetblock() {
   current = [[3, 2], getnext(), 0]
   softdroptime = elp
   isfloor = false
   timetouchedfloor = -1
   nextmovetime += droprate
}
let lastpaused = 0
function tgplay() {
   play = !play
   if (play) {
      console.log(elp, lastpaused)
      start = start + (actualelp - elp)
      console.log(start)
   }
   return play
}
let actualelp = 0
function displayFPS(dt) {
   document.getElementById("FPS").innerHTML = (1 / dt).toFixed(2)
}
function loop(timestamp) {
   if (start == undefined) {
      start = timestamp
      nextmovetime = droprate
   }

   actualelp = timestamp - start
   if (play) {
      elp = timestamp - start;
      let deltatime = (elp - prev) / 100
      position = [(position[0] * 0.9), (position[1] * 0.9)];
      position = [(position[0] - (velocity[0] * 0.1)), position[1] - (velocity[1] * 0.1)];
      if (Math.abs(position[0]) < 0.01) { position[0] = 0 }
      if (Math.abs(position[1]) < 0.01) { position[1] = 0 }
      if (Math.abs(velocity[0]) < 0.01) { velocity[0] = 0 }
      if (Math.abs(velocity[0]) < 0.01) { velocity[0] = 0 }
      velocity = [velocity[0] + position[0] * deltatime, velocity[1] + position[1] * deltatime]
      displayFPS(deltatime / 10)
   }
   setposition(velocity)

   if (!softdrop && elp - nextmovetime >= droprate) {
      //drop the block one
      while ((!softdrop && elp - nextmovetime >= droprate)) {

         if (checkpos([[current[0][0], current[0][1] + 1], current[1], current[2]])) {
            //move down
            playsound("move2")
            current[0][1] += 1
            isfloor = false

         } else {
            if (!isfloor) {
               isfloor = true
               timetouchedfloor = elp + 0
               break
            }
         }
         nextmovetime += droprate
      }
   } else {
      while (softdrop && elp - softdroptime > sdr) {
         if (checkpos([[current[0][0], current[0][1] + 1], current[1], current[2]])) {
            //move down
            playsound("move")
            current[0][1] += 1
            isfloor = false

         } else {
            if (!isfloor) {
               isfloor = true
               timetouchedfloor = elp + 0
               break
            } else {
               position[1] -= 3
            }
         }
         softdroptime += sdr
      }
   }

   while (keyheld != 0 && elp - timedirpress > das) {
      timedirpress += arr
      let temp = [[current[0][0] + keyheld, current[0][1]], current[1], current[2]]
      if (checkpos(temp)) {
         playsound("move")
         current = temp
         timetouchedfloor = elp
      } else {
         position[0] += keyheld * (10 * shake)
      }
   }
   if (isfloor && elp - timetouchedfloor > lockdelay) {
      putblock(current)
      resetblock()
      checklineclear()
      canhold = true
   }
   if (elp - prev > 1000) {
      console.log("wierd time diff")
   }
   prev = elp + 0

   rend(current)
   window.requestAnimationFrame(loop)
}
function updateDataLabels() {
   document.getElementById("Combo").innerHTML = combocount
   console.log(lineClearSum)
   document.getElementById("linesCleared").innerHTML = lineClearSum
   document.getElementById("score").innerHTML = `Score: ${score}`
}

document.addEventListener("visibilitychange", (event) => {
   if (document.visibilityState == "visible") {
      tgplay()
   } else {
      tgplay()
   }
});
