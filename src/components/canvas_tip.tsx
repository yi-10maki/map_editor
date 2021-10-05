import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**関数名及びオブジェクト名は先頭大文字で
 * マップパチップパレット:マップチップを表示・選択する**/

type MaptipProps = {
  prop_id: number;
  prop_img_name: string;
  prop_image_edge_length: string;
  prop_selected: boolean;
  propHandleClick: (id: number) => void;
};

const CanvasTip: React.FC<MaptipProps> = ({
  prop_id,
  prop_img_name,
  prop_image_edge_length,
  prop_selected,
  propHandleClick,
}) => {
  const [id] = useState<number>(prop_id);
  const [img_name] = useState<string>(prop_img_name);
  const [image_edge_length] = useState<string>(prop_image_edge_length);
  //const [ selected,setSelected] = useState<boolean>(prop_selected);

  const handleClick = () => {
    propHandleClick(id);
    //setSelected(true);
  };

  if (prop_selected) {
    return (
      <Button className="m-1 bg-secondary" onMouseDown={handleClick}>
        <img
          src={`${process.env.PUBLIC_URL}/maptip/` + img_name}
          width={image_edge_length}
          height={image_edge_length}

        />
      </Button>
    );
  } else {
    return (
      <Button className="m-1 bg-light" onMouseDown={handleClick}>
        <img
          src={`${process.env.PUBLIC_URL}/maptip/` + img_name}
          width={image_edge_length}
          height={image_edge_length}
        />
      </Button>
    );
  }
};

export default CanvasTip;
