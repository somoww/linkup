import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Image } from "react-bootstrap";
import { nanoid } from "nanoid";
export default function Userprofile() {
  const { id } = useParams();
  const [posts, setPosts] = React.useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.data));
  }, [id]);

  if (posts.length === 0) {
    return <p>Loading...</p>;
  }

  const userInfo = posts[0].author;

  return (
    <main>
      <Container className="pt-4 text-light ">
        <Image
          src={userInfo.profile_image || "/media/anonymous-user-icon.png"}
          onError={(e) => {
            if (
              e.target.src !==
              window.location.origin + "/media/anonymous-avatar.png"
            ) {
              e.target.src = "/media/anonymous-avatar.png";
            }
          }}
          roundedCircle
          style={{ height: "40px", width: "40px" }}
        />
        <h2 className="text-black">{userInfo.name}</h2>

        <hr />

        {posts.map((post) => (
          <Link
            to={`/${post.id}`}
            key={post.id}
            className="mt-2"
            style={{ width: "65%", textDecoration: "none" }}
          >
            <Card className="mt-2 mb-4" style={{ width: "65%" }}>
              <Card.Body>
                {user.id === post.author.id && navigate("/profile")}
                <Card.Text>{post.body}</Card.Text>
                {post.image && (
                  <Card.Img
                    onError={(e) => (e.target.style.display = "none")}
                    src={post.image}
                    alt="post"
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                )}
                <small>{post.created_at}</small>
                <div>
                  <i className="bi bi-chat-square-text"></i> comments:
                  {post.comments_count}{" "}
                  {post.tags.map((tag) => (
                    <span key={nanoid()}>
                      <i className="bi bi-tags"></i>
                      {tag}
                    </span>
                  ))}{" "}
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </Container>
    </main>
  );
}
