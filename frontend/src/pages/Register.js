import {useState, useEffect, useContext} from "react";
import UserContext from "../UserContext";
import {Navigate, useNavigate, Link} from "react-router-dom";
import {Button, Form, Card, Row, Col, FloatingLabel} from "react-bootstrap";
import Swal from "sweetalert2";

import '../App.css';

export default function Register(){
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  //State hooks to store the values of the input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] =  useState("");
  const [country, setCountry] =  useState("");
  const [zipCode, setZipCode] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // Function to simulate user registration
  function registerUser(e) {
    //prevents the page redirection via form submit
    e.preventDefault();

    // Checking if the email is still available
    fetch(`${process.env.REACT_APP_API_URL}/users/checkEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    })
    .then(res => res.json())
    .then(data => {

      if(data){
        Swal.fire({
          title: "Duplicated email found",
          icon: "error",
          text: "Kindly provide another email to complete the registration"
        })
      }
      else {
        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            address: `${street}, ${city}, ${province}, ${country}, ${zipCode}`,
            // address: street + ", " + city + ", " + province + ", " + country + ", " + zipCode,
            mobileNo: mobileNo,
            password: password1
          })
        })
        .then(res => res.json())
        .then(data => {

          if(data) {
            //Clear input fields
            setFirstName("");
            setLastName("");
            setEmail("");
            setMobileNo("");
            setStreet("");
            setCity("");
            setProvince("");
            setCountry("");
            setZipCode("");
            setPassword1("");
            setPassword2("");

            Swal.fire({
              title: "Registration successful",
              icon: "success",
            })

            // redirect the user to the login page after registration
            navigate("/login");
          }
          else {
            Swal.fire({
              title: "Something went wrong",
              icon: "error",
              text: "Please try again."
            })
          }
        })

      }
    })
  }

  //State to determine whether submit button is enabled or not.
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const passwordFormat = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$');
    
    if (
      firstName !== null &&
      lastName !== null &&
      email !== "" &&
      mobileNo.length === 11 &&
      street !== "" &&
      city !== "" &&
      province !== "" &&
      country !== "" &&
      zipCode !== "" &&
      passwordFormat.test(password1) &&
      password1 !== "" &&
      password2 !== "" &&
      password1 === password2
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, street, city, province, country, zipCode, password1, password2]);

  return user.id !== null ? (
    <Navigate to="/" />
  ) : (
    <>
      <div className="mx-3">
        <Card id="full-reg" className="px-lg-5 px-md-5 px-3">
          <h3 className="my-3 text-center">Register</h3>
          <Form
            onSubmit={(e) => registerUser(e)}
            id="register-form"
            className="pb-5"
          >
            <FloatingLabel
              className="mb-3"
              controlId="firstName"
              label="First Name"
            >
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FloatingLabel>

            <FloatingLabel
              className="mb-3"
              controlId="lastName"
              label="Last Name"
            >
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FloatingLabel>

            <FloatingLabel
              className="mb-3"
              controlId="userEmail"
              label="Email address"
            >
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </FloatingLabel>

            <FloatingLabel
              className="mb-3"
              controlId="mobileNo"
              label="Mobile Number"
            >
              <Form.Control
                type="number"
                placeholder="Mobile Number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </FloatingLabel>

            <Form.Group className="mb-4" controlId="address">
              <Form.Label>Address</Form.Label>
              <Row>
                <Col className="col-12 col-md-8 col-lg-8 mb-3">
                  <FloatingLabel controlId="street" label="Street">
                    <Form.Control
                      type="string"
                      placeholder="Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col className="col-12 col-md-4 col-lg-4 mb-3">
                  <FloatingLabel controlId="city" label="City">
                    <Form.Control
                      type="string"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col className="col-12 col-md-4 col-lg-4 mb-3">
                  <FloatingLabel controlId="city" label="Province">
                    <Form.Control
                      type="string"
                      placeholder="Province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col className="col-12 col-md-4 col-lg-4 mb-3">
                  <FloatingLabel controlId="province" label="Country">
                    <Form.Control
                      type="string"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col className="col-12 col-md-4 col-lg-4 mb-3">
                  <FloatingLabel controlId="zipCode" label="Zip Code">
                    <Form.Control
                      type="number"
                      placeholder="Zip Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>

            <FloatingLabel className="mb-3" controlId="password1" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
              />
              <Form.Text className="text-muted">
                Password must be minimum of 8 characters with uppercase &
                lowercase letters and symbols.
              </Form.Text>
            </FloatingLabel>

            <FloatingLabel className="mb-3" controlId="password2" label="Verify Password">
              <Form.Control
                type="password"
                placeholder="Verify Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </FloatingLabel>

            {isActive ? (
              <Button
                variant="outline-info"
                type="submit"
                id="submitBtn"
                className="w-100"
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="outline-info"
                type="submit"
                id="submitBtn"
                className="w-100"
                disabled
              >
                Register
              </Button>
            )}
            <div className="pt-3 text-center">
              <Form.Label>
                Already have an account yet?{" "}
                <Form.Label className="link-info" as={Link} to={"/login"}>
                  Click here
                </Form.Label>{" "}
                to login.
              </Form.Label>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}