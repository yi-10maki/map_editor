import React from "react";
import { Button,Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
  size: number[],
  set_canvas_size: (size: number[]) => void;
}

type SetProps = () => void;

type ChangeProps = (event: any) => void;


const Input_canvas_size: React.FC<Props> = (props) => {
  let canvas_size: number[] = [50,25]

  const handleSet: SetProps = () =>{
    props.set_canvas_size(canvas_size)
  };

  const handleXChange: ChangeProps = (event) =>{
    canvas_size[0] = Number(event.target.value)
  };

  const handleYChange: ChangeProps = (event) =>{
    canvas_size[1] = Number(event.target.value)
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>縦</Form.Label>
        <Form.Control type="number" placeholder="マップの縦のサイズを入力してください" onChange={handleYChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>横</Form.Label>
        <Form.Control type="number" placeholder="マップの横のサイズを入力してください" onChange={handleXChange}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSet}>
        変更
      </Button>
    </Form>
  )
}

export default Input_canvas_size;
