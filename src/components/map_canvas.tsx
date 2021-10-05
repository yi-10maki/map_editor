import React, {useEffect, useRef} from "react";

{/*
  canvasを用いてエディタの描画部分を作成する


*/}

{/*
let canvas_mousedown_flg = 0;   // マウスダウンフラグ
let canvas_penmode_flg   = 1;   // 1:ペン 2:塗りつぶし
let canvas_block = new Object;  // 連想配列のピクセルデータ
let canvas_data  = new Array(); // 配列のピクセルデータ

let canvas_width: number  = 16; // キャンバスの横幅
let canvas_height: number = 16; // キャンバスの縦幅

let palette_select_id: string = 'H1xW1'; // パレットの選択ID

const COLOR_BACK: string = '#FFFFFF'; // 背景色 

// 基本16色パレット
const PALETTE: string[] = ["#000000","#ffffff","#c0c0c0","#808080","#ff0000",
               "#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff",
               "#800000","#808000","#008000","#008080","#000080",
               "#800080"];    

// キャンバスの作成(ドット絵用)
function createCanvasArea(){
  let html:string = '';
    
  // テーブルの枠を選択した際にその下にあるセルを擬似的に選択
  // 最後に「return false」にする事によってエレメントのドロップを解除 
  html += '<table id="tbl_canvas" ';  
  html += ' onmousedown="OnMousedown(document.elementFromPoint(event.clientX,event.clientY+1),null);return false;">';

    // マスの作成
    let key;
    canvas_block = new Object;
    for (var i = 0; i < canvas_height; i++) {
      html += '<tr>';
      for (var j = 0;j < canvas_width; j++) {
        key =  'R' + (i+1) +'xC'+(j+1);
        
        html += '<td>';
        html += '<div id="' + key + '"';
        html += ' style="width:18px;height:18px;background-color:' + COLOR_BACK + '"';
        html += ' onmousemove="OnMousemove(this,event);"';
        html += ' onmouseup="OnMouseup(event);"';
        html += '></div>';
        html += '</td>';
        
        canvas_block[key] = Color2RGB(COLOR_BACK);
      }
      html += '</tr>';
    }
    
  html += '</table>';
  html += '<p></p>'
  
  document.getElementById('CanvasArea').innerHTML = html;
  
  // ピクセルデータの保存
  OnMouseup();
}

// パレットエリアの作成
function craetePaletteArea() {
  var html = '';

  html  = '<table> ';
    var cnt = 0;
    for (var i = 0; i < 1; i++) {
      html += '<tr>';         
        for (var j = 0;j < 16; j++) {                  
          html += '<td>';
          html += '<div style="width:15px;height:15px;">' ;
          html += '<div id="H' + (i+1) +'xW'+(j+1) +'" onmousedown="OnPalette_Mousedown(this,event);"';
          html += ' style="width:13px;height:13px;background-color:';

          html += PALETTE[cnt++] + ';';
              
          if (palette_select_id == ('H' + (i+1) +'xW'+(j+1)))
            html += 'border:2px solid #1e90ff;"';
          else
            html += '"';
                 
          html += '></div>';
          html +='</div>';
          html += '</td>';                
        }
      html += '</tr>';
    }
  html += '</table>';   
  html += '<p></p>';

  document.getElementById('PaletteArea').innerHTML = html;       
} 

 // 塗りつぶす座標を取得する
  // x,y          : マウスダウンした座標
  // targetcolor  : 塗りつぶす色 
  // imgdata      : ピクセルデータ(R,G,B)
  // fill_list    : 塗りつぶす座標のリスト(戻り値)  
  // already_list : 走査済みの座標のリスト
  // 備考
  //   1回目はベースのx,y座標を除く十字型になる
  //   2回目以降は新規座標を元に再帰処理
  function getFillList(x:number,y:number,targetcolor:any,imgdata:any,fill_list:any[],already_list:number[]){
    var newlist = new Array();
    var index;
    
       function AddNewList(ax:number,ay:number){
        if(fill_list['R'+ay +'xC'+ax] == 1){
          // none
        }else{
          fill_list['R'+ay +'xC'+ax] = 1;
          newlist[newlist.length] = {'x':ax,'y':ay};
        }
       }
 
    // 左
    for (var i = x; i >= 1; i--) {
      
      // ベース座標は除外
      if (i == x) continue   
      
      // 既に走査済みは除外
      if (already_list[(i-1) +((y-1)*canvas_width)] == 1) break;    
      already_list[(i-1) +((y-1)*canvas_width)] = 1;
      
      // 他の色にぶつかるまでループ
      index = (y-1) * canvas_width + (i-1);
      if (!(imgdata[index].r == targetcolor.r &&
            imgdata[index].g == targetcolor.g &&
            imgdata[index].b == targetcolor.b)){
        break;
      }
      
      AddNewList(i,y);
    } 
      
    // 右
    for (var i = x; i <= canvas_width; i++) {
      
      if (i == x) continue
           
      if (already_list[(i-1) +((y-1)*canvas_width)] == 1) break;    
      already_list[(i-1) +((y-1)*canvas_width)] = 1;
           
      index = (y-1) * canvas_width + (i-1);     
      if (!(imgdata[index].r == targetcolor.r &&
            imgdata[index].g == targetcolor.g &&
            imgdata[index].b == targetcolor.b)){
        break;
      }      
      AddNewList(i,y);
    }
    
    // 上
    for (var i = y; i >= 1; i--) {
      
      if (i == y) continue
           
      if (already_list[(x-1) +((i-1)*canvas_width)] == 1) break;    
      already_list[(x-1) +((i-1)*canvas_width)] = 1;
               
      index = (i-1) * canvas_width + (x-1);         
      if (!(imgdata[index].r == targetcolor.r &&
            imgdata[index].g == targetcolor.g &&
            imgdata[index].b == targetcolor.b)){
        break;
      }     
      AddNewList(x,i);
    }
    
    // 下
    for (var i = y; i <= canvas_height; i++) {
      
      if (i == y) continue         
      
      if (already_list[(x-1) +((i-1)*canvas_width)] == 1) break;    
      already_list[(x-1) +((i-1)*canvas_width)] = 1;
 
      index = (i-1) * canvas_width + (x-1);
      if (!(imgdata[index].r == targetcolor.r &&
            imgdata[index].g == targetcolor.g &&
            imgdata[index].b == targetcolor.b)){
        break;
      }      
      AddNewList(x,i);
    } 
   
    // 新規に取得した座標で再帰処理
    for (var i = 0; i < newlist.length; i++) {    
      getFillList(newlist[i].x,newlist[i].y,targetcolor,imgdata,fill_list,already_list);
    }    
  }
  
  // ID(R256xR256,R32xC32,R1xC1)からXY座標を取得
  function getXY(value:any){
     var result = {'x':0,'y':0};
     
     if (value[2] == 'x'){
       result.y = value[1];
       result.x = value.slice(4);
     }else if (value[3] == 'x'){
       result.y = value[1] + value[2];
       result.x = value.slice(5);
     }else if (value[4] == 'x'){
       result.y = value[1] + value[2] + value[3];
       result.x = value.slice(6);
     }
     return result;
  }
    
  // backgroundColorからRGB値を返す
  function Color2RGB(backgroundcolor:string) {  
    
    // [IE/Chrome/FireFox] rgb(255,255,255)の文字列形式からRGBを取得する 
    var result = backgroundcolor.replace("rgb(","");
    result = result.replace(")","");
    result = result.replace(/ /g,"");
    result = result.split(",");
    
    // [Opera] #ffffff の文字列形式からRGBを取得する 
    var buffer; 
    if (result[0][0] == '#'){
      buffer = new Array();
      buffer[0] = parseInt(result[0].slice(1,3),16);
      buffer[1] = parseInt(result[0].slice(3,5),16);
      buffer[2] = parseInt(result[0].slice(5,7),16);
      result = buffer;
    }
    
    result[0] = parseInt(result[0],10);
    result[1] = parseInt(result[1],10);
    result[2] = parseInt(result[2],10);
    
    return {'r':result[0],'g':result[1],'b':result[2]}; 
  }

  window.onload = function(){
    craetePaletteArea();
    createCanvasArea();
  } 
   
  window.onmouseup = function(){
    OnMouseup();    
  }    
     
  // パレット     
  function OnPalette_Mousedown(obj,event) {
    
    // パレットの選択解除
    var target;
    for (var i = 0; i < 16; i++) {
      for (var j = 0;j < 16; j++) {
        target = document.getElementById('H'+(i+1)+'xW' + (j+1));
        if (target){
          target.style.borderStyle = "none";
        }
      }
    }
    
    // パレットの選択
    obj.style.borderStyle = "solid";
    obj.style.borderWidth = "2px";
    obj.style.borderColor = "#1e90ff" ; 
    
    palette_select_id = obj.id;
  } 
    
  function OnMousedown(obj,event) {
    
    if (obj.id[0] != 'R') return;
 
    // ペン
    if (canvas_penmode_flg == 1){
      var color_pen = document.getElementById(palette_select_id).style.backgroundColor;
      obj.style.backgroundColor = color_pen;
      canvas_block[obj.id] = Color2RGB(color_pen);
      
      canvas_mousedown_flg = true; 
      
    // 塗りつぶし 
    }else if (canvas_penmode_flg == 2){
      
      // 現在の座標と色を取得
      var point = getXY(obj.id);  
      var targetcolor = Color2RGB(document.getElementById(obj.id).style.backgroundColor); 
      
      // 探索用の配列を生成
      var fill_list = new Object();
      var already_list = new Object();
      for (var i = 0; i < canvas_height; i++) {
        for (var j = 0; j < canvas_width; j++) {
           fill_list['R' + (i+1) + 'xC' +  (j+1)] = 0;
           already_list[already_list.length] = 0;
        }
      }
 
      // 塗りつぶすブロックを取得 
      getFillList(point.x,point.y,targetcolor,canvas_data,fill_list,already_list);
 
      // 現在の座標を設定
      fill_list['R' + point.y + 'xC' +  point.x] = 1;
      
      // 塗りつぶす座標を元にキャンバスを描画
      var color_fill = document.getElementById(palette_select_id).style.backgroundColor;
      for(var key in fill_list) {       
         if (fill_list[key] == 1){
            document.getElementById(key).style.backgroundColor = color_fill;
            canvas_block[key] = Color2RGB(color_fill);
         }
      }      
    }     
  }
  
  function OnMousemove(obj,event) {
    
    if (canvas_mousedown_flg){
      obj.style.backgroundColor = document.getElementById(palette_select_id).style.backgroundColor;
      canvas_block[obj.id] = Color2RGB(document.getElementById(palette_select_id).style.backgroundColor);
    }
  }
 
  function OnMouseup(event) {
 
    canvas_mousedown_flg = false; 
    
    // ピクセルデータを保存  
    canvas_data = new Array();
    for (var y = 0; y < canvas_height; y++) {
      for (var x = 0;x < canvas_width; x++) {
         canvas_data[canvas_data.length] = canvas_block['R' + (y+1) +'xC'+(x+1)];
      }
    }
  }  
*/}

