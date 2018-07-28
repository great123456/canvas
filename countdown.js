var WINDOW_WIDTH = 1200;
var WINDOW_HEIGHT = 768;
var RADIUS = 39;
var MARGIN_TOP = 230;
var MARGIN_LEFT = 100;
var bacUrl = '';    //背景图
var bacText = '';   //背景文字
var arr = []
var index = 0
var signId = ''  //签到id
var personalImg = []    //用于存放所有已签到头像信息
var imgUrl = ''         //当前签到用户
var count = 0           //签到人数
var personalList = []   //初始化已经签到的人员信息
var indexList = []      //记录已经签到的人员存放位置

var num = 0
var disX = 500
var disY = 160
var width = 10
var height = 10
var timer = null
window.onload = function(){
    WINDOW_WIDTH = window.screen.width
    WINDOW_HEIGHT =  window.screen.height
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    getBacImage(context)
}

function render( cxt ){                                //加载初始化信息
    arr = []
    var image = new Image()
    image.src = bacUrl
    cxt.drawImage(image,0,0,canvas.width,canvas.height)
    renderDigit( MARGIN_LEFT , MARGIN_TOP , 2 , cxt );
    renderDigit( MARGIN_LEFT+11*RADIUS , MARGIN_TOP , 3 , cxt );
    renderDigit( MARGIN_LEFT+2*11*RADIUS , MARGIN_TOP , 4 , cxt );
    renderDigit( MARGIN_LEFT+3*11*RADIUS , MARGIN_TOP , 5 , cxt );
    console.log('arr', arr.length)
    if(personalList.length>0){
      for(var i = 0;i<personalList.length;i++){
        var preIndex = parseInt(Math.random()*arr.length)
        indexList.push(preIndex)
        personalImg.push({
          url: 'http://www.yixuelin.cn/yixuelin/upload/photo/' + personalList[i].picture,
          disX: arr[preIndex][0],
          disY: arr[preIndex][1]
        })
      }
    }
    updatePersonalImg(cxt);
    personalList = []
    updateText(cxt);
}

function imageConfig(cxt,url){
    var img = new Image();
    img.src = url;
    img.onload = function(){
      disX = (WINDOW_WIDTH/2)-25
      disY = 160
      width = 50
      height = 50
      num = 0
      index = parseInt(Math.random()*arr.length)
      if(indexList.indexOf(index) != -1){
        index = parseInt(Math.random()*arr.length);
        if(indexList.indexOf(index) != -1){
          index = parseInt(Math.random()*arr.length);
          if(indexList.indexOf(index) != -1){
            index = parseInt(Math.random()*arr.length);
          }
        }
      }
      indexList.push(index)
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
                cxt.fillRect(x+j*RADIUS,y+i*RADIUS,RADIUS-0.5,RADIUS-0.5);
                var array = [x+j*RADIUS,y+i*RADIUS]
                arr.push(array)
                cxt.closePath();
                cxt.fill();
            }
}

function updateText(cxt){                     //更新签到人数
   cxt.font="30px Arial";
   var text = '共 '+ count +'人签到';
   cxt.fillText(text,260,95);
}

function updatePersonalImg(cxt){               //重新绘制已签到人员信息
  for(var i = 0;i<personalImg.length;i++){
    console.log('update-img',personalImg[i])
    var imgobj = new Image()
    imgobj.src = personalImg[i].url
    cxt.drawImage(imgobj,personalImg[i].disX,personalImg[i].disY,RADIUS,RADIUS)
  }
}


function drawImage(cxt,img){
  cxt.drawImage(img,disX,disY,width,height)
}

function updateImage(cxt,img){                                           //放大
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

function scaleImage(cxt,img,speedX,speedY){                              //缩小
    cxt.clearRect(0,0,canvas.width,canvas.height)
    render( cxt )
    width = width-5
    height = height-5
    disY = disY + speedY
    disX = disX + speedX
    drawImage(cxt,img)
    if(num>=150){
        width = RADIUS
        height = RADIUS
        disX = arr[index][0]
        disY = arr[index][1]
        personalImg.push({
          url: imgUrl,
          disX: disX,
          disY: disY
        })
        count++
        cxt.clearRect(0,0,canvas.width,canvas.height)
        render( cxt )
        drawImage(cxt,img)
        num = 0
        updatePersonal(cxt)
        return
    }
    setTimeout(function(){
       num++
       scaleImage(cxt,img)
    },10)
}

function getBacImage(cxt){               //签到获取背景图
    var xhr = new XMLHttpRequest();
    var url = 'http://www.yixuelin.cn/yixuelin/Meeting.do?GetmeetingData&id=402881106487dbbe016487f91e8e0026'
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      // readyState == 4说明请求已完成
      if (xhr.readyState == 4 && xhr.status == 200) { 
          var params = JSON.parse(xhr.responseText)
          bacUrl = 'http://www.yixuelin.cn/yixuelin/upload/qiandao/' + params.bgimg
          bacText = params.bgname
          count = params.count
          if(params.list && params.list.length>0){
            personalList = params.list
          }
          var image = new Image()
          image.src = bacUrl
          image.onload = function(){
            render( cxt )
            getImageList(cxt)
          }
      }
    };
    xhr.send();
}


function getImageList(cxt){                //(签到未播放动画的人员信息)
   var xhr = new XMLHttpRequest();
    var url = 'http://www.yixuelin.cn/yixuelin/Meeting.do?GetmeetingSign&id=402881106487dbbe016487f91e8e0026'
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      // readyState == 4说明请求已完成
      if (xhr.readyState == 4 && xhr.status == 200) { 
          var res = JSON.parse(xhr.responseText)
          res = JSON.parse(res)
          if(res.length>0){
            imgUrl = 'http://www.yixuelin.cn/yixuelin/upload/photo/' + res[0].picture
            signId = res[0].id
            console.log('imgUrl', imgUrl)
            imageConfig(cxt,imgUrl)
          }else{
            setTimeout(function(){
              getImageList(cxt)
            },5000)
          }
      }
    };
    xhr.send();
}

function updatePersonal(cxt){            //动画播放后,更新签到人员信息
    var xhr = new XMLHttpRequest();
    var url = 'http://www.yixuelin.cn/yixuelin/Meeting.do?UpDatameetingSign&id='+signId
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      // readyState == 4说明请求已完成
      if (xhr.readyState == 4 && xhr.status == 200) { 
          var json = JSON.parse(xhr.responseText)
          getImageList(cxt)
      }
    };
    xhr.send();
}

