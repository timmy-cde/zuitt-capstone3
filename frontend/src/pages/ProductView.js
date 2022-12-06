import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import { Cart2, BagHeart } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import '../App.css'

export default function ProductView() {
    const {user} = useContext(UserContext);

    const { productId } = useParams();

    const initialQuantity = 1;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    let [stocks, setStocks] = useState("");
    const [picture, setPicture] = useState("");
    let [qty, setQty] = useState(initialQuantity);

    const fetchData = () => {
      fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setStocks(product.stocks);
            setPicture(product.pictures[0].pic);
        })
    }
    
    useEffect(() => {
      fetchData();
    });
   
    // for dynamic quantity dropdown
    let qtyList = [];
    for(let i = 1; i <= stocks; i++) {
      qtyList.push(i)
    };

    let quantityList = qtyList.map((value) => {
      return (
        <option className="mb-5" key={value} value={value}>
          {value}
        </option>
      );
    });

    // for CART
    const addToCart = (id, name, price, qty, pic) => {

      fetch(`${process.env.REACT_APP_API_URL}/products/cart/duplicate`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: id
        })
      })
      .then(res => res.json())
      .then(data => {

        if(data) {

          fetch(`${process.env.REACT_APP_API_URL}/products/cart/${id}/update-prod-view`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              quantity: qty
            })
          })
          .then(res => res.json())
          .then(data => {

            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
  
            if(data){
              Toast.fire({
                icon: 'success',
                title: `${name} is added to Cart!`
              });
            } else {
              Toast.fire({
                icon: 'error',
                title: `Something is wrong`
              });
            }
          })
        } else {
          fetch(`${process.env.REACT_APP_API_URL}/products/cart/${id}`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              productId: id,
              name: name,
              pic: pic,
              price: price,
              quantity: qty,
              subtotal: price * qty
            })
          })
          .then(res => res.json())
          .then(data => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
  
            if(data){
              Toast.fire({
                icon: 'success',
                title: `${name} is added to Cart!`
              });
            } else {
              Toast.fire({
                icon: 'error',
                title: `Something is wrong`
              });
            }
          })
        }
      })
    }

    const checkOut = () => {
      Swal.fire({
        title: "Are you sure you want to buy the product?",
        icon: "info",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await fetch(
              `${process.env.REACT_APP_API_URL}/products/order/checkout/${productId}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: name,
                  pic: picture,
                  price: price,
                  quantity: qty,
                  subtotal: price * qty,
                  total: price * qty,
                }),
              }
            );
            fetchData();
            Swal.fire({
              title: "Thank you for your purchase!",
              icon: "success",
              text: "See the status of your orders in your account",
            });
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Something is wrong on buying the product.",
            });
          }
        }
      })
    }

    return (
      <>
        <Container className="container-prod-view">
          <Row>
            <Col lg={6} md={6} sm={12} className="d-flex align-items-center" >
              <img src={picture} alt="product-img" className="image-view" />
            </Col>
            <Col
              lg={6}
              md={6}
              sm={12}
              className="d-flex justify-content-center align-items-center"
            >
              <div>
                <h2 className="pt-5 pt-md-0">{name}</h2>
                <hr className="hr" />
                <h3 className="pt-3 price-text"><strong>₱{price}</strong></h3>
                <p>{description}</p>
                <div className="d-flex mb-3">
                  <span className="text-muted mt-auto">
                    {stocks} stocks remaining!
                  </span>
                  <div className="ms-auto p-2">Qty:</div>
                  <div>
                    <Form.Select
                      aria-label="Default select example"
                      className="align-top"
                      variant="success"
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {quantityList}
                    </Form.Select>
                  </div>
                </div>
                <Row className="pt-3">
                  <Col>
                    {/* Add to Cart */}
                    {Number(stocks) <= 0 ? (
                      <Button
                        variant="outline-success"
                        className="w-100 align-middle"
                        disabled
                      >
                        <Cart2 className="align-baseline" size={18} /> Add to
                        Cart
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        className="w-100 align-middle"
                        onClick={() => {
                          (user.isAdmin || user.id === null)
                            ? Swal.fire({
                                text: "Please login first!",
                                icon: "info",
                              })
                            : // <Navigate to={"#"} />
                              addToCart(productId, name, price, qty, picture);
                        }}
                      >
                        <Cart2 className="align-baseline" size={18} /> Add to
                        Cart
                      </Button>
                    )}
                  </Col>
                  <Col>
                    {/* Buy Now */}
                    {Number(stocks) <= 0 ? (
                      <Button
                      variant="success"
                      className="w-100 align-middle"
                      disabled
                    >
                      <BagHeart className="align-baseline" size={18} /> Buy Now!
                    </Button>
                    ) : (
                      <Button
                      variant="success"
                      className="w-100 align-middle"
                      onClick={() => {
                        user.isAdmin || user.id === null ? (
                          Swal.fire({
                            text: "Please login first!",
                            icon: "info",
                          })
                        ) : (
                          checkOut()
                        );
                      }}
                    >
                      <BagHeart className="align-baseline" size={18} /> Buy Now!
                    </Button>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
}