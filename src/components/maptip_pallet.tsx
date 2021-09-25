import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollContainer from "react-indiana-drag-scroll";

/** min から max までの数字の入った配列を生成する関数 */
const range = (min:number, max:number, step = 1) => {
  return Array.from(
    { length: (max - min + step) / step },
    (v, k) => min + k * step
  )
}

function fetchText(){
  fetch(`${process.env.PUBLIC_URL}/TipList.txt`)
  .then(response => {response.text()
  })
  .then(text => { alert("aaaaaaa")
  });
} 

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
const Maptip_pallet: React.FC = () => {
  let data = fetchText(); 

  const x: string[] = ["./csv", "josuehu"];
  const y: string = "aaaa" + x;
  return (
    <div className="App">
      <div
        style={{ position: "relative", overflow: "hidden", border: "solid", height: "80px"}}
      >
        {/** ScrollContainer でドラッグできる範囲を括ります */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div style={{ display: "flex" }}>
            {/** 0から100までのマップを表示*/}
            {range(0, 100).map((i) => ( //0からcsvのリストのサイズまでにする
              <Button style={{ margin: "1em .25em" }}>{i}</Button> //imgに変えたい
            ))}
          </div>
        </ScrollContainer>
        
      </div>
      <p className="csv"></p>
      <p>data{y}{data}</p>
    </div>
  )
}

export default Maptip_pallet;
