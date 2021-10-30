import React, {useEffect, useRef, useCallback} from "react";

//import "./map_canvas.css"
//import CanvasTip from "./canvas_tip";

{/*
  canvasを用いてエディタの描画部分を作成する
  選択しているマップチップとツールによって描画を変える
  Space+マウスホイールで拡大縮小を行える
*/}

// 可変にしたい（プロパティに入力した値を受け取る）
const canvas_size_x: number = 4000; // default 1マス40px
const canvas_size_y: number = 2400; //
const maptip_edge_size: number = 40;
let ratio: number = 1; // 拡大縮小比率
let i: number, j: number; // for文用
let isDrawing:boolean = false;// マウスが押されているかどうか
let x: number = 0; // マウスのx座標の処理に使う
let y: number = 0; // マウスのy座標の処理に使う
let img = new Image(); // マップチップを保存
img.src = `${process.env.PUBLIC_URL}/maptip/maptip3.png`; // マップチップ仮指定


const Map_Canvas: React.FC = () => {  
  
  const canvasRef = useRef(null); // nullで初期化しているのでcurrentプロパティは書き換えられない

  // CanvasオブジェクトのgetContext()は、キャンパスに描画するためのコンテキスト(CanvasRenderingContext2Dオブジェクトなど)を取得するメソッド
  // 引数にコンテキストの種類を指定する　二次元グラフィックを描画するための2d、三次元グラフィックスを描画するためのwebglが主な引数
  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const resizeCanvas = () => {
    const canvas: any = canvasRef.current;
    canvas.width = canvas_size_x*ratio;
    canvas.height = canvas_size_y*ratio;
  };

  // マウスを押したとき描画フラグをtrue
  function handleOnMouseDown(e:any){
    isDrawing = true;
    handleMouseMove(e);
  }

  // マウスを離したとき描画フラグをfalse
  function handleOnMouseUp(e:any){
    isDrawing = false;
  }

  // 拡大縮小用キー入力受け取り
  // キャンバス部分を選択していなくてもキー入力だけで動作するため他の機能で使わなさそうなキーを使う
  const enterFunction = useCallback((event) => {
    if(event.keyCode === 191 && ratio < 2) {
      ratio += 0.1;
      drawMap();
    } else if(event.keyCode === 226 && ratio > 0.41) {
      ratio -= 0.1;
      drawMap();
    }
  }, []);

  // 拡大縮小後の再描画
  function drawMap() {
    resizeCanvas();
    console.log(ratio);
    const ctx: CanvasRenderingContext2D = getContext(); // 二次元グラフィックスのコンテキストを取得
    // 変数 i,jを定義する
    ctx.clearRect(0, 0, canvas_size_x, canvas_size_y);//プログラム更新時に一旦全体をクリアする
    // x 方向にi=0～14まで15マスを描画する
    for (i = 0; i < 1000; i++) {
      // y 方向にy=0～14まで15マスを描画する
      for (j = 0; j < 500; j++) {
        ctx.beginPath();
        ctx.drawImage(img, i*maptip_edge_size*ratio, j*maptip_edge_size*ratio, maptip_edge_size*ratio, maptip_edge_size*ratio);
      }
    }
        
  }

  function handleMouseMove(e:any){
    if(isDrawing){
      let rect: any = e.target.getBoundingClientRect();
      // マス目に合わせる処理
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      let tmp:number;
      tmp = x % (maptip_edge_size*ratio);
      x -= tmp;
      tmp = y % (maptip_edge_size*ratio);
      y -= tmp;
      drawMapTip(x, y);
    }
  }

  // クリックされた部分の描画
  function drawMapTip(cx:number, cy:number) {
    const ctx: CanvasRenderingContext2D = getContext();
    let img = new Image();
    img.src = `${process.env.PUBLIC_URL}/maptip/maptip2.png`
    ctx.drawImage(img, cx, cy, maptip_edge_size*ratio, maptip_edge_size*ratio);
    console.log(cx, cy, maptip_edge_size*ratio, maptip_edge_size*ratio)
  }


  // useEffect: 副作用を有する可能性のある命令型のコードを受け付ける
  // 副作用をReactのrenderフェーズで行うとバグとか非整合が起こるのでこれ使う
  useEffect(() => {
    document.addEventListener("keydown", enterFunction, false);

    const ctx: CanvasRenderingContext2D = getContext(); // 二次元グラフィックスのコンテキストを取得
    ctx.clearRect(0, 0, canvas_size_x, canvas_size_y);//プログラム更新時に一旦全体をクリアする
    // x 方向にi=0～14まで15マスを描画する
    for (i = 0; i < 1000; i++) {
      // y 方向にy=0～14まで15マスを描画する
      for (j = 0; j < 500; j++) {
        ctx.beginPath();
        ctx.drawImage(img, i*maptip_edge_size*ratio, j*maptip_edge_size*ratio, maptip_edge_size*ratio, maptip_edge_size*ratio);
      }
    }
       
    ctx.save(); // Saves the current drawing style state using a stack so you can revert any change you make to it using restore().
  })

  return (
    
    <canvas
      id = "mapCanvas"
      className="MapCanvas"
      width={canvas_size_x*ratio}
      height={canvas_size_y*ratio}
      ref={canvasRef}
      onMouseDown={handleOnMouseDown} //マウスが押されたとき
      onMouseMove={handleMouseMove}   //マウスが動いているとき
      onMouseUp={handleOnMouseUp}     //マウスを離したとき
    />

  );
}

export default Map_Canvas;
