import React from "react";
import { Button,Form } from "react-bootstrap";
import "./input_canvas_size.css"
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
  //size: number[],
  set_canvas_size: (s: number[]) => void;
}

type SetProps = () => void;

type ChangeProps = (event: any) => void;

let canvas_size: number[] = [60,100];

const Input_canvas_size: React.FC<Props> = ({
  set_canvas_size,
  //size,
}) => {

  const handleHeightChange: ChangeProps = (event) =>{
    canvas_size[0] = Number(event.target.value);
    console.log(canvas_size[0]); //受け取れてる
  };

  const handleWidthChange: ChangeProps = (event) =>{
    canvas_size[1] = Number(event.target.value)
    console.log(canvas_size[1]); //受け取れてる
  };

  const handleSet: SetProps = () =>{
    set_canvas_size(canvas_size); // ？？？？？？？？？？？？
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>縦</Form.Label>
        <Form.Control type="number" placeholder="マップの縦のサイズを入力してください" onChange={handleHeightChange}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>横</Form.Label>
        <Form.Control type="number" placeholder="マップの横のサイズを入力してください" onChange={handleWidthChange}/>
      </Form.Group>
      <Button variant="change" type="button" onClick={handleSet}>
        変更
      </Button>
    </Form>
  )
}

export default Input_canvas_size;
