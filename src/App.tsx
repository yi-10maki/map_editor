import React from "react";
//import ReactDOM from "react-dom";
import { Button } from "react-bootstrap"; // ?
import "bootstrap/dist/css/bootstrap.min.css"; // ?
//import "./styles.css";
 
import ScrollContainer from "react-indiana-drag-scroll";
/** min から max までの数字の入った配列を生成する関数 */
const range = (min:number , max:number, step = 1) => {
  return Array.from(
    { length: (max - min + step) / step },
    (v, k) => min + k * step
  );
};

const App:React.FC = () => {
  return (
    <div className="App">
      <h1>React Indiana Drag Scrollデモ</h1>
      <p>↓の箱の上でドラッグをするとスクロールが起きます</p>
      <div
        style={{ position: "relative", overflow: "hidden", border: "solid" }}
      >
        {/** ScrollContainer でドラッグ範囲を括ります */}
        {/** ignoreElements にドラッグしない部分を指すセレクタを入れると、その上からスクロールできません */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div
            id="not-work-drag"
            style={{
              height: "100%",
              background: "rgba(0, 208, 255, 0.8)",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              left: "12%"
            }}
          >
            <div>この上では</div>
            <div>ドラッグしてもスクロールしません</div>
          </div>
          <div style={{ display: "flex" }}>
            {range(0, 100).map((i) => (
              <Button style={{ margin: "1em .25em" }}>{i}</Button>
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
}

export default App;
