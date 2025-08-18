import React, { useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Image,
  Row,
  Button,
  Spinner,
  Form,
  Alert,
} from "react-bootstrap";
import axios from "axios";

export default function ShowPost() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { id } = useParams();
  const [post, setPost] = React.useState({});
  const [comment, setComment] = React.useState("");
  const commentRef = useRef();
  const [isToggled, setIsToggled] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editBody, setEditBody] = React.useState("");

  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const navigate = useNavigate();

  function buttonClicked() {
    setIsToggled((prev) => !prev);
    setTimeout(() => {
      commentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(
        `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
        {
          body: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Response:", res.data);
        setComment("");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

  function editPost(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "put");
    formData.append("body", editBody || post.body);

    axios
      .post(`https://tarmeezacademy.com/api/v1/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Updated:", res.data);
        setPost(res.data.data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  function showDeletealertfunc() {
    setShowDeleteAlert(true);
  }
  function deletePost() {
    axios
      .delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate("/");
      });
  }

  React.useEffect(() => {
    fetch(`https://tarmeezacademy.com/api/v1/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.data);
        setEditBody(data.data.body);
      });
  }, [id]);

  if (!post.author) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  } else
    return (
      <main className="bg-secondary " style={{ height: "100%" }}>
        <Container className="pt-4 text-light ">
          <Row className="d-flex justify-content-center">
            <Card
              className="mt-2 mb-4"
              style={{ width: "65%", textDecoration: "none" }}
            >
              <Card.Body>
                {user.id === post.author.id && (
                  <>
                    {!isEditing ? (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="mb-2"
                          variant="outline-dark"
                        >
                          Edit post
                        </Button>
                        <Button
                          variant="danger"
                          className="mx-2 mb-2"
                          onClick={showDeletealertfunc}
                        >
                          Delete
                        </Button>
                        {showDeleteAlert && (
                          <Alert variant="danger" dismissible className="mt-3">
                            are you sure you want to delete
                            <Button
                              className="mx-2"
                              onClick={deletePost}
                              variant="danger"
                            >
                              Delete post
                            </Button>
                          </Alert>
                        )}
                      </>
                    ) : (
                      <Form onSubmit={editPost} className="mb-3">
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                          />
                        </Form.Group>
                        <Button
                          type="submit"
                          className="mt-2"
                          variant="success"
                        >
                          Save
                        </Button>
                        <Button
                          className="mt-2 mx-2"
                          variant="secondary"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </Form>
                    )}
                  </>
                )}

                <div>
                  <Image
                    src={post.author.profile_image}
                    onError={(e)=>e.target.src="media/anonymous-avatar.png"}
                    roundedCircle
                    style={{ height: "40px", width: "40px" }}
                  />{" "}
                  <span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>
                    <Link to={`/userprofile/${post.author.id}`}>
                      {post.author.name}
                    </Link>
                  </span>{" "}
                  {post.created_at}{" "}
                </div>

                <Card.Text>{post.body}</Card.Text>
              </Card.Body>

              {post.image &&
                typeof post.image === "string" &&
                post.image.trim() !== "" &&
                post.image.includes(".jpg") && (
                  <Card.Img
                    variant="top"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    src={post.image}
                  />
                )}
              <Button
                className="mt-2"
                variant={isToggled ? "info" : "outline-info"}
                onClick={buttonClicked}
              >
                <i className="bi bi-chat-square-text"></i> comments:
                {post.comments_count}{" "}
              </Button>
              <ul ref={commentRef}>
                {isToggled &&
                  post.comments.map((comment) => (
                    <li
                      style={{ listStyle: "none", paddingLeft: "0" }}
                      key={comment.id}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        <img
                          className="rounded-circle mx-2"
                          src={
                            !comment.author?.profile_image ||
                            typeof comment.author.profile_image !== "string" ||
                            comment.author.profile_image.trim() === ""
                              ? "/media/anonymous-user-icon.png"
                              : comment.author.profile_image
                          }
                          onError={(e)=>e.target.src="media/anonymous-avatar.png"}
                          style={{ width: "20px", height: "20px" }}
                        />{" "}
                        <Link to={`/userprofile/${comment.author.id}`} >{comment.author.name}</Link>
                      </span>
                      <span> {comment.body}</span>
                    </li>
                  ))}
              </ul>
              {token && (
                <Form onSubmit={handleSubmit} className="p-3">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" className="mt-2" variant="primary">
                    Add Comment
                  </Button>
                </Form>
              )}
            </Card>
          </Row>
        </Container>
      </main>
    );
}
