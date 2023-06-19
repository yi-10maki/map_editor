import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

type MaptipProps = {
  prop_id: number;//マップチップのid
  prop_img_name: string;//マップチップの画像ファイル名
  prop_image_edge_length: string;//マップチップボタンの一辺の長さ
  prop_selected: boolean;//マップチップが選ばれているか
  propHandleClick: (id: number) => void;//マップチップがクリックされたときに呼び出されるメソッド
};

const Maptip: React.FC<MaptipProps> = ({
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

  //マップチップがクリックされたときの処理
  const handleClick = () => {
    propHandleClick(id);
    //setSelected(true);
  };

  if (prop_selected) {//マップチップが選択されているとき
    return (
      <Button className="m-1 bg-secondary" onMouseDown={handleClick}>
        <img
          src={`${process.env.PUBLIC_URL}/maptip/` + img_name}
          width={image_edge_length}
          height={image_edge_length}
          alt={''}
        />
      </Button>
    );
  } else {//マップチップが選択されていないとき
    return (
      <Button className="m-1 bg-light" onMouseDown={handleClick}>
        <img
          src={`${process.env.PUBLIC_URL}/maptip/` + img_name}
          width={image_edge_length}
          height={image_edge_length}
          alt={''}
        />
      </Button>
    );
  }
};

export default Maptip;