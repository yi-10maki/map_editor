import React, {useEffect, useRef, useCallback, useState} from "react";

import "./map_canvas.css"
//import CanvasTip from "./canvas_tip";

{/*
  canvasを用いてエディタの描画部分を作成する
  選択しているマップチップとツールによって描画を変える
  Space+マウスホイールで拡大縮小を行える
*/}

const maptip_edge_size: number = 40;
let ratio: number = 1; // 拡大縮小比率
let i: number, j: number; // for文用
let isDrawing: boolean = false; // マウスが左クリックされているかどうか
let isSelecting: boolean = false; // マウスが右クリックされているかどうか
let isMoving: boolean = false; // 選択した範囲を動かしているか
let x: number = 0; // マウスのx座標の処理に使う
let y: number = 0; // マウスのy座標の処理に使う
let startSelect: number[] = [0, 0]; // 右クリックを押した座標
let endSelect: number[] = [0, 0] ; // 右クリックを離した座標
let img = new Image(); // マップチップを保存
//img.src = `${process.env.PUBLIC_URL}/maptip/maptip3.png`; // マップチップ仮指定
let now_maptip_edge_size: number = maptip_edge_size*ratio;
let now_canvas_size: number[] = [60, 100];
let selectArea: number[] = [0, 0, 0, 0]; // 選択範囲の左上と右下の座標
let areaMove:number[] = [0, 0]; // 選択範囲の移動距離
let startMove:number[] = [0, 0]; // 選択範囲内のどこを押したか

type MapCanvasProps = {
  //maptip_id: number
  propGetCanvasHeight: () => number;
  propGetCanvasWidth: () => number;
  propGetMapTip: (h: number, w: number) => number;
  propClickCanvasTip: (h: number, w: number) => void;
  propCopyCanvasTip: (h: number, w: number, id:number) => void;
};

