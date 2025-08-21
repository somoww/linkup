import React, { useRef, useEffect, useState } from "react";
import { Container, Card, Image, Row, Button } from "react-bootstrap";
import { nanoid } from "nanoid";
import Post from "./post";
import { Outlet, Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const addPostRef = useRef();
  const observerRef = useRef();
  const lastPostRef = useRef();

  function getPosts(pageNumber = 1) {
    setLoading(true);
    fetch(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${pageNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => {
            // علشان نمنع تكرار البوستات
            const ids = new Set(prev.map((p) => p.id));
            const newPosts = data.data.filter((p) => !ids.has(p.id));
            return [...prev, ...newPosts];
          });
        }
      })
      .finally(() => setLoading(false));
  }

  function scrollIntoInput() {
    addPostRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  useEffect(() => {
    getPosts(page);
  }, [page]);

  useEffect(() => {
    if (loading || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }
  }, [loading, hasMore, posts]);

  return (
    <main className="bg-secondary" style={{ minHeight: "100vh" }}>
      {token && <Post ref={addPostRef} getPosts={() => getPosts(1)} />}
      {token && (
        <Button className="floating-btn" onClick={scrollIntoInput}>
          +
        </Button>
      )}
      <Container className="pt-4 text-light">
        <Row className="d-flex justify-content-center">
          {posts.map((item, index) => {
            const isLast = index === posts.length - 1;
            return (
              <Link
                className="mt-2"
                style={{ width: "65%", textDecoration: "none" }}
                key={item.id}
                to={token ? `/${item.id}` : "/login"}
                ref={isLast ? lastPostRef : null}
              >
                <Card>
                  <Card.Body>
                    <div>
                      <Image
                        src={
                          item.author?.profile_image ||
                          "/media/anonymous-avatar.png"
                        }
                        onError={(e)=>{
                          {
            if (
              e.target.src !==
              window.location.origin + "/media/anonymous-avatar.png"
            ) {
              e.target.src = "/media/anonymous-avatar.png";
            }
          }
                        }}
                        roundedCircle
                        style={{ height: "40px", width: "40px" }}
                      />{" "}
                      <span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>
                        {item.author.name}
                      </span>{" "}
                      {item.created_at}
                    </div>
                    <Card.Text>{item.body}</Card.Text>
                  </Card.Body>

                  {item.image && typeof item.image === "string" && (
                    <Card.Img
                      onError={(e) => (e.target.style.display = "none")}
                      variant="top"
                      src={item.image}
                    />
                  )}

                  <div>
                    <i className="bi bi-chat-square-text"></i> comments:
                    {item.comments_count}{" "}
                    {item.tags.map((tag) => (
                      <span key={nanoid()}>
                        <i className="bi bi-tags"></i>
                        {tag}
                      </span>
                    ))}{" "}
                  </div>
                </Card>
              </Link>
            );
          })}
        </Row>

        {loading && <p className="text-center text-light">Loading...</p>}
        {!hasMore && (
          <p className="text-center text-light">No more posts to show</p>
        )}

        <Outlet />
      </Container>
    </main>
  );
}


