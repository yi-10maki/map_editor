import React,{useState} from "react";
import Maptip_pallet from "./components/maptip_pallet";
import Tool_bar from "./components/tool_bar";
import Add_MapTipList from "./components/add_maptiplist"
import {Container, Row, Col} from 'react-bootstrap';

function mapCSVToArray(csv: string): string[] {
  return csv.split(',');
}

const App: React.FC = () => {
  const [maptip_file, set_file_name] = useState<string[]>([])

  return(
    <div>
      <Maptip_pallet img_name = {maptip_file} />
      <Container style={{ height: String(window.innerHeight-80)+"px" }} fluid >
        <Row className="h-100">
          <Tool_bar />
          <Col xs={9} md={9} className="bg-warning text-white p-1">Editor</Col>
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
