import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [userName, setUserName] = React.useState("");
  const [passWord, setPassWORD] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [error, setError] = React.useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  function handleSubmited(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username",userName)
    formData.append("password",passWord)
    formData.append("image",image)
    formData.append("name",name)
    formData.append("email",email)
      
    axios
      .post("https://tarmeezacademy.com/api/v1/register",formData)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/profile");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Registration failed");
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
              required
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
              required
            />

            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              className="form-control mb-3"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="image" className="form-label">
              image:
            </label>
            <input
              className="form-control mb-4"
              type="file"
              id="image"
              
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              className="form-control mb-4"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            

            

            <Button type="submit" variant="outline-dark" className="w-100">
              Register
            </Button>
          </form>

          <div className="mt-3 text-center">
            <Link to="/login">Already have an account?</Link>
          </div>
        </Col>
      </Row>
    </main>
  );
}

