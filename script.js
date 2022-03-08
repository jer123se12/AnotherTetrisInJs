const siz=[10,20] // Width, Height
const lockdelay=500
const das=120
const arr=20
   const screensize = [window.innerHeight,window.innerWidth]
const magnitude=(Math.min(...screensize)/(Math.max(...siz)*1.2))
   const droprate=500
   const sdr=50
   let setkey=""
const newrow=new Array(siz[0]).fill(0)
   const holdamount=5
   let keybinds={
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
let start
   let bag=[0,1,2,3,4,5,6]
bag=shuffleArray([0,1,2,3,4,5,6])
   bag=[...bag,...shuffleArray([0,1,2,3,4,5,6])]
   let keyheld=0
   let timedirpress=0
   let current=[[3,2],getnext(),0]
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
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
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
function keyup(e){
   if (!play){
      
      return
   }
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
   if (!play){
      if (!setkey==""){
         setCookie(setkey,e.code,1000)
            
         loadKeybinds()
         console.log(`ctrl${setkey}`)
         document.getElementById(`ctrl${setkey}`).innerHTML=e.code
         setkey=""
      }
      return
   }
   let key=e.code
      switch (key){
         case keybinds["r"]:
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
            if (keyheld<=0){

               move("r")}
            break;
         case keybinds["left"]:
            if (keyheld>=0){
               move("l")
            }  
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
                        current=[[3,2],hold,0]
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
let vnext=[]
function loadnext(){
   let gridhtml=(size,x,y,n)=>`<div class="empty" id="n${n} ${x} ${y}" style="width: ${size}px; height: ${size}px"></div>`
   let outer=document.getElementById("next")
   let content=""
   for (let n=0;n<5;n++){
      content+="<div>"
      for (let y=0;y<4;y++){
         content+="<div class=\"row\">"
         for (let x=0;x<4;x++){
            content+=gridhtml(magnitude/1.5,x,y,n)
         }
         content+="</div>"
      }
      content+="</div>"
   }
   outer.innerHTML=content
   for (let n=0;n<5;n++){
      vnext.push([])
      for (let y=0;y<4;y++){
         vnext[n].push([])
         for (let x=0;x<4;x++){
               vnext[n][y].push(document.getElementById(`n${n} ${x} ${y}`))
         }
      }
   }
}
function setDefaultKeybinds(){
   for(let key of Object.keys(keybinds)){
      setCookie(key,keybinds[key],1000)

   }

}
function loadKeybinds(){
   for(let key of Object.keys(keybinds)){
      keybinds[key]=getCookie(key)
      document.getElementById(`ctrl${key}`).innerHTML=keybinds[key]
   }
   console.log(keybinds)

}
let play=false
function load(){
   if (getCookie("hold")==""){
      setDefaultKeybinds()
      console.log(keybinds)
   }
   loadKeybinds()
      console.log(keybinds)
   
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
         if (i<siz[1]){
         vboard.push([])}
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
      loadnext()
      play=true
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
      for (let i=0;i<kickl.length;i++){
         let tempcur=[[cur[0][0]+kickl[i][0],cur[0][1]-kickl[i][1]],cur[1],(4+cur[2]+dir)%4]
            if (checkpos(tempcur)){
               return [true,tempcur]
            }
      }
   return [false,cur]

}
function putblock(cur){

   console.log(JSON.parse(JSON.stringify(board)))
   shape=blocks[cur[1]][cur[2]]
      for (let i=0;i<shape.length;i++){
         for (let j=0;j<shape[i].length;j++){
            
            if (shape[i][j]!=0){
               let posib=[cur[0][0]+j,cur[0][1]+i]
               
               console.log(JSON.parse(JSON.stringify(posib)),JSON.parse(JSON.stringify(board[posib[1]][posib[0]])),JSON.parse(JSON.stringify(cur)))
                  board[posib[1]][posib[0]]=shape[i][j]
            }
         }
      }
      console.log(JSON.parse(JSON.stringify(board)))

}
function rend(cur){
   for (let i=5;i<board.length;i++){
      for (let j=0; j<board[i].length;j++){
         if (board[i][j]==0){
            vboard[i-5][j].className="grid"
         }else{
            vboard[i-5][j].className=`grid b${board[i][j]}`//style.background=blockColor[board[i][j]]

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

                  }
            }
         }
      }
   rendhold()
      rendnext()


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
                     vhold[posib[1]][posib[0]].style.opacity="1"
                     if (!canhold){
                        vhold[posib[1]][posib[0]].style.opacity="0.5"
                     }
               }
         }
      }
   }
}
function rendnext(){
for (let n=0;n<vnext.length;n++){
   for (let i=0;i<vnext[0].length;i++){
         for (let j=0;j<vnext[0][0].length;j++){
            vnext[n][i][j].className='empty'
      }
   }
   }
for (let n=0;n<vnext.length;n++){
   shape=blocks[bag[n]][0]
   for (let i=0;i<shape.length;i++){
      for (let j=0;j<shape[i].length;j++){
         if (shape[i][j]!=0){
            let posib=[j,i]
               if (posib[1]>=0){
                  vnext[n][posib[1]][posib[0]].className=`grid b${shape[i][j]}`
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
               board.unshift(JSON.parse(JSON.stringify(newrow)))
               score += 10 + (multiplier * 5)
               if (multiplier == maxMul) {
                  multiplier += 1
               }
            document.getElementById("score").innerHTML = `Score: ${score}`
         }
         i++
      }
      elementNum += 1
      
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
   current=[[3,2],getnext(),0]
      softdroptime=elp
      isfloor=false
      timetouchedfloor=-1
      nextmovetime+=droprate
}
let lastpaused=0
function tgplay(){
   play=!play
   if (play){
      console.log(elp,lastpaused)
      start=start+(actualelp-elp)
      console.log(start)
   }
   return play
}
let actualelp=0
function loop(timestamp){
   if (start==undefined){
      start=timestamp 
         nextmovetime=droprate
   }
   actualelp=timestamp-start
   if (play){elp=timestamp-start}
   
      if (!softdrop && elp-nextmovetime>=droprate){
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
      }else if (softdrop && elp-softdroptime>sdr){
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
         softdroptime+=sdr
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
   if (elp-prev>1000){
      console.log("wierd time diff")
   }
   prev=elp + 0

      rend(current)
      window.requestAnimationFrame(loop)
}
document.addEventListener("visibilitychange", (event) => {
   if (document.visibilityState == "visible") {
     tgplay()
   } else {
     tgplay()
   }
 });
