import React,{useState} from "react";
import Maptip_pallet from "./components/maptip_pallet";
//import Tool_bar from "./components/tool_bar";
import Add_MapTipList from "./components/add_maptiplist";
import Map_Canvas from "./components/map_canvas";
import Input_canvas_size from "./components/input_canvas_size";
import Import_MapData from "./components/import_map_data";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

let i:number;
let j:number;
let next_canvas_size: number[] = [60, 100];

// 受け取ったマップチップリストを配列に変換
function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

const generate2DArray = (m:number, n:number) => {
  return Array.from(new Array(m), _ => new Array(n).fill(-1));
};

const App: React.FC = () => {
  // AppのState これらの値を保持している
  // maptip_file: 受け取ったマップチップのリスト add_maptiplistから受け取ってmaptip_palletで描画
  // selecting_maptip_id: 現在選択中のマップチップのid maptip_palletから受け取って色々使う 初期値は-1
  // canvas_size: エディタのマップのサイズ input_canvas_sizeから受け取って色々使う 初期値は縦50,横25
  const [maptip_file, set_file_name] = useState<string[]>([]);
  const [selecting_maptip_id, set_selecting_maptip_id] = useState<number>(-1);
  const [canvas_size, set_canvas_size] = useState<number[]>([60,100]);
  let [canvas_tip_data,set_canvas_tip_data] = useState<number[][]>( generate2DArray(canvas_size[0], canvas_size[1]) );
  //const [selection_tool_id, set_selection_tool_id] = useState<boolean>(false);

  console.log(canvas_size);
  

  const [exportFileName,set_exportFileName] = useState<string>("sample");


  const handleGetMapTip = (h:number , w:number) => {//マップチップが選択されたときに呼び出される関数
    return canvas_tip_data[h][w]
  }

  const handleGetCanvasHeight = () => {//マップチップが選択されたときに呼び出される関数
    return canvas_size[0]
  }
  const handleGetCanvasWidth = () => {//マップチップが選択されたときに呼び出される関数
    return canvas_size[1]
  }

  const handleEraserClick = () => {//マップチップが選択されたときに呼び出される関数
    set_selecting_maptip_id(-1);
  }

  const handleInputMapData = (map_data : number[][])=>{
    _set_canvas_size([map_data.length, map_data[0].length])
    set_canvas_tip_data(map_data)
  }

  const _handleClickCanvasTip = (h:number , w:number) => {//キャンバスチップが選択されたときに呼び出される関数
    canvas_tip_data[h][w] = selecting_maptip_id;
    // console.log(canvas_tip_data[h][w]);
    console.log(selecting_maptip_id);
    set_canvas_tip_data(canvas_tip_data);
  }

  // 範囲選択の際に用いる関数
  // map_canvas側でid(マップチップの種類)を指定できる
  const _handleCopyCanvasTip = (h:number, w:number, id:number) => {
    canvas_tip_data[h][w] = id;
    set_canvas_tip_data(canvas_tip_data);
  }

  // 出力ファイル名を入力する度に呼ばれるやつ
  const handleExportNameChange = (event: any) => {
    set_exportFileName(event.target.value)
  }

  // キャンバスサイズの変更
  // 入力したサイズを現在のサイズと比較して小さい方を基準にcanvas_tip_dataを再設定する
  const _set_canvas_size = (input_size: number[]) => {
    if(input_size[0]>0 && input_size[1] > 0){
      next_canvas_size[0] = input_size[0];
      next_canvas_size[1] = input_size[1];
      var copy_canvas_size :number[]=[ Math.min( canvas_tip_data.length, input_size[0]), Math.min( canvas_tip_data[0].length, input_size[1])];
      var temp: number[][] = generate2DArray(next_canvas_size[0], next_canvas_size[1]);

      // tempに変更後のサイズ分の変更前のマップチップデータを保存
      for (i = 0; i<copy_canvas_size[0]; i++) {
        for (j = 0; j<copy_canvas_size[1]; j++) {
          temp[i][j] = canvas_tip_data[i][j];
        }
      }

      set_canvas_size(next_canvas_size);
      set_canvas_tip_data(temp);
    }
  }

  const handleDownloadData = () => {
    let records: number[][] = canvas_tip_data;
    let data = records.map((record)=>record.join(',')).join('\r\n');
    let bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([bom, data], {type: 'text/csv'});
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = document.createElement('a');
    if (exportFileName == "") {
      link.download = "map_data.csv";
    } else {
      link.download = exportFileName+".csv";
    }
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return(
    <div>
      <Container fluid >
        <Row className="h-100">
          <Col className="d-flex align-items-center justify-content-center" xs={1} md={1} >
            <Button  variant="prop" className="w-75 h-75 bg-secondary text-white" onMouseDown={handleEraserClick}>消</Button>
          </Col>
          <Col xs={11} md={11}>
          <Maptip_pallet
            img_name = {maptip_file}
            set_selecting_maptip_id = {(maptip_id: number) => set_selecting_maptip_id(maptip_id)}
          />
          </Col>
        </Row>
      </Container>

      <Container style={{ height: String(5)+"px" }} fluid ></Container>

      <Container style={{ height: String(window.innerHeight-80)+"px" }} fluid >
        <Row className="h-100">
          <Col xs={10} md={10} className="bg-secondary text-white p-1 overflow-scroll h-100" style={{backgroundColor: "black-50"}}>
            <Map_Canvas
              //maptip_id = {selecting_maptip_id}
              //canvas_size = {canvas_size}
              propGetCanvasHeight={handleGetCanvasHeight}
              propGetCanvasWidth={handleGetCanvasWidth}
              propGetMapTip={handleGetMapTip}
              propClickCanvasTip={_handleClickCanvasTip}
              propCopyCanvasTip={_handleCopyCanvasTip}
              />
          </Col>
          <Col xs={2} md={2} className="text-white p-1" style={{backgroundColor: "gray"}}>
            <Add_MapTipList
              set_file_name = {(name: string) => set_file_name(mapCSVToArray(name))}
            />
            <Input_canvas_size
              //size = {canvas_size}
              set_canvas_size = {_set_canvas_size}
            />
            <Import_MapData
              set_file_name = {(data: number[][]) => handleInputMapData(data)}
            />
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>出力ファイル名変更</Form.Label>
              <Form.Control type="text" value={exportFileName} placeholder="出力するファイル名を入力して下さい" onChange={handleExportNameChange}/>
            </Form.Group>
            <Button variant="prop" onMouseDown={handleDownloadData}>マップデータ出力</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
