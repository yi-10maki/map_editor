import React,{useState} from "react";
import Maptip_pallet from "./components/maptip_pallet";
import Tool_bar from "./components/tool_bar";
import Add_MapTipList from "./components/add_maptiplist"
import Map_Canvas from "./components/map_canvas"
import {Container, Row, Col} from 'react-bootstrap';

function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

const App: React.FC = () => {
  // AppのState これらの値を保持している
  //  maptip_file: 受け取ったマップチップのリスト add_maptiplistから受け取ってmaptip_palletで描画
  //  selecting_maptip_id: 現在選択中のマップチップのid maptip_palletから受け取って色々使う 初期値は-1
  const [maptip_file, set_file_name] = useState<string[]>([]);
  const [selecting_maptip_id,set_selecting_maptip_id] = useState<number>(-1);
  console.log(selecting_maptip_id);

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
            <Map_Canvas />
          </Col>
          <Col xs={2} md={2} className="bg-danger text-white p-1">
            <Add_MapTipList
              set_file_name = {(name: string) => set_file_name(mapCSVToArray(name))}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
