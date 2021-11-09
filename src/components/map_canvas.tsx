import React, {useEffect, useRef, useCallback, useState} from "react";

import "./map_canvas.css"
//import CanvasTip from "./canvas_tip";

{/*
  canvasを用いてエディタの描画部分を作成する
  選択しているマップチップとツールによって描画を変える
  Space+マウスホイールで拡大縮小を行える
*/}

// 可変にしたい（プロパティに入力した値を受け取る）

//let grid_x_num: number = 100; // default 1マス40px
//let grid_y_num: number = 60; //
//let canvas_size_x: number = 4000; // default 1マス40px
//let canvas_size_y: number = 2400; //
const maptip_edge_size: number = 40;
let ratio: number = 1; // 拡大縮小比率
let i: number, j: number; // for文用
let isDrawing: boolean = false;// マウスが左クリックされているかどうか
let isSelecting: boolean = false;// マウスが右クリックされているかどうか
let x: number = 0; // マウスのx座標の処理に使う
let y: number = 0; // マウスのy座標の処理に使う
let startSelect: number[] = [0, 0];
let endSelect: number[] = [0, 0] ;
let img = new Image(); // マップチップを保存
//img.src = `${process.env.PUBLIC_URL}/maptip/maptip3.png`; // マップチップ仮指定
let now_maptip_edge_size: number = maptip_edge_size*ratio;
let now_canvas_size: number[] = [60, 100]

type MapCanvasProps = {
  //maptip_id: number
  propGetCanvasHeight: () => number;
  propGetCanvasWidth: () => number;
  propGetMapTip: (h: number, w: number) => number;
  propClickCanvasTip: (h: number, w: number) => void;
};

