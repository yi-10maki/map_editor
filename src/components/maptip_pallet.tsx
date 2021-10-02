import React, { useState } from "react";
//import { Button } from "react-bootstrap";
import Maptip from "./maptip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./maptip_pallet.css"
import ScrollContainer from "react-indiana-drag-scroll";


function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}



/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
const Maptip_pallet: React.FC = () => {
  const img_names: string[] = mapCSVToArray("maptip1.png,maptip2.png,maptip3.png");
  const [ selecting_maptip_id, setSelectingMaptipId]=useState<number>(-1);
  const [ sel, setSel]=useState<boolean[]>([]);
  
  const handleClick = ( child_id:number) => {
    setSel(Array.from(Array(3), (v,k) => k==selecting_maptip_id));
    setSelectingMaptipId(child_id);
  }

  return (
    <div className="App">
      <div
        style={{ position: "relative", overflow: "hidden", border: "solid", height: "80px"}}
      >
        {/** ScrollContainer でドラッグできる範囲を括ります */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div style={{ display: "flex" }}>
            <button>{sel[1]}</button>
            {/** 0から100までのマップを表示*/}
            {img_names.map((img_name:string,id:number) => (
              <Maptip prop_id={id} prop_img_name={img_name} prop_image_edge_length={"48"} prop_selected={sel[id]} propHandleClick={handleClick} />
            ))}
          </div>
        </ScrollContainer>
        
      </div>
    </div>
  )
}

export default Maptip_pallet;