const Map_Canvas: React.FC = () => {
  const canvasRef = useRef(null); // nullで初期化しているのでcurrentプロパティは書き換えられない

  // CanvasオブジェクトのgetContext()は、キャンパスに描画するためのコンテキスト(CanvasRenderingContext2Dオブジェクトなど)を取得するメソッド
  // 引数にコンテキストの種類を指定する　二次元グラフィックを描画するための2d、三次元グラフィックスを描画するためのwebglが主な引数
  const getContext = (): CanvasRenderingContext2D => { 
    const canvas: any = canvasRef.current;

    return canvas.getContext('2d');
  };

  // useEffect: 副作用を有する可能性のある命令型のコードを受け付ける
  // 副作用をReactのrenderフェーズで行うとバグとか非整合が起こるのでこれ使う
  // 
  useEffect(() => {
    const ctx: CanvasRenderingContext2D = getContext(); // 二次元グラフィックスのコンテキストを取得
    //ctx.fillRect(0,0, 10, 500); // 座標(x, y) を始点とし大きさ (width, height) の領域を、(訳注: 現在の塗りつぶしスタイルを用いて) 塗りつぶす
    // 変数 i,jを定義する
    let i: number, j: number;
    // x 方向にi=0～14まで15マスを描画する
    for (i = 0; i < 15; i++) {
      // y 方向にy=0～14まで15マスを描画する
      for (j = 0; j < 15; j++) {
        ctx.beginPath();
        // i の値によって r(赤)の輝度を変化させる
        // toString(10)で、文字列に変換
        //var red = (i * 18).toString(10); 
        ctx.fillStyle = 'rgb(200,200,200)';
        // i,j を座標に変換
        ctx.rect(i * 40, j * 40, 39, 39);
        ctx.fill(); // 色を塗る
      }
    }
    ctx.save(); // Saves the current drawing style state using a stack so you can revert any change you make to it using restore().
  })

  return (
    
    <canvas className="canvas" width="1000" height="800" ref={canvasRef} />
    
  );
  {/*
  return(

    
    <div style="margin: 12px 8px 0 18px;">
      <input type="radio" name="mode" value="1" id="type1" checked="checked" onclick="canvas_penmode_flg=1;">
      <label for="type1" onclick="canvas_penmode_flg=1;">ペン</label>
      <input type="radio" name="mode" value="2" id="type2" onclick="canvas_penmode_flg=2;">
      <label for="type2" onclick="canvas_penmode_flg=2;">塗りつぶし</label>  
      <button onclick="createCanvasArea();">クリア</button>
    </div>
    <p id="PaletteArea"></p>
    <p id="CanvasArea"></p>
    
  )
  */}
}

export default Map_Canvas;