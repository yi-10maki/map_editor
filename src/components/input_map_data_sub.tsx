import React, { useState } from "react";
//import { useMemo } from "react";
import { useCallback } from "react"
import "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./add_maptiplist.css"
import { useDropzone } from "react-dropzone";

type Props = {
  input_data: (map_data: number[][]) => void;
}


const Drop_MapTipList: React.FC<Props> = (props) => {
	const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.readAsText(file)
      reader.onload = () => {
      // Do whatever you want with the file contents
        let result_text: string = reader.result as string
        let result:number[][]=result_text.split("\r\n").map(text => text.split(",").map(s => Number(s)) )
        result.pop()
        props.input_data(result)
        console.log(result)
			}
		})
  }, [])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: ".csv", onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>ファイルをドロップ</p> :
          <p>ファイルをここにドラッグ＆ドロップする、またはここをクリックしてファイルを開く</p>
      }
    </div>
  )
}

const InputMapData: React.FC<Props> = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="addtip" onClick={handleShow}>
        マップデータ読み込み
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>既存のマップデータを読み込みます。</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Drop_MapTipList
            input_data = {props.input_data}
          />
        </Modal.Body>
        {/*
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            閉じる
          </Button>
        </Modal.Footer>
        */}
      </Modal>
    </>
  )
}

export default InputMapData;
