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

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
const Maptip_pallet: React.FC = () => {
  return (
    <div className="App">
      <div
        style={{ position: "relative", overflow: "hidden", border: "solid" }}
      >
        {/** ScrollContainer でドラッグできる範囲を括ります */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div style={{ display: "flex" }}>
            {/** 0から100までのマップを表示*/}
            {range(0, 100).map((i) => (
              <Button style={{ margin: "1em .25em" }}>{i}</Button>
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  )
}

export default Maptip_pallet;