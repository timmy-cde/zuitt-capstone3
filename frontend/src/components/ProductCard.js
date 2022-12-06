import { useContext, useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Cart2, HeartFill } from "react-bootstrap-icons";
import { Link, Navigate } from "react-router-dom";

import Swal from "sweetalert2";
import UserContext from "../UserContext";
import './ProductCard.css'

export default function ProductCard({prodProp}) {

  const { _id, name, description, price, stocks, pictures} = prodProp;

  const {user} = useContext(UserContext);

  // const [heartColor, setHeartColor] = useState("light");
  const [titleColor, setTitleColor] = useState("black");

  const addToCart = (id, name, price, pic) => {
    // Find if product is in cart already
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
      // if data is true then product id is already in cart: update quantity
      if(data) {
        fetch(`${process.env.REACT_APP_API_URL}/products/cart/update-card`, {
          method: "PATCH",
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
            quantity: 1,
            subtotal: price
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


  return (
    <Card className="p-3 cards" border="info" key={_id}>
      <div className="inner">
        <img src={`${pictures[0].pic}`} alt="product" className="image-card img-fluid" />
      </div>
      <Card.Body>
        <Card.Title
          as={Link}
          to={`/products/${_id}`}
          className="text-decoration-none text-reset"
        >
          <span
            style={{ color: `${titleColor}` }}
            onMouseEnter={() => setTitleColor("blue")}
            onMouseLeave={() => setTitleColor("black")}
          >
            <h4>{name}</h4>
          </span>
        </Card.Title>
        
          {/* <StarFill color="gold" className="align-baseline" size={18} /> 4.5 */}
          <h4 className="pt-2 price-text"><strong>₱{price}</strong></h4>
          <div className="d-block text-truncate">{description}</div>
        
      </Card.Body>
      <div className="align-bottom">
          <div className="text-muted py-3 ">{stocks} stocks remaining!</div>
            {Number(stocks) <= 0 ? (
              <Button variant="success" className="w-75" disabled >
              <Cart2 className="align-baseline" size={18}/> Add to Cart
            </Button>
            ) : (
            <Button variant="success" className="w-100" 
              onClick={() => {
                (user.isAdmin || user.id === null) ? (
                  Swal.fire({
                    text: "Please login first!",
                    icon: "info"
                  })
                ) : (
                  addToCart(_id, name, price, pictures[0].pic)
                )
              }} >
              <Cart2 className="align-baseline" size={18}/> Add to Cart
            </Button>
            )}
      </div>
    </Card>
  );
}