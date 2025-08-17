import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Form, Button, Row } from 'react-bootstrap';

export default function Post({getPosts,ref}) {
    
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null); 
  const [success,setSucess]= useState(null)
  const token = localStorage.getItem("token");
  const fileInputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleSubmitted(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("body", body);
    if (image) formData.append("image", image);

    axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("تم الإرسال:", response.data);
        setBody("");
        setImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
        setError(null);
        setSucess(true)
        getPosts()
      })
      .catch(error => {
        setError(error.response?.data?.message || "حدث خطأ أثناء الإرسال");
      });
  }

  return (
    <Row>
      {error && <div className="text-danger mb-2">{error}</div>}
      <Form
        onSubmit={handleSubmitted}
        className="bg-light py-3 rounded mb-3 px-4"
        style={{ maxWidth: "600px", margin: "20px auto" }}
        ref={ref}
      >
        <Form.Group className="mb-3">
          <Form.Label>Drop your vibe here</Form.Label>
          <Form.Control
             as="textarea"
             rows={3} 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={ `${user.name}, Say it loud! 🔊`}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label
              htmlFor="customFile" 
             className="btn btn-outline-dark"
            style={{ cursor: "pointer" }}
          
          >Drop a pic 📸</Form.Label>
          
          <Form.Control
          id='customFile'
            type="file"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: "none" }}
          />
         {image && <span className="ms-2">{image.name}</span>}
                   <div >
            Pro tip: images make your post pop 😉
          </div>
          
        </Form.Group>

        <Button variant="dark" type="submit">
          Blast it 🚀
        </Button>
        {success&&<span className='mx-2'>✨ "Boom! Your thoughts are out there!"</span>}
      </Form>
    </Row>
  );
}



