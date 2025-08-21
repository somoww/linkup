import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  function fakeLogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          LinkUp
        </Navbar.Brand>

        <div className="d-flex align-items-center ms-auto">
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/profile" className="p-3 me-0">
              {user ? (
                <span>
                  <img
                    className="rounded-circle mx-2"
                    src={user.profile_image || "/media/anonymous-user-icon.png"}
                    onError={(e) => {
                      if (
                        e.target.src !==
                        window.location.origin + "/media/anonymous-avatar.png"
                      ) {
                        e.target.src = "/media/anonymous-avatar.png";
                      }
                    }}
                    style={{ width: "40px", height: "40px" }}
                  />
                  {user.name}
                </span>
              ) : (
                <span>profile</span>
              )}
            </Nav.Link>
          </Nav>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="p-0 ms-1"
          />
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {!token && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!token && (
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            )}
            {token && (
              <Button variant="outline-danger" onClick={fakeLogOut}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
