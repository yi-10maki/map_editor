import React from "react";
import { Button,Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
  size: number[],
  set_map_size: (map_size: number[]) => void;
}

type SetProps = () => void;


const Input_map_size: React.FC<Props> = (props) => {
  let map_size = [50,25]

  const handleSet: SetProps = () =>{
    props.set_map_size([map_size])
  };

  const handleXChange = (event) =>{
    map_size[0] = Number(event.target.value)
  };

  const handleYChange = (event) =>{
    map_size[1] = Number(event.target.value)
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>縦</Form.Label>
        <Form.Control type="height_size" placeholder="マップの縦のサイズを入力してください" onChange={handleYChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>横</Form.Label>
        <Form.Control type="width_size" placeholder="マップの横のサイズを入力してください" onChange={handleXChange}/>
      </Form.Group>
      <Button variant="primary" type="change" onclick={handleSet}>
        変更
      </Button>
    </Form>
  )
}

export default Input_map_size;
