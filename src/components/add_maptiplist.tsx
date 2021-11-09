import React, { useState } from "react";
//import { useMemo } from "react";
import { useCallback } from "react"
import "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./add_maptiplist.css"
import { useDropzone } from "react-dropzone";

type Props = {
  set_file_name: (name: string) => void;
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
        let result: string = reader.result as string
        console.log(result)
        props.set_file_name(result)
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

const Add_MapTipList: React.FC<Props> = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="addtip" onClick={handleShow}>
        マップチップリストの追加
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>マップチップリストの追加</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Drop_MapTipList
            set_file_name = {props.set_file_name}
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

export default Add_MapTipList;
