const siz=[10,20] // Width, Height
const lockdelay=500
const das=120
const arr=20
const screensize = [window.innerHeight,window.innerWidth];
const magnitude=(Math.min(...screensize)/(Math.max(...siz)*1.1))
const droprate=500
const sdr=50
const newrow=new Array(siz[0]).fill(0)
const blockColor = {1: "#00FFFF", 2: "#800080", 3: "#ff0000", 4: "#00ff00", 5: "#0000ff", 6: "#ff7f00", 7: "#ffff00"}
const keybinds={
   "right"  :  "KeyD",
   "left"   :  "KeyA",
   "sd"     :  "KeyS",
   "hd"     :  "KeyW",
   "r"      :  "KeyK",
   "l"      :  "KeyL",  
   "hold"   :  "Space"

}
let softdrop=false
let softdroptime=0
let vboard=[]
let board=[]
let hold=-1
let canhold=true
let start;
let bag=[0,1,2,3,4,5,6]
bag=shuffleArray([0,1,2,3,4,5,6])
bag=[...bag,...shuffleArray([0,1,2,3,4,5,6])]
let keyheld=0
let timedirpress=0
let current=[[3,0],getnext(),0]
let prev=0;
let elp;
let nextmovetime;
let isfloor=false
let timetouchedfloor=-1

// Score System
let score = 0
let multiplier = 1
let maxMul = 7

