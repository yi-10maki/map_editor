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


/** GetCsvDataでcsvファイルを取得 */
const getArrayFromCsv = ( dataPath: string ) => {
  var request = new XMLHttpRequest();
  request.open('GET', dataPath, false);
  try {
    request.send();
  } catch (err) {
    console.log(err)
  }
  console.log(request.responseText);
  return request.responseText;
}

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット**/
const Maptip_pallet: React.FC = () => {
  {/** GetCsvDataでcsvファイルの情報を配列で取得 */}
  const data:string[] = getArrayFromCsv("TipList.csv");

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
              <Button style={{ margin: "1em .25em" }} key={i}>{i}</Button>
            ))}
          </div>
        </ScrollContainer>
        {data}
      </div>
    </div>
  )
}

export default Maptip_pallet;
