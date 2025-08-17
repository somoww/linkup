import React, { useRef } from "react";
import { Container, Card, Image, Row, Button } from "react-bootstrap";
import { nanoid } from 'nanoid';
import Post from "./post";

import { Outlet ,Link} from "react-router-dom";

export default function Home() {
  const [post, setPost] = React.useState([]);
  const token = localStorage.getItem("token");
  const addPostRef=useRef() 



  function getPosts(){
        fetch("https://tarmeezacademy.com/api/v1/posts?limit=20")
      .then((res) => res.json())
      .then((data) => setPost(data.data));

  }
  function scrollIntoInput(){
    addPostRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  React.useEffect(() => {
    getPosts()

  }, []);
  const postItems = post.map((item) => (
    <Link className="mt-2" style={{ width: "65%",textDecoration:"none" }} key={item.id} to={token?`/${item.id}`:"/login"} >
       <Card   >
      <Card.Body>
        <div>
          {" "}
          <Image src= {item.author?.profile_image ||"/media/anonymous-user-icon.png"} roundedCircle style={{height:"40px",width:"40px"}} />{" "}
          <span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>
            {item.author.name}
          </span>{" "}
          {item.created_at}{" "}
        </div>

        
        <Card.Text>{item.body}</Card.Text>
      </Card.Body>

      <Card.Img variant="top" src={item.image} />

      <div><i className="bi bi-chat-square-text"></i> comments:{item.comments_count} {item.tags.map(tag=><span key={nanoid()}><i className="bi bi-tags"></i>{tag}</span>)} </div>
    </Card>
    </Link>
  ));
  return (
    <main className="bg-secondary " style={{ height: "100%" }}>
      {token&&<Post ref={addPostRef} getPosts={getPosts} />}
      {token&&<Button className="floating-btn"onClick={scrollIntoInput} >+</Button>}
      <Container className="pt-4 text-light ">
        
        <Row className="d-flex justify-content-center">
          
          {postItems}</Row>
        <Outlet />
      </Container>
    </main>
  );
}
