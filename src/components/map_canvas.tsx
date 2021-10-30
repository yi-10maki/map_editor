import React, { useEffect, useRef } from 'react';
//import "./map_canvas.css"
//import CanvasTip from "./canvas_tip";

{
  /*
  canvasを用いてエディタの描画部分を作成する
  選択しているマップチップとツールによって描画を変える
*/
}

// 可変にしたい（プロパティに入力した値を受け取る）
const canvas_size_num_x = 50;//チップの個数
const canvas_size_num_y = 20;
const maptip_edge_size: number = 40;
const canvas_size_x: number = canvas_size_num_x * maptip_edge_size;
const canvas_size_y: number = canvas_size_num_y * maptip_edge_size;

type MapCanvasProps = {
  propGetMapTip: (h: number, w: number) => number;
  propClickCanvasTip: (h: number, w: number) => void;
};

const Map_Canvas: React.FC<MapCanvasProps> = ({
  propGetMapTip,
  propClickCanvasTip,
}) => {
  let isDrawing: boolean = false; // マウスが押されているかどうか
  let x: number = 0; // マウスのx座標の処理に使う
  let y: number = 0; // マウスのy座標の処理に使う
  const canvasRef = useRef(null); // nullで初期化しているのでcurrentプロパティは書き換えられない

  // CanvasオブジェクトのgetContext()は、キャンパスに描画するためのコンテキスト(CanvasRenderingContext2Dオブジェクトなど)を取得するメソッド
  // 引数にコンテキストの種類を指定する　二次元グラフィックを描画するための2d、三次元グラフィックスを描画するためのwebglが主な引数
  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  //App.tsxからマップチップデータをもらう
  const getMapTip = (h: number, w: number) => {
    //マップチップが選択されたときに呼び出される関数
    return propGetMapTip(h,w);
  };

  // マウスを押したとき描画フラグをtrue
  function handleOnMouseDown(e: any) {
    isDrawing = true;
    handleCanvasClick(e);
  }

  // マウスを離したとき描画フラグをfalse
  function handleOnMouseUp(e: any) {
    isDrawing = false;
  }

  // マウスの位置を受け取ってその位置のマップチップを変える
  function handleCanvasClick(e: any) {
    if (isDrawing) {
      let rect = e.target.getBoundingClientRect();

      // マス目に合わせる処理
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      let tmp: number;
      tmp = x %  maptip_edge_size;
      x -= tmp;
      tmp = y %  maptip_edge_size;
      y -= tmp;
      propClickCanvasTip(y/maptip_edge_size ,x/maptip_edge_size);
      drawMapTip();
    }
  }

  // クリックされた部分の描画
  function drawMapTip() {

    //Add by Haniwa

    const ctx: CanvasRenderingContext2D = getContext();
    let img = new Image();
    //img.src = `${process.env.PUBLIC_URL}/maptip/maptip2.png`;
    img.src = `${process.env.PUBLIC_URL}/maptip/maptip${getMapTip(y/maptip_edge_size,x/maptip_edge_size) + 1}.png`;
    ctx.drawImage(img, x, y,  maptip_edge_size,  maptip_edge_size);

  }

  // useEffect: 副作用を有する可能性のある命令型のコードを受け付ける
  // 副作用をReactのrenderフェーズで行うとバグとか非整合が起こるのでこれ使う
  //
  useEffect(() => {
    const ctx: CanvasRenderingContext2D = getContext(); // 二次元グラフィックスのコンテキストを取得
    //ctx.fillRect(0,0, 10, 500); // 座標(x, y) を始点とし大きさ (width, height) の領域を、(訳注: 現在の塗りつぶしスタイルを用いて) 塗りつぶす
    // 変数 i,jを定義する
    let i: number, j: number;
    ctx.clearRect(0, 0, canvas_size_x, canvas_size_y); //プログラム更新時に一旦全体をクリアする

    let img = new Image();
    //img.src = `${process.env.PUBLIC_URL}/maptip/maptip3.png`;
    // x 方向にi=0～14まで15マスを描画する
    for (i = 0; i < canvas_size_num_x; i++) {
      // y 方向にy=0～14まで15マスを描画する
      for (j = 0; j < canvas_size_num_y; j++) {
        ctx.beginPath();
        img.src = `${process.env.PUBLIC_URL}/maptip/maptip${getMapTip(j,i) + 1}.png`;
        // i の値によって r(赤)の輝度を変化させる
        // toString(10)で、文字列に変換
        //var red = (i * 18).toString(10);
        //ctx.fillStyle = 'rgb(200,200,200)';
        // i,j を座標に変換
        //ctx.rect(i * 40, j * 40, 39, 39);
        //ctx.fill(); // 色を塗る
        ctx.drawImage(img, i *  maptip_edge_size, j *  maptip_edge_size,  maptip_edge_size,  maptip_edge_size);
      }
    }
    ctx.save(); // Saves the current drawing style state using a stack so you can revert any change you make to it using restore().
  });

  return (

    <canvas
      className="MapCanvas"
      width={canvas_size_x}
      height={canvas_size_y}
      ref={canvasRef}
      onMouseDown={handleOnMouseDown} //マウスが押されたとき
      onMouseMove={handleCanvasClick} //マウスが動いているとき
      onMouseUp={handleOnMouseUp} //マウスを離したとき
    />

  );
};

export default Map_Canvas;
