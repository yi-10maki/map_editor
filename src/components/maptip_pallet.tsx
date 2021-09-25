import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollContainer from "react-indiana-drag-scroll";


function getCSV(file_path:string) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成、サーバと非同期通信するためのAPI
    req.open("get", file_path, true); // アクセスするファイルを指定
    req.onload = () => {
      if (req.readyState === 4 && req.status === 0) {
        resolve(mapCSVToArray(req.responseText));
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = () => {
      reject(new Error(req.statusText));
    };
    req.send(null); // HTTPリクエストの発行
  });
}


function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

async function getData() {
  const img_names: any=await getCSV(`${process.env.PUBLIC_URL}/maptip/TipList`);
  return img_names;
}

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
const Maptip_pallet: React.FC = () => {
  //const img_names: string[] = mapCSVToArray("maptip1.png,maptip2.png,maptip3.png");
  var data_promise: any = getData();
  const img_names : string[] = [];
  data_promise;
  const image_edge_length : string="48";

  return (
    <div className="App">
      <div
        style={{ position: "relative", overflow: "hidden", border: "solid", height: "80px"}}
      >
        {/** ScrollContainer でドラッグできる範囲を括ります */}
        <ScrollContainer ignoreElements={"#not-work-drag"}>
          <div style={{ display: "flex" }}>
            {/** 0から100までのマップを表示*/}
            {img_names.map((img_name) => (
              <Button className="m-1">
                <img src={`${process.env.PUBLIC_URL}/maptip/`+img_name} width={image_edge_length} height={image_edge_length} />
              </Button>
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  )
}

export default Maptip_pallet;
