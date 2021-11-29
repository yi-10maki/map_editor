import React from "react";
import { Col, Button } from "react-bootstrap";
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tool_bar.css"

const Tool_bar: React.FC = () => {
  return (
    <Col className="p-1" xs={1} md={1} style={{backgroundColor: "gray"}}>
      
      <Button className="m-1" variant="tool_bar">戻</Button>
      <Button className="m-1" variant="tool_bar">進</Button>
    </Col>
  )
}

export default Tool_bar;