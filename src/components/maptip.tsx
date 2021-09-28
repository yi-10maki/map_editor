import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";



/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
class Maptip extends React.Component {
  constructor(props: any){
    super(props);
    this.state = {
      id: Number = this.props.id,
      name: String,
      image_edge_length :"48",
    };
  }

  render(){
    return (
      <Button className="m-1">
        <img src={`${process.env.PUBLIC_URL}/maptip/`+name} width={image_edge_length} height={image_edge_length} />
      </Button>
    )
  }
}

export default Maptip;
