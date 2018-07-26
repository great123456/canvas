var WINDOW_WIDTH = 1200;
var WINDOW_HEIGHT = 768;
var RADIUS = 40;
var MARGIN_TOP = 180;
var MARGIN_LEFT = 150;
var arr = []
var index = 0

var num = 0
var disX = 500
var disY = 160
var width = 10
var height = 10
var timer = null
window.onload = function(){

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    render( context )
    imageConfig(context)
}

function render( cxt ){
    arr = []
    renderDigit( MARGIN_LEFT , MARGIN_TOP , 0 , cxt );
    renderDigit( MARGIN_LEFT+11*RADIUS , MARGIN_TOP , 1 , cxt );
}

function imageConfig(cxt){
    var img = new Image();
    img.src = './img/logo.jpg';
    img.onload = function(){
      disX = 500
      disY = 160
      width = 50
      height = 50
      num = 0
      index = parseInt(Math.random()*arr.length)
      console.log('index',index,arr[index])
      updateImage(cxt,img);
    }
}

function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "#ffffff";
    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
                cxt.fillRect(x+j*RADIUS,y+i*RADIUS,RADIUS-1,RADIUS-1);
                let array = [x+j*RADIUS,y+i*RADIUS]
                arr.push(array)
                cxt.closePath();
                cxt.fill();
            }
}


function drawImage(cxt,img){
  cxt.drawImage(img,disX,disY,width,height)
}

function updateImage(cxt,img){
    cxt.clearRect(0,0,canvas.width,canvas.height)
    render( cxt )
    width = width+2
    height = height+2
    disY = disY + 0
    disX = disX - 0.6
    drawImage(cxt,img)
    if(num>=200){
        num = 0
        var speedX = (arr[index][0] - disX)/150
        var speedY = (arr[index][1] - disY)/150
        console.log('speedx',speedX)
        console.log('speedY',speedY)
        scaleImage(cxt,img,speedX,speedY)
        return
    }
    setTimeout(function(){
       num++
       updateImage(cxt,img)
    },20)
}

function scaleImage(cxt,img,speedX,speedY){
    cxt.clearRect(0,0,canvas.width,canvas.height)
    render( cxt )
    width = width-5
    height = height-5
    disY = disY + speedY
    disX = disX - speedX
    drawImage(cxt,img)
    if(num>=150){
        width = 40
        height = 40
        disX = arr[index][0]
        disY = arr[index][1]
        cxt.clearRect(0,0,canvas.width,canvas.height)
        render( cxt )
        drawImage(cxt,img)
        num = 0
        return
    }
    setTimeout(function(){
       num++
       scaleImage(cxt,img)
    },0)
}