// Num of Elements
let elementNum = 0

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function waitButtonPress(e) {
    document.getElementById("startGameButton").addEventListener("click",()=>{
        load()
    })
}

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
      case keybinds["sd"]:
         softdrop=false
         break;
   }
}
function keydown(e){
   let key=e.code
   switch (key){
      case keybinds["r"]:
         console.log("hiii")
         rotstuff("r")
         break;
      case keybinds["sd"]:
         if (!softdrop){
         softdrop=true
         softdroptime=elp
         }
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
      case keybinds["hold"]:
         if (canhold){
            canhold=false
            if (hold<0){
               hold =current[1]
               resetblock()
               
            }else{
               let temp=current[1]
               //hold=current
               current=[[3,4],hold,0]
               hold=temp
            }
         }else{
            
         }
         break;   
      case keybinds["hd"]:
         current=hd()
         putblock(current)
         resetblock()
         checklineclear()
         canhold=true
         break
   }
}
const blocks={
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
      [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
      [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
      [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
      [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
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
      [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
      [[0,0],[1,0],[1,-1],[0,2],[1,2]],
      [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
      [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
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
function getnext(){
   if (bag.length<9){
      bag=[...bag,...shuffleArray([0,1,2,3,4,5,6])]
       
   }
   return bag.shift()
}
vhold=[]
function loadhold(){
   let gridhtml=(size,x,y)=>`<div class="empty" id="h${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`
   let outer=document.getElementById("hold")
   let content=""
   for (let i=0;i<4;i++){
        content+="<div class=\"row\">"
        for (let j=0;j<4;j++){
            content+=gridhtml(magnitude/1.5,i,j)
        }
        content+="</div>"
    }
    outer.innerHTML=content
    for (let i=0;i<4;i++){
      vhold.push([])
      for(let j=0;j<4;j++){
         vhold[i].push(document.getElementById(`h${i} ${j}`))

      }

    }


}
function load(){
    gridhtml=(size,x,y)=>`<div class="grid " id="${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`

    let outer=document.getElementById("board")
    let content=""
    for (let i=0;i<siz[1];i++){
        content+="<div class=\"row\">"
        for (let j=0;j<siz[0];j++){
            content+=gridhtml(magnitude,i,j)
        }
        content+="</div>"
    }
    outer.innerHTML=content
    for (let i=0;i<siz[1]+5;i++){
        vboard.push([])
        board.push([])
        for (let j=0;j<siz[0];j++){
            board[i].push(0)
            if (i<siz[1]){
            vboard[i].push(document.getElementById(`${i} ${j}`))
            }
        }

    }
    console.log(board,vboard)
    loadhold()
window.requestAnimationFrame(loop)

}

function hd(){
   let temp=current
   while (true){
   if (!checkpos(temp)){
      
      return [[temp[0][0],temp[0][1]-1],temp[1],temp[2]]

   }
   temp=[[temp[0][0],temp[0][1]+1],temp[1],temp[2]]
   }
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
      timetouchedfloor=elp
   }
   
}
function checkpos(cur){
   shape=blocks[cur[1]][cur[2]]
   for (let i=0;i<shape.length;i++){
      for (let j=0;j<shape[i].length;j++){
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
   let kickl=[]
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
   console.log(cur,kickl)
   for (let i=0;i<kickl.length;i++){
      let tempcur=[[cur[0][0]+kickl[i][0],cur[0][1]-kickl[i][1]],cur[1],(4+cur[2]+dir)%4]
      if (checkpos(tempcur)){
         return [true,tempcur]
      }
   }
   return [false,cur]

}
function putblock(cur){
   shape=blocks[cur[1]][cur[2]]
   for (let i=0;i<shape.length;i++){
      for (let j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[cur[0][0]+j,cur[0][1]+i]
               board[posib[1]][posib[0]]=shape[i][j]+0
         }
      }
   }


}
function rend(cur){
   for (let i=5;i<board.length;i++){
      for (let j=0; j<board[i].length;j++){
         if (board[i][j]==0){
            vboard[i-5][j].className="grid"
         }else{
            vboard[i-5][j].className=`grid b${board[i][j]}`//style.background=blockColor[board[i][j]]
            if (blockColor[board[i][j]]===undefined) {
                console.log(board[i][j])
            }
         }
      }
   }
   let h=hd()
   shape=blocks[h[1]][h[2]]
   for (let i=0;i<shape.length;i++){
      for (let j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[h[0][0]+j,h[0][1]+i-5]
            if (posib[1]>=0){
               vboard[posib[1]][posib[0]].className=`grid ho`
               if (blockColor[shape[i][j]]===undefined) {
                console.log(shape[i][j])
            }
            }
         }
      }
   }
   shape=blocks[cur[1]][cur[2]]
   for (let i=0;i<shape.length;i++){
      for (let j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[cur[0][0]+j,cur[0][1]+i-5]
            if (posib[1]>=0){
               vboard[posib[1]][posib[0]].className=`grid b${shape[i][j]}`
               if (blockColor[shape[i][j]]===undefined) {
                console.log(shape[i][j])
            }
            }
         }
      }
   }
   rendhold()
   //rendnext()


}
function rendhold(){
   if (hold==-1){
      return 
   }
   shape=blocks[hold][0]
   for (let i=0;i<vhold.length;i++){
      for (let j=0;j<vhold[0].length;j++){
         vhold[i][j].className='empty'
      }
   }
   for (let i=0;i<shape.length;i++){
      for (let j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[j,i]
            if (posib[1]>=0){
               vhold[posib[1]][posib[0]].className=`grid b${shape[i][j]}`
               if (blockColor[shape[i][j]]===undefined) {
                console.log(shape[i][j])
            }
            }
         }
      }
   }
}
function checklineclear(){
   let i=0
   while (i<board.length){
      if (!board[i].includes(0)){
         board.splice(i,1)
         board.unshift(newrow)
         score += 10 + (multiplier * 5)
         if (multiplier == maxMul) {
              multiplier += 1
         }
         document.getElementById("score").innerHTML = `Score: ${score}`
      }
      i++
   }
   console.log(board)
   elementNum += 1
   console.log(board[4],newrow,board[4]!=newrow)
   if (board[4].reduce((a, b) => a + b, 0)!=0) {
      load()
      console.log("DIE")
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
    current=[[3,4],getnext(),0]
    isfloor=false
    timetouchedfloor=-1
    nextmovetime+=droprate
}

function loop(timestamp){

   if (start==undefined){
      start=timestamp 
      nextmovetime=droprate
   }
   elp=timestamp-start
   if (!softdrop && elp-nextmovetime>=droprate){
      //drop the block one
      console.log("here")
      
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
   }else if (softdrop && elp-softdroptime>sdr){
      console.log("hello")
      if (checkpos([[current[0][0],current[0][1]+1],current[1],current[2]])){
         //move down
         current[0][1]+=1
         isfloor=false
         console.log("what")
      softdroptime+=sdr

      }else{
         if (!isfloor){
            isfloor=true
            timetouchedfloor=elp+0
         }  
      }
   }
   
   if (keyheld!=0 && elp-timedirpress>das){
      timedirpress+=arr
      let temp=[[current[0][0]+keyheld,current[0][1]],current[1],current[2]]
      if (checkpos(temp)){
         current=temp
      timetouchedfloor=elp
      }   
   }
   if (isfloor && elp-timetouchedfloor>lockdelay){
      putblock(current)
      resetblock()
      checklineclear()
      canhold=true
   }
   prev=elp + 0

   rend(current)
   window.requestAnimationFrame(loop)
}