const Map_Canvas: React.FC<MapCanvasProps> = ({
  //maptip_id,
  propGetCanvasHeight,
  propGetCanvasWidth,  
  propGetMapTip,
  propClickCanvasTip,
  propCopyCanvasTip
}) => {
  const [temp_state, set_temp_state] = useState<number>(0);
  const [update,　setUpdata]　=　useState<boolean>(false);
  const canvasRef = useRef(null); // nullで初期化しているのでcurrentプロパティは書き換えられない
  const effectRef = useRef(null);
  const moveRef = useRef(null);
  console.log(temp_state); // 使いどころがないのでエラー回避のためにここで使っておく
  console.log(update); // 〃

  // CanvasオブジェクトのgetContext()は、キャンパスに描画するためのコンテキスト(CanvasRenderingContext2Dオブジェクトなど)を取得するメソッド
  // 引数にコンテキストの種類を指定する　二次元グラフィックを描画するための2d、三次元グラフィックスを描画するためのwebglが主な引数
  const getContext = (): CanvasRenderingContext2D => { // メインのCanvas
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const getEffectContext = (): CanvasRenderingContext2D => { // 選択範囲の描画用Canvas
    const canvas: any = effectRef.current;
    return canvas.getContext('2d');
  };

  const getMoveContext = (): CanvasRenderingContext2D => { // 選択範囲の移動先描画用Canvas
    const canvas: any = moveRef.current;
    return canvas.getContext('2d');
  };

  // 2次元配列の生成に用いる
  // なんかこういう風に宣言しないとアドレスがバグる
  const generate2DArray = (m:number, n:number) => {
    return Array.from(new Array(m), _ => new Array(n).fill(-1));
  };

  // キャンバスサイズの変更
  const resizeCanvas = () => {
    const canvas: any = canvasRef.current;
    const effect_canvas: any = effectRef.current;
    canvas.height = now_canvas_size[0] * maptip_edge_size * ratio;
    canvas.width = now_canvas_size[1] * maptip_edge_size * ratio;
    effect_canvas.height = now_canvas_size[0] * maptip_edge_size * ratio;
    effect_canvas.width = now_canvas_size[1] * maptip_edge_size * ratio;
    console.log("resize")
  };

  // マウスのボタンを押したときに呼ばれる関数
  function handleOnMouseDown(e:any) {
    if(e.nativeEvent.which === 1) { // マウスの左クリックをしたとき
      isDrawing = true;
    } else if(e.nativeEvent.which === 3) { // マウスの右クリックをしたとき
      startSelect = matchGrid(e);
      if(inSelectArea()) { // 右クリックした場所が選択範囲内だった時
        isMoving = true;
        console.log("isMoveing")
      } else {
        isSelecting = true;
        console.log("isSelecting")
      }
    } else if(e.nativeEvent.which === 2 && isSelecting) { // 範囲選択をしている状態でマウスの中央クリックをしたとき
      e.preventDefault();
      fillArea(e);
    }
    handleMouseMove(e);
  }

  // 選択範囲内をクリックしたかどうかのチェック
  const inSelectArea = (): boolean => {
    if(Math.floor(startSelect[0]/now_maptip_edge_size) >= selectArea[0] && Math.floor(startSelect[0]/now_maptip_edge_size) <= selectArea[0]+selectArea[2]) {
      if(Math.floor(startSelect[1]/now_maptip_edge_size) >= selectArea[1] && Math.floor(startSelect[1]/now_maptip_edge_size) <= selectArea[1]+selectArea[3]) {
        console.log("inSelectingArea")
        startMove = [Math.floor(startSelect[0]/now_maptip_edge_size), Math.floor(startSelect[1]/now_maptip_edge_size)]
        return true;
      }
    }
    return false;
  }

  // マウスのボタンを離したときに呼ばれる関数
  function handleOnMouseUp(e:any) {
    if(e.nativeEvent.which === 1) { // マウス右ボタンを離したとき描画フラグをfalse
      isDrawing = false;
    } else if(e.nativeEvent.which === 3) {
      const ectx: CanvasRenderingContext2D = getEffectContext();
      const mctx: CanvasRenderingContext2D = getMoveContext();
      mctx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);
      if(isMoving === false) { // 選択範囲の移動中でない場合
        ectx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);
        endSelect = matchGrid(e);
        if(startSelect[0] == endSelect[0] && startSelect[1] == endSelect[1]) { // 1マス選択は無理
          isSelecting = false;
          selectArea = [0, 0, 0, 0]; // selectAreaを初期化
        } else { // 選択した範囲を取得し、その範囲を表示する
          selectArea = effectGrid(startSelect, endSelect);
          ectx.strokeStyle = 'red';
          ectx.fillStyle = "rgba(" + [200, 0, 0, 0.1] + ")";
          ectx.strokeRect(selectArea[0]*now_maptip_edge_size, selectArea[1]*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
          ectx.fillRect(selectArea[0]*now_maptip_edge_size, selectArea[1]*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
        }
      } else if(isMoving === true){ // 選択範囲の移動中
        if(areaMove[0] != 0 || areaMove[1] != 0) { // 移動距離が0でないときのみ移動を行う
          ectx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);
          let selectAreaTips: number[][] = generate2DArray(selectArea[2], selectArea[3]); // 範囲選択した部分のマップチップデータ
          for(i = 0; i < selectArea[2]; i++) {
            for(j = 0; j < selectArea[3]; j++) {
              selectAreaTips[i][j] = propGetMapTip(Math.floor(selectArea[1]+j), Math.floor(selectArea[0]+i));
              propCopyCanvasTip(selectArea[1]+j, selectArea[0]+i, -1);
            }
          }
          selectArea[0] += areaMove[0];
          selectArea[1] += areaMove[1];
          for(i = 0; i < selectArea[2]; i++) {
            for(j = 0; j < selectArea[3]; j++) {
              propCopyCanvasTip(selectArea[1]+j, selectArea[0]+i, selectAreaTips[i][j]);
            }
          }
          ectx.strokeStyle = 'red';
          ectx.fillStyle = "rgba(" + [200, 0, 0, 0.1] + ")";
          ectx.strokeRect(selectArea[0]*now_maptip_edge_size, selectArea[1]*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
          ectx.fillRect(selectArea[0]*now_maptip_edge_size, selectArea[1]*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
          setUpdata(prestate => !prestate);
        }
        isMoving = false;
        areaMove = [0, 0];
      }
      
    }
  }

  // 選択範囲を[始点のx座標，始点のy座標，x方向の選択距離，y方向の選択距離]の形で取得
  // 単位はマス目なのでpxで使いたい場合は *now_maptip_edge_size をする必要がある
  const effectGrid = (s:number[], e:number[]) => {
    const selectingArea: number[] = [Math.floor(Math.min(s[0], e[0])/now_maptip_edge_size), Math.floor(Math.min(s[1], e[1])/now_maptip_edge_size), Math.floor(Math.abs(s[0]-e[0])/now_maptip_edge_size + 1), Math.floor(Math.abs(s[1]-e[1])/now_maptip_edge_size + 1)]; 
    console.log(selectingArea);
    return selectingArea;
  }

  // startSelectとendSelectをセットするときに使う
  // 単位はpxなのでマス目で使いたい場合は /now_maptip_edge_size をする必要がある
  const matchGrid = (e:any) => {
    let rect: any = e.target.getBoundingClientRect();
    // マス目に合わせる処理
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    let tmp:number;
    tmp = x % now_maptip_edge_size;
    x -= tmp;
    tmp = y % now_maptip_edge_size;
    y -= tmp;
    return [x, y]
  }

　// マウスの移動中に呼び出される関数
  function handleMouseMove(e:any) {
    if(isDrawing) { // 描画中（左クリック中）
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
      console.log(propGetMapTip(Math.floor(y/now_maptip_edge_size), Math.floor(x/now_maptip_edge_size)))
      drawMapTip(x, y);
    } else if(isMoving) { // 選択範囲の移動中（右クリック中）
      const mctx: CanvasRenderingContext2D = getMoveContext();
      mctx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);
    　// マス目に合わせる処理
      let rect: any = e.target.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      let tmp:number;
      tmp = x % now_maptip_edge_size;
      x -= tmp;
      tmp = y % now_maptip_edge_size;
      y -= tmp;
      // 移動先がCanvas外に行かないように(範囲外を参照しないように)する処理
      if(selectArea[0]+Math.floor(x/now_maptip_edge_size)-startMove[0]>=0 && selectArea[1]+Math.floor(y/now_maptip_edge_size)-startMove[1]>=0) {
        if(selectArea[0]+selectArea[2]+Math.floor(x/now_maptip_edge_size)-startMove[0]<=propGetCanvasWidth() && selectArea[1]+selectArea[3]+Math.floor(y/now_maptip_edge_size)-startMove[1]<=propGetCanvasHeight())
        areaMove = [Math.floor(x/now_maptip_edge_size)-startMove[0], Math.floor(y/now_maptip_edge_size)-startMove[1]];
      }
      mctx.strokeStyle = 'blue';
      mctx.fillStyle = "rgba(" + [0, 0, 200, 0.1] + ")";
      mctx.strokeRect((areaMove[0]+selectArea[0])*now_maptip_edge_size, (areaMove[1]+selectArea[1])*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
      mctx.fillRect((areaMove[0]+selectArea[0])*now_maptip_edge_size, (areaMove[1]+selectArea[1])*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
    }
  }

  // クリックされた部分の描画
  function drawMapTip(cx:number, cy:number) {
    const ctx: CanvasRenderingContext2D = getContext();
    if (propGetMapTip(Math.floor(cy/now_maptip_edge_size), Math.floor(cx/now_maptip_edge_size)) == -1) {
      ctx.clearRect(cx, cy, now_maptip_edge_size, now_maptip_edge_size);
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.strokeRect(cx, cy, now_maptip_edge_size, now_maptip_edge_size);
    } else {
      img.src = `${process.env.PUBLIC_URL}/maptip/maptip${propGetMapTip(Math.floor(y/ now_maptip_edge_size), Math.floor(x/ now_maptip_edge_size)) + 1}.png`
      ctx.drawImage(img, cx, cy, now_maptip_edge_size, now_maptip_edge_size);
      console.log(cx, cy, now_maptip_edge_size, now_maptip_edge_size)
      console.log(propGetMapTip(Math.floor(y/ now_maptip_edge_size), Math.floor(x/ now_maptip_edge_size)))
    }
  }

  // 拡大縮小用キー入力受け取り
  // キャンバス部分を選択していなくてもキー入力だけで動作するため他の機能で使わなさそうなキーを使う
  // ちなみにここでuseStateを変更しようとすると何故かできない
  const enterFunction = useCallback((event) => {
    if(event.keyCode === 191 && ratio < 2) { // "/"を押したとき拡大　1次関数の傾きが正のイメージ
      ratio += 0.1;
      now_maptip_edge_size = maptip_edge_size*ratio;
      resizeCanvas();
      set_temp_state(ratio);
    } else if(event.keyCode === 226 && ratio > 0.41) { // "\"を押したとき縮小　1次関数の傾きが部のイメージ
      ratio -= 0.1;
      now_maptip_edge_size = maptip_edge_size*ratio;
      resizeCanvas();
      set_temp_state(ratio);
    }
  }, []);

  // 塗りつぶしを行う関数
  function fillArea(e: any) {
    for (i = selectArea[0]; i < selectArea[0]+selectArea[2]; i++) {
      for (j = selectArea[1]; j < selectArea[1]+selectArea[3]; j++) {
        propClickCanvasTip(j,i);
      }
    }
    setUpdata(prestate => !prestate); // useEffectを強制的に呼び出す
  }

  // 右クリックでメニューが開かないようにする
  document.oncontextmenu = contextmenu;
  function contextmenu() {
	  return false;
  }

  // useEffect: 副作用を有する可能性のある命令型のコードを受け付ける
  // 副作用をReactのrenderフェーズで行うとバグとか非整合が起こるのでこれ使う
  // 呼ばれるタイミングはuseStateが変更された時、宣言されたときなど
  useEffect(() => {
    isSelecting =  isSelecting;
    now_canvas_size[0] = propGetCanvasHeight();
    now_canvas_size[1] = propGetCanvasWidth();
    document.addEventListener("keydown", enterFunction, false);
    const ctx: CanvasRenderingContext2D = getContext(); // 二次元グラフィックスのコンテキストを取得
    ctx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);//プログラム更新時に一旦全体をクリアする
    // x 方向に描画する
    for (i = 0; i < propGetCanvasWidth(); i++) {
      // y 方向に描画する
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

    const ectx: CanvasRenderingContext2D = getEffectContext(); 
    ectx.clearRect(0, 0, propGetCanvasWidth()*maptip_edge_size, propGetCanvasHeight()*maptip_edge_size);
    if(isSelecting == true) { 
      ectx.strokeStyle = 'red';
      ectx.fillStyle = "rgba(" + [200, 0, 0, 0.1] + ")";
      ectx.strokeRect(selectArea[0]*now_maptip_edge_size, selectArea[1]*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
      ectx.fillRect(selectArea[0]*now_maptip_edge_size, selectArea[1]*now_maptip_edge_size, selectArea[2]*now_maptip_edge_size, selectArea[3]*now_maptip_edge_size);
    }
       
    ctx.save(); // Saves the current drawing style state using a stack so you can revert any change you make to it using restore().
    return () => {
      // イベントリスナを解除
      document.removeEventListener("keydown", enterFunction, false);
    };
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
    <canvas
      id = "mapCanvas"
      className="MapCanvas"
      width={propGetCanvasWidth()*maptip_edge_size*ratio}
      height={propGetCanvasHeight()*maptip_edge_size*ratio}
      ref={moveRef}
      onMouseDown={handleOnMouseDown} //マウスが押されたとき
      onMouseMove={handleMouseMove}   //マウスが動いているとき
      onMouseUp={handleOnMouseUp}     //マウスを離したとき
      onMouseOut={handleOnMouseUp}    //マウスがキャンバスの外に出た時
    />
  </div>
  );
}

export default Map_Canvas;