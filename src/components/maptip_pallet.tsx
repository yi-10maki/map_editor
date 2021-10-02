import React from "react";
import Maptip from "./maptip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./maptip_pallet.css"
import ScrollContainer from "react-indiana-drag-scroll";

type Props = {
  file_name: string
}

function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット**/
const Maptip_pallet: React.FC<Props> = ({file_name}) => {
  const img_names: string[] = mapCSVToArray(file_name);

  return (
    <div className="App">
      <div
        style={{ position: "relative", overflow: "hidden", border: "solid", height: "80px"}}
      >
        {/** ScrollContainer でドラッグできる範囲を括ります */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div style={{ display: "flex" }}>
            {/** 0から100までのマップを表示*/}
            {img_names.map((img_name:string,id:number) => (
              <Maptip id={id} img_name={img_name} image_edge_length={"48"}/>
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  )
}

export default Maptip_pallet;
