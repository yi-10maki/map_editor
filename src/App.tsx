import React from "react";
import Maptip_pallet from "./components/maptip_pallet";
import Tool_bar from "./components/tool_bar";
import {Container, Row, Col} from 'react-bootstrap';

const App: React.FC = () => {
  return(
    <div>
      <Maptip_pallet />
      <Container style={{ height: String(window.innerHeight-80)+"px" }} fluid >
        <Row className="h-100">
          <Tool_bar />
          <Col xs={9} md={9} className="bg-warning text-white p-1">Editor</Col>
          <Col xs={2} md={2} className="bg-danger text-white p-1">Property</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
