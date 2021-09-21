import React from "react";
import { Col, Button } from "react-bootstrap";
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
const Tool_bar: React.FC = () => {
  return (
    <Col className="p-1"  style={{color: "$gray-900"}} xs={1} md={1}>
        <Button className="m-1">描</Button>
        <Button className="m-1">消</Button>
        <Button className="m-1">選</Button>
        <Button className="m-1">塗</Button>
        <Button className="m-1">戻</Button>
        <Button className="m-1">進</Button>
    </Col>
  )
}

export default Tool_bar;
