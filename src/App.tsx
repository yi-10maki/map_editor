import React,{useState} from "react";
import Maptip_pallet from "./components/maptip_pallet";
import Tool_bar from "./components/tool_bar";
import Add_MapTipList from "./components/add_maptiplist"
import Map_Canvas from "./components/map_canvas"
import {Container, Row, Col,Button} from 'react-bootstrap';
//import { Console } from "console";

function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

const App: React.FC = () => {
  const [maptip_file, set_file_name] = useState<string[]>([])
  const [ canvas_height] = useState<number>(20)
  const [ canvas_width] = useState<number>(50)

  const [ canvas_tip_data,set_canvas_tip_data] = useState<number[][]>( new Array(canvas_height).fill(new Array(canvas_width).fill(0)) )



  const handleGetMapTip = (h:number , w:number) => {//マップチップが選択されたときに呼び出される関数
    return canvas_tip_data[h][w]
  }

  const _handleClickCanvasTip = (h:number , w:number) => {//キャンバスチップが選択されたときに呼び出される関数
    var temp: number[][] = new Array(canvas_height).fill(new Array(canvas_width).fill(0))
    for(let i: number=0;i<canvas_height;i++){
      for(let j: number=0;j<canvas_width;j++){
        temp[i][j]=canvas_tip_data[i][j]
      }
    }
    //alert(`count：${h}${w}`);
    temp[h][w]=2;//2のところは本当は選択されているマップチップのidが入る
    console.log(temp[h][w])
    set_canvas_tip_data(temp)
  }

  return(
    <div>
      <Maptip_pallet img_name = {maptip_file} />
      <Container style={{ height: String(window.innerHeight-80)+"px" }} fluid >
        <Row className="h-100">
          <Tool_bar />
          <Col xs={9} md={9} className="bg-warning text-white p-1 overflow-scroll h-100">
            <Map_Canvas propGetMapTip={handleGetMapTip} propClickCanvasTip={_handleClickCanvasTip} />
          </Col>
          <Col xs={2} md={2} className="bg-danger text-white p-1">
            <Add_MapTipList
              set_file_name = {(name: string) => set_file_name(mapCSVToArray(name))}
            />
            <Button>{canvas_tip_data}</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
