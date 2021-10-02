import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/
class Maptip extends React.Component<
  { id: number; img_name: string; image_edge_length: string },
  { id: number; img_name: string; image_edge_length: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: props.id,
      img_name: props.img_name,
      image_edge_length: props.image_edge_length,
    };
  }

  render() {
    return (
      <Button className="m-1">
        <img
          src={`${process.env.PUBLIC_URL}/maptip/` + this.state.img_name}
          width={this.state.image_edge_length}
          height={this.state.image_edge_length}
        />
      </Button>
    );
  }
}

export default Maptip;
