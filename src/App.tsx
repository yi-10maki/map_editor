import React,{useState} from "react";
import Maptip_pallet from "./components/maptip_pallet";
import Tool_bar from "./components/tool_bar";
import Add_MapTipList from "./components/add_maptiplist"
import {Container, Row, Col} from 'react-bootstrap';

const App: React.FC = () => {
  const [maptip_file, set_file_name] = useState<string>("No_data")
  console.log(maptip_file)
  return(
    <div>
      <Maptip_pallet file_name = "hoge" />
      <Container style={{ height: String(window.innerHeight-80)+"px" }} fluid >
        <Row className="h-100">
          <Tool_bar />
          <Col xs={9} md={9} className="bg-warning text-white p-1">Editor</Col>
          <Col xs={2} md={2} className="bg-danger text-white p-1">
            <Add_MapTipList
              set_file_name = {(name: string) => set_file_name(name)}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
