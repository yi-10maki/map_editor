import React, { useState } from "react";
//import { useMemo } from "react";
import {useCallback} from "react"
import "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./add_maptiplist.css"
import { useDropzone } from "react-dropzone";



function Drop_MapTipList(props: any) {
//	const accept = "*.txt";
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
			}
		})
  }, [])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: ".txt", onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

const Add_MapTipList: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (  
    <>
      <Button variant="primary" onClick={handleShow}>
        Add MapTipList
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
				  <Drop_MapTipList />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Add_MapTipList;