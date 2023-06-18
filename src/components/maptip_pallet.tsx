import React, { useEffect,useState } from "react";
import Maptip from "./maptip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./maptip_pallet.css"
import ScrollContainer from "react-indiana-drag-scroll";

type Props = {
  img_name: string[],
  set_selecting_maptip_id: (maptip_id: number) => void;
}


/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
const MaptipPallet: React.FC<Props> = ({ img_name, set_selecting_maptip_id, }) => {

  //const [ selecting_maptip_id, setSelectingMaptipId]=useState<number>(-1);//選んでいるマップチップの番号
  const [sel, setSel]=useState<boolean[]>(Array.from(Array(img_name.length), () => false));
  //選んでいるマップチップの番号だけtrueで後がfalseになっている配列。かなり力技だから良くない


  const handleClick = (child_id:number) => {//マップチップが選択されたときに呼び出される関数
    //setSelectingMaptipId(child_id);
    /*if(0<=selecting_maptip_id && selecting_maptip_id <img_names.length){
      setSel([...sel, true]);
    }*/
    setSel(Array.from(Array(img_name.length), (v,k) => k===child_id));
  };

  // selの値が更新されるかつ再レンダリングがかかったタイミングで実行
  //    forEachでselの中でtrueのmaptipのidをApp.tsxのselecting_maptip_idにセットする
  //    maptipのファイル名は1ベース前提！！！！！！！！！！！！！
  //    配列は0ベース
  useEffect(() => {
    sel.forEach((e: boolean,index: number) => {
      if(e){
        set_selecting_maptip_id(index)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
    })},[sel])

  return (
    <div className="App">
      <div
        style={{position: "relative", overflow: "hidden", border: "solid", height: "80px"}}
      >
        {/** ScrollContainer でドラッグできる範囲を括ります */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div style={{ display: "flex" }}>
            {/** 読み込んだリストにある画像をマップチップとして表示*/}
            {img_name.map((img_name:string,id:number) => (
              <Maptip
                prop_id={id}
                prop_img_name={img_name}
                prop_image_edge_length={"48"}
                prop_selected={sel[id]}
                propHandleClick={handleClick}
                key={id}
              />
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  )
}

export default MaptipPallet;