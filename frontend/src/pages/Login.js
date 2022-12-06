import {useState, useEffect, useContext} from "react";
import UserContext from "../UserContext";

import { Navigate, Link } from "react-router-dom";
import { Form, Button, Card, FloatingLabel } from "react-bootstrap";
import Swal from "sweetalert2";

import '../App.css';

export default function Login(){

  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  function login(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        if (typeof data.access !== "undefined") {
          localStorage.setItem("token", data.access);
          retrieveUserDetails(data.access);

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          });

        } else {
          Swal.fire({
            title: "Authetication Failed",
            icon: "error",
            text: "Check your login details and try again.",
          });
        }
      });

    //Clear input fields
    setEmail("");
    setPassword("");
  }

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {

        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  };

  useEffect(() => {
    
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (
    
    user.id !== null ? (
      <>{user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />}</>
    ) : (
      <>
        <div id="login" className="mx-3">
          <Card>
            <Card.Body className="mb-3">
              <Card.Title className="py-3 text-center">
                <h3>Login</h3>
              </Card.Title>

              <Form onSubmit={(e) => login(e)}>
                <FloatingLabel
                  className="mb-3"
                  controlId="userEmail"
                  label="Email Address"
                >
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FloatingLabel>

                <FloatingLabel
                  className="mb-3"
                  controlId="password"
                  label="Password"
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FloatingLabel>

                {isActive ? (
                  <Button
                    variant="outline-info"
                    type="submit"
                    id="submitBtn"
                    className="w-100"
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    variant="outline-info"
                    type="submit"
                    id="submitBtn"
                    className="w-100"
                    disabled
                  >
                    Login
                  </Button>
                )}
                <div className="pt-3 text-center">
                  <Form.Label>
                    Don't have an account yet?{" "}
                    <Form.Label
                      className="link-info"
                      as={Link}
                      to={"/register"}
                    >
                      Click here
                    </Form.Label>{" "}
                    to register.
                  </Form.Label>
                </div>
              </Form>
            </Card.Body>
          </Card>        
        </div>
      </>
    )
  );
}