const Map_Canvas: React.FC<MapCanvasProps> = ({
  //maptip_id,
  propGetCanvasHeight,
  propGetCanvasWidth,  
  propGetMapTip,
  propClickCanvasTip,
}) => {
  const [ temp_state, set_temp_state] = useState<number>(0);
  const canvasRef = useRef(null); // nullで初期化しているのでcurrentプロパティは書き換えられない
  const effectRef = useRef(null);
  console.log(temp_state);

  // CanvasオブジェクトのgetContext()は、キャンパスに描画するためのコンテキスト(CanvasRenderingContext2Dオブジェクトなど)を取得するメソッド
  // 引数にコンテキストの種類を指定する　二次元グラフィックを描画するための2d、三次元グラフィックスを描画するためのwebglが主な引数
  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const getEffectContext = (): CanvasRenderingContext2D => {
    const canvas: any = effectRef.current;
    return canvas.getContext('2d');
  };

  const resizeCanvas = () => {
    const canvas: any = canvasRef.current;
    const effect_canvas: any = effectRef.current;
    canvas.height = now_canvas_size[0] * maptip_edge_size * ratio;
    canvas.width = now_canvas_size[1] * maptip_edge_size * ratio;
    effect_canvas.height = now_canvas_size[0] * maptip_edge_size * ratio;
    effect_canvas.width = now_canvas_size[1] * maptip_edge_size * ratio;
  };

  // マウスを押したとき描画フラグをtrue
  function handleOnMouseDown(e:any) {
    if(e.nativeEvent.which === 1) {
      isDrawing = true;
    } else if(e.nativeEvent.which === 3) {
      isSelecting = true;
      startSelect = matchGrid(e);
    }
    handleMouseMove(e);
  }

  // マウスを離したとき描画フラグをfalse
  function handleOnMouseUp(e:any) {
    if(e.nativeEvent.which === 1) {
      isDrawing = false;
    } else if(e.nativeEvent.which === 3) {
      endSelect = matchGrid(e);
      console.log(startSelect, endSelect)
      const ectx: CanvasRenderingContext2D = getEffectContext(); 
      ectx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);
      if(startSelect[0] == endSelect[0] && startSelect[1] == endSelect[1]) { // 1マス選択は無理
        isSelecting = false;
        console.log("endSelecting");
      } else {
        const selectArea: number[] = effectGrid(startSelect, endSelect);
        //ectx.beginPath();
        ectx.strokeStyle = 'red';
        ectx.fillStyle = "rgba(" + [200, 0, 0, 0.1] + ")";
        ectx.strokeRect(selectArea[0], selectArea[1], selectArea[2]+now_maptip_edge_size, selectArea[3]+now_maptip_edge_size);
        ectx.fillRect(selectArea[0], selectArea[1], selectArea[2]+now_maptip_edge_size, selectArea[3]+now_maptip_edge_size);
      }
    }
  }

  const effectGrid = (s:number[], e:number[]) => {
    const selectArea: number[] = [Math.min(s[0], e[0]), Math.min(s[1], e[1]), Math.abs(s[0]-e[0]), Math.abs(s[1]-e[1])]; // [始点のx座標，始点のy座標，x方向の選択距離，y方向の選択距離]
    return selectArea;
  }

  // startSelectとendSelectをセットするときに使う
  const matchGrid = (e:any) => {
    let rect: any = e.target.getBoundingClientRect();
    // マス目に合わせる処理
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    let tmp:number;
    tmp = x % now_maptip_edge_size;
    x -= tmp;
    //x = Math.floor(x / now_maptip_edge_size);
    tmp = y % now_maptip_edge_size;
    y -= tmp;
    //y = Math.floor(y / now_maptip_edge_size);
    return [x, y]
  }

  function handleMouseMove(e:any) {
    if(isDrawing) {
      let rect: any = e.target.getBoundingClientRect();
      // マス目に合わせる処理
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      let tmp:number;
      tmp = x % now_maptip_edge_size;
      x -= tmp;
      tmp = y % now_maptip_edge_size;
      y -= tmp;
      propClickCanvasTip(Math.floor(y/now_maptip_edge_size), Math.floor(x/now_maptip_edge_size));
      drawMapTip(x, y);
    }
  }

  // クリックされた部分の描画
  function drawMapTip(cx:number, cy:number) {
    const ctx: CanvasRenderingContext2D = getContext();
    if (propGetMapTip(Math.floor(cy/now_maptip_edge_size), Math.floor(cx/now_maptip_edge_size)) == -1) {
      ctx.clearRect(cx, cy, now_maptip_edge_size, now_maptip_edge_size);//プログラム更新時に一旦全体をクリアする
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.strokeRect(cx, cy, now_maptip_edge_size, now_maptip_edge_size);
    }
    else{
      let img = new Image();
      img.src = `${process.env.PUBLIC_URL}/maptip/maptip${propGetMapTip(Math.floor(y/ now_maptip_edge_size), Math.floor(x/ now_maptip_edge_size)) + 1}.png`
      ctx.drawImage(img, cx, cy, now_maptip_edge_size, now_maptip_edge_size);
      console.log(cx, cy, now_maptip_edge_size, now_maptip_edge_size)
    }

  }

  // 拡大縮小用キー入力受け取り
  // キャンバス部分を選択していなくてもキー入力だけで動作するため他の機能で使わなさそうなキーを使う
  const enterFunction = useCallback((event) => {
    if(event.keyCode === 191 && ratio < 2) {
      ratio += 0.1;
      now_maptip_edge_size = maptip_edge_size*ratio;
      drawMap();
      set_temp_state(ratio);
    } else if(event.keyCode === 226 && ratio > 0.41) {
      ratio -= 0.1;
      now_maptip_edge_size = maptip_edge_size*ratio;
      drawMap();
      set_temp_state(ratio);
    }

  }, []);

  // 拡大縮小後の再描画
  function drawMap() {
    //console.log(propGetCanvasHeight(),propGetCanvasWidth());
    resizeCanvas();
  }

  document.oncontextmenu = contextmenu;

  function contextmenu() {
	  return false;
  }

  // useEffect: 副作用を有する可能性のある命令型のコードを受け付ける
  // 副作用をReactのrenderフェーズで行うとバグとか非整合が起こるのでこれ使う
  useEffect(() => {
    isSelecting =  isSelecting;
    now_canvas_size[0] = propGetCanvasHeight();
    now_canvas_size[1] = propGetCanvasWidth();
    document.addEventListener("keydown", enterFunction, false);
    const ctx: CanvasRenderingContext2D = getContext(); // 二次元グラフィックスのコンテキストを取得
    ctx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);//プログラム更新時に一旦全体をクリアする
    // x 方向にi=0～14まで15マスを描画する
    for (i = 0; i < propGetCanvasWidth(); i++) {
      // y 方向にy=0～14まで15マスを描画する
      for (j = 0; j < propGetCanvasHeight(); j++) {
        if (propGetMapTip(j, i) == -1) {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.strokeRect(i*now_maptip_edge_size, j*now_maptip_edge_size, now_maptip_edge_size, now_maptip_edge_size);
          
          continue;
        }
        img.src = `${process.env.PUBLIC_URL}/maptip/maptip${propGetMapTip(j, i) + 1}.png`
        ctx.beginPath();
        ctx.drawImage(img, i*now_maptip_edge_size, j*now_maptip_edge_size, now_maptip_edge_size, now_maptip_edge_size);
      }
    }

       
    ctx.save(); // Saves the current drawing style state using a stack so you can revert any change you make to it using restore().
  })

  return (
    <div className="layer-wrap">
      <canvas
      id = "mapCanvas"
      className="MapCanvas"
      width={propGetCanvasWidth()*maptip_edge_size*ratio}
      height={propGetCanvasHeight()*maptip_edge_size*ratio}
      ref={canvasRef}
      onMouseDown={handleOnMouseDown} //マウスが押されたとき
      onMouseMove={handleMouseMove}   //マウスが動いているとき
      onMouseUp={handleOnMouseUp}     //マウスを離したとき
      onMouseOut={handleOnMouseUp}    //マウスがキャンバスの外に出た時
    />
    <canvas
      id = "mapCanvas"
      className="MapCanvas"
      width={propGetCanvasWidth()*maptip_edge_size*ratio}
      height={propGetCanvasHeight()*maptip_edge_size*ratio}
      ref={effectRef}
      onMouseDown={handleOnMouseDown} //マウスが押されたとき
      onMouseMove={handleMouseMove}   //マウスが動いているとき
      onMouseUp={handleOnMouseUp}     //マウスを離したとき
      onMouseOut={handleOnMouseUp}    //マウスがキャンバスの外に出た時
    />


    </div>
    

  );
}

export default Map_Canvas;