import React,{useState} from "react";
import Maptip_pallet from "./components/maptip_pallet";
import Tool_bar from "./components/tool_bar";
import Add_MapTipList from "./components/add_maptiplist"
import Map_Canvas from "./components/map_canvas"
import Input_canvas_size from "./components/input_canvas_size"
import {Container, Row, Col} from 'react-bootstrap';

//let i:number; 
//let j:number;

function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

const generate2DArray = (m:number, n:number) => {
  return Array.from(new Array(m), _ => new Array(n).fill(2));
};



const App: React.FC = () => {
  // AppのState これらの値を保持している
  //  maptip_file: 受け取ったマップチップのリスト add_maptiplistから受け取ってmaptip_palletで描画
  //  selecting_maptip_id: 現在選択中のマップチップのid maptip_palletから受け取って色々使う 初期値は-1
  //  canvas_size: エディタのマップのサイズ input_canvas_sizeから受け取って色々使う 初期値は縦50,横25
  const [maptip_file, set_file_name] = useState<string[]>([]);
  const [selecting_maptip_id,set_selecting_maptip_id] = useState<number>(-1);
  const [canvas_size, set_canvas_size] = useState<number[]>([50,25])
  console.log(canvas_size);

  let [canvas_height_num] = useState<number>(60)
  let [canvas_width_num] = useState<number>(100)
  let [canvas_tip_data,set_canvas_tip_data] = useState<number[][]>( generate2DArray(canvas_width_num, canvas_height_num) )
  //let temp: number[][] = generate2DArray(canvas_width_num, canvas_height_num)

  const handleGetMapTip = (h:number , w:number) => {//マップチップが選択されたときに呼び出される関数
    return canvas_tip_data[h][w]
  }

  const _handleClickCanvasTip = (h:number , w:number) => {//キャンバスチップが選択されたときに呼び出される関数
    
    //for(i = 0; i<canvas_height_num; i++){
    //  for(j = 0; j<canvas_width_num; j++){
    //    temp[i][j] = canvas_tip_data[i][j]
    //  }
    //}
    //alert(`count：${h}${w}`);
    canvas_tip_data[h][w]=0;//1のところは本当は選択されているマップチップのidが入る
    //console.log(temp[h][w])
    console.log(canvas_tip_data[0])
    set_canvas_tip_data(canvas_tip_data)
  }
  


  return(
    <div>
      <Maptip_pallet
        img_name = {maptip_file}
        set_selecting_maptip_id = {(maptip_id: number) => set_selecting_maptip_id(maptip_id)}
      />
      <Container style={{ height: String(window.innerHeight-80)+"px" }} fluid >
        <Row className="h-100">
          <Tool_bar />
          <Col xs={9} md={9} className="bg-warning text-white p-1 overflow-scroll h-100">

            <Map_Canvas
              maptip_id = {selecting_maptip_id}
              canvas_size = {canvas_size}
              propGetMapTip={handleGetMapTip} 
              propClickCanvasTip={_handleClickCanvasTip}
              />

          </Col>
          <Col xs={2} md={2} className="bg-danger text-white p-1">
            <Add_MapTipList
              set_file_name = {(name: string) => set_file_name(mapCSVToArray(name))}
            />

            <Input_canvas_size
              size = {canvas_size}
              set_canvas_size = {(canvas_size: number[]) => set_canvas_size(canvas_size)}

            <Button>{canvas_tip_data}</Button>
              
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;