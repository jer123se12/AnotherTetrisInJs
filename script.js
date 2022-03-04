const siz=[10,20]
const lockdelay=500
const das=120
const arr=20
const screensize = [window.innerHeight,window.innerWidth];
const magnitude=(Math.min(...screensize)/(Math.max(...siz)*2))
const droprate=50
const keybinds={
   "right"  :  "KeyD",
   "left"   :  "KeyA",
   "sd"     :  "KeyS",
   "hd"     :  "KeyW",
   "r"      :  "KeyK",
   "l"      :  "KeyL"

}
var vboard=[]
var board=[]
var start;
var bag=[0,1,2,3,4,5,6]
bag=shuffleArray([0,1,2,3,4,5,6])
bag=[...bag,...shuffleArray([0,1,2,3,4,5,6])]
var keyheld=0
var timedirpress=0
const newrow=new Array(siz[0]).fill(0)
document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
function keyup(e){
   switch (e.code){
      case keybinds["right"]:
         if (keyheld>0){
            keyheld=0
         }break;
      case keybinds["left"]:
         if (keyheld<0){
            keyheld=0
         }break;
   }
}
function keydown(e){
   let key=e.code
   switch (key){
      case keybinds["r"]:
         console.log("hiii")
         rotstuff("r")
         break;
      case keybinds["l"]:
         rotstuff("l")
         break;
      case keybinds["right"]:
         move("r")
         break;
      case keybinds["left"]:
         move("l")
         break;
   }
}
blocks={
    0:[
        [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],[
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
        ],[
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ],[
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ],
    ],
    1:[
        [
            [0,2,0],
            [2,2,2],
            [0,0,0]
        ],[
            [0,2,0],
            [0,2,2],
            [0,2,0]
        ],[
            [0,0,0],
            [2,2,2],
            [0,2,0]
        ],[
            [0,2,0],
            [2,2,0],
            [0,2,0]
        ],
    ],
    2:[
        [
            [3,3,0],
            [0,3,3],
            [0,0,0]
        ],[
            [0,0,3],
            [0,3,3],
            [0,3,0]
        ],[
            [0,0,0],
            [3,3,0],
            [0,3,3]
        ],[
            [0,3,0],
            [3,3,0],
            [3,0,0]
        ],
    ],

    3:[
        [
            [0,4,4],
            [4,4,0],
            [0,0,0]
        ],[
            [0,4,0],
            [0,4,4],
            [0,0,4]
        ],[
            [0,0,0],
            [0,4,4],
            [4,4,0]
        ],[
            [4,0,0],
            [4,4,0],
            [0,4,0]
        ],
    ],

    4:[
        [
            [5,0,0],
            [5,5,5],
            [0,0,0]
        ],[
            [0,5,5],
            [0,5,0],
            [0,5,0]
        ],[
            [0,0,0],
            [5,5,5],
            [0,0,5]
        ],[
            [0,5,0],
            [0,5,0],
            [5,5,0]
        ],
    ],
    5:[
        [
            [0,0,6],
            [6,6,6],
            [0,0,0]
        ],[
            [0,6,0],
            [0,6,0],
            [0,6,6]
        ],[
            [0,0,0],
            [6,6,6],
            [6,0,0]
        ],[
            [6,6,0],
            [0,6,0],
            [0,6,0]
        ],
    ],
    6:[
        [
            [0,0,0,0],
            [0,7,7,0],
            [0,7,7,0],
            [0,0,0,0]
        ],[
            [0,0,0,0],
            [0,7,7,0],
            [0,7,7,0],
            [0,0,0,0]
        ],[
            [0,0,0,0],
            [0,7,7,0],
            [0,7,7,0],
            [0,0,0,0]
        ],[
            [0,0,0,0],
            [0,7,7,0],
            [0,7,7,0],
            [0,0,0,0]
        ],
    ]
}
wallkick=[
{
   "r":[
      [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
      [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
      [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
      [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
      ],
   "l":[
      [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
      [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
      [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
      [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
      ],
},
{
   "r":[
      [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
      [[0,0],[1,0],[1,-1],[0,2],[1,2]],
      [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
      [[0,0],[-1,0],[-1,-1],[0,+2],[-1,2]],
      ],
   "l":[
      [[0,0],[1,0],[1,-1],[0,2],[1,2]],
      [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
      [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
      [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
      ],
}
]

function shuffleArray(array) {
   for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
   }
   return array
}
function getnext(){
   if (bag.length<9){
      bag=[...bag,...shuffleArray([0,1,2,3,4,5,6])]
       
   }
   return bag.shift()
}
function load(){
    gridhtml=(size,x,y)=>`<div class="grid " id="${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`

    let outer=document.getElementById("board")
    var content=""
    for (var i=0;i<siz[1];i++){
        content+="<div class=\"row\">"
        for (var j=0;j<siz[0];j++){
            content+=gridhtml(magnitude,i,j)
        }
        content+="</div>"
    }
    outer.innerHTML=content
    for (var i=0;i<siz[1]+5;i++){
        vboard.push([])
        board.push([])
        for (var j=0;j<siz[0];j++){
            board[i].push(0)
            if (i<siz[1]){
            vboard[i].push(document.getElementById(`${i} ${j}`))
            }
        }

    }
    console.log(board,vboard)

}

function move(dir){
   if (dir=="r"){
      keyheld=1
   }else{
      keyheld=-1
   }
   timedirpress=elp
   let temp=[[current[0][0]+keyheld,current[0][1]],current[1],current[2]]
   if (checkpos(temp)){
      current=temp
   }
   
}
function checkpos(cur){
   shape=blocks[cur[1]][cur[2]]
   for (var i=0;i<shape.length;i++){
      for (var j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[cur[0][0]+j,cur[0][1]+i]
            if (posib[0]<0 || posib[1]<0 || posib[0]>=siz[0] || posib[1]>=siz[1]+5 ){
               return false
            }else if (board[posib[1]][posib[0]]!=0){
               return false
            }
         }
      }
   }
   return true;
}
function rotate(cur,dir){
   var kickl=[]
   if (cur[1]==6){
   return [true,cur]
   }else if (cur[1]==0){
      kickl=wallkick[0][dir][cur[2]]
   }else{
      kickl=wallkick[1][dir][cur[2]]
   }
   if (dir=="r"){dir=1;
   }else{dir=-1;
   }
   for (var i=0;i<kickl.length;i++){
      let tempcur=[[cur[0][0]+kickl[i][0],cur[0][1]+kickl[i][1]],cur[1],(4+cur[2]+dir)%4]
      if (checkpos(tempcur)){
         return [true,tempcur]
      }
   }
   return [false,cur]

}
function putblock(cur){
   shape=blocks[cur[1]][cur[2]]
   for (var i=0;i<shape.length;i++){
      for (var j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[cur[0][0]+j,cur[0][1]+i]
               board[posib[1]][posib[0]]=shape[i][j]+0
         }
      }
   }


}
function rend(cur){
   for (var i=5;i<board.length;i++){
      for (var j=0; j<board[i].length;j++){
         if (board[i][j]==0){
            vboard[i-5][j].style.background="#000"
         }else{
            vboard[i-5][j].style.background="#FFF"
         }
      }
   }
   shape=blocks[cur[1]][cur[2]]
   for (var i=0;i<shape.length;i++){
      for (var j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[cur[0][0]+j,cur[0][1]+i-5]
            if (posib[1]>=0){
               vboard[posib[1]][posib[0]].style.background="#FFF"
            }
         }
      }
   }

}
function checklineclear(){
   var i=0
   while (i<board.length){
      if (!board[i].includes(0)){
         console.log(board)
         board.splice(i,1)
         board.unshift(newrow)
         console.log(board)
      }
      i++
   }
}
function rotstuff(dir){
   let temp=rotate(current,dir)
   if (temp[0]){
      timetouchedfloor=elp
      current=temp[1]
   }
}
function resetblock(){
    current=[[3,0],getnext(),0]
    isfloor=false
    timetouchedfloor=-1
    nextmovetime+=droprate
}
var current=[[3,0],getnext(),0]
var prev=0;
var elp;
var nextmovetime;
var isfloor=false
var timetouchedfloor=-1
function loop(timestamp){

   if (start==undefined){
      start=timestamp 
      nextmovetime=droprate
   }
   elp=timestamp-start
   if (nextmovetime>=prev && nextmovetime<=timestamp){
      //drop the block one
      
      if (checkpos([[current[0][0],current[0][1]+1],current[1],current[2]])){
         //move down
         current[0][1]+=1
         isfloor=false

      }else{
         if (!isfloor){
            isfloor=true
            timetouchedfloor=elp+0
         }
      }
      nextmovetime+=droprate
      
   
   if (keyheld!=0 && elp-timedirpress>das){
      timedirpress+=arr
      timetouchedfloor=elp
      let temp=[[current[0][0]+keyheld,current[0][1]],current[1],current[2]]
      if (checkpos(temp)){
         current=temp
      }   
   }
   }else if (isfloor && elp-timetouchedfloor>lockdelay){
      putblock(current)
      resetblock()
      checklineclear()
   }
   prev=elp + 0

   rend(current)
   window.requestAnimationFrame(loop)
}
window.requestAnimationFrame(loop)
