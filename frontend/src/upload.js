import React, { useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function App() {
  const uploadFile = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("uploaded_file", file);

    axios.post("/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(
      response => {
        console.log(response)
      }
    )
  }

  return (
    <div>
      <input type="file" onChange={uploadFile} />
    </div>
  );
}

/*function App() {
  useEffect(() => {
    var formData = new FormData();
    formData.append("file","test.txt");
    axios.post("/upload/" , formData);
  }, []);
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      axios.put("/revise/upload/" + file.name, {
        file: "hello"
      });
      console.log(file.path);
    })
  },[])
  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drop files here</p>
    </div>
  );
}*/

export default App;