import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  
  const [userName, setUserName] = React.useState("");
  const [passWord, setPassWORD] = React.useState("");
  const [error, setError] = React.useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  function handleSubmited(e) {
    e.preventDefault();
    axios
      .post("https://tarmeezacademy.com/api/v1/login", {
        username: userName,
        password: passWord,
      })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/profile");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed");
      });
  }

  return (
    <main
      className="bg-secondary-subtle d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="mb-3 text-danger fw-bold">
            {error || location.state || ""}
          </div>

          <form
            className="bg-light p-4 rounded shadow-sm"
            onSubmit={handleSubmited}
          >
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              className="form-control mb-3"
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              className="form-control mb-3"
              type="password"
              id="password"
              value={passWord}
              onChange={(e) => setPassWORD(e.target.value)}
            />

            <Button type="submit" variant="outline-dark" className="w-100">
              Login
            </Button>
          </form>

          <div className="mt-3 text-center">
            <Link to="/register">Doesn't have an account?</Link>
          </div>
        </Col>
      </Row>
    </main>
  );
}

