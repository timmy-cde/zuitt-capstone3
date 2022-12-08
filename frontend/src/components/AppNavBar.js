import { Nav, Navbar, NavDropdown, Form, Button, Container, Badge, Offcanvas} from "react-bootstrap";
import { useState, useContext, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, Navigate } from "react-router-dom";
import { Cart2, Person } from 'react-bootstrap-icons'
import UserContext from "../UserContext";

import '../App.css';

export default function AppNavBar() {

  const Desktop = ({children}) => {
      const isDesktop = useMediaQuery({minWidth: 992})
      return isDesktop ? children : null
  }

  const TabletAndBelow = ({children}) => {
      const isTabletAndBelow = useMediaQuery({maxWidth: 991})
      return isTabletAndBelow ? children : null
  }

  const { user } = useContext(UserContext);

  return (
    <>
      <Desktop>
        <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
          <Container fluid>
            <>
              {/* if admin, logo will always redirect to admin dashboard */}
              {user.isAdmin ? (
                <Navbar.Brand as={Link} to={"/admin"}>
                  <img
                    src={"../media/logo-final-caption.png"}
                    width="90"
                    className="d-inline-block align-top"
                    id="brand-logo"
                    alt="brand-logo"
                  />
                </Navbar.Brand>
              ) : (
                <Navbar.Brand as={Link} to={"/"}>
                  <img
                    src={"../media/logo-final-caption.png"}
                    width="90"
                    className="d-inline-block align-top"
                    id="brand-logo"
                    alt="brand-logo"
                  />
                </Navbar.Brand>
              )}
            </>

            {/* if user is Admin, Products dropdown and search form will be removed */}
            {user.isAdmin ? null : (
              <>
                <Nav
                  className="me-auto my-2 my-lg-0"
                  defaultActiveKey={"/"}
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <NavDropdown title="Products" id="navbarScrollingDropdown">
                    <NavDropdown.Item as={Link} to="/products" eventKey={"#"}>
                      <span>All Products</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/products/strings" eventKey={"/products/strings"}>
                      String Instruments
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products/wind" eventKey={"/products/wind"}>
                      Wind Instruments
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/products/accessories" eventKey={"/products/accessories"}>
                      Accesories
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}

            {/* if user is admin: notif and cart will be removed */}
            <Nav className="ms-auto" style={{ maxHeight: "100px" }}>
              {user.id !== null ? (
                <>
                  {user.isAdmin ? (
                    <>
                      <Nav.Link as={Link} to="/admin" eventKey="/admin">
                        Admin Dashboard
                      </Nav.Link>
                      <NavDropdown
                        title="Profile"
                        id="nav-dropdown"
                        className="me-auto"
                        align="end"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/logout"
                          eventKey="/logout"
                        >
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/cart" eventKey={"/cart"}>
                        <Cart2 className="align-baseline" size={20}/>{/*<sup><Badge className="align-top" bg="danger">{badgeValue}</Badge></sup>*/}
                      </Nav.Link>
                      <NavDropdown
                        title="Profile"
                        id="nav-dropdown"
                        className="me-auto"
                        align="end"
                      >
                        {/* <NavDropdown.Item as={Link} to="/account" eventKey="/account">
                          My Account
                        </NavDropdown.Item> */}
                        <NavDropdown.Item as={Link} to='/user/orders' eventKey='/user/orders'>
                          Orders
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/logout"
                          eventKey="/logout"
                        >
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" eventKey="/login">
                    Login
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
      </Desktop>

      <TabletAndBelow>
        <Navbar bg="primary" variant="dark" fixed="top" className="p-0">
          <Container fluid>
            {user.isAdmin ? null : (
              <>
                <Nav
                  className="me-auto my-lg-0"
                  defaultActiveKey={"/"}
                  style={{ maxHeight: "40px" }}
                  navbarScroll
                >
                  <NavDropdown title="Products" id="navbarScrollingDropdown">
                    <NavDropdown.Item as={Link} to="/products" eventKey={"/products"}>
                      <span>All Products</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/products/strings" eventKey={"/products/strings"}>
                      String Instruments
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products/wind" eventKey={"/products/wind"}>
                      Wind Instruments
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/products/accessories" eventKey={"/products/accessories"}>
                      Accesories
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Container>
        </Navbar>

        <Navbar bg="primary" variant="dark" fixed="bottom">
          <Container fluid>
            <Nav className="mx-auto">
              {user.isAdmin ? (
                <>
                  <Nav.Link
                    className="mx-auto text-center"
                    as={Link}
                    to={"/admin"}
                    eventKey={"/admin"}
                  >
                    <img
                      src={"../media/logo192.png"}
                      width="60"
                      className="d-block align-bottom mx-auto"
                      id="brand-logo"
                      alt="brand-logo"
                    />
                    Home
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    className="mx-auto text-center"
                    as={Link}
                    to={"/"}
                    eventKey={"/"}
                  >
                    <img
                      src={"../media/logo192.png"}
                      width="60"
                      className="d-block align-bottom mx-auto"
                      id="brand-logo"
                      alt="brand-logo"
                    />
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/cart" eventKey={"/cart"} >
                    <Cart2 className="d-block align-bottom mx-auto" size={25}/>
                    Cart
                  </Nav.Link>
                </>
              )}

              {user.id !== null ? (
                <>
                  <Nav.Link
                    as={Link}
                    to={"/mobile-user-details"}
                    eventKey={"/mobile-user-details"}
                  >
                    <Person
                      className="d-block align-bottom mx-auto"
                      size={25}
                    />
                    Profile
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to={"/login"} eventKey={"/login"}>
                    <Person
                      className="d-block align-bottom mx-auto"
                      size={25}
                    />
                    Login
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
      </TabletAndBelow>
    </>
  );
}