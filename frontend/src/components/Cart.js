import { Row, Col, Button, Container, Table, Card } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import UserContext from "../UserContext";
import "../App.css";
import '../components/ProductCard.css'

export default function Cart() {
  const [localcart, setLocalCart] = useState([]);
  const [cartLength, setCartLength] = useState("");
  const [footer, setFooter] = useState([]);
  
  let totalPrice = 0;

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const removeToCart = (productId, name) => {
    fetch(`${process.env.REACT_APP_API_URL}/products/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
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
          title: `${name} is removed to Cart!`
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: `Something is wrong`
        });
      }
    })
  }

  const checkOut = (total) => {
    Swal.fire({
      title: "Are you sure you want to buy these products?",
      icon: "info",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await fetch(`${process.env.REACT_APP_API_URL}/products/order/checkout`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              total: total,
              isCompleted: false,
              checkOutDate: new Date()
            })
          })

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

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/cart`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(user => {

      if(user.cart.length === 0) {
        setCartLength(0);

      } else {
        setCartLength(user.cart.length);

        setLocalCart(
          user.cart.map((product) => {
            
            return (
              <tr key={product.productId}>
                <td onClick={() => navigate(`/products/${product.productId}`)}>{product.name}</td>

                <td>₱{product.price}</td>

                {/* <td className="d-flex justify-content-evenly">
                    <Button variant="info" size="sm"><DashLg size={10} /></Button>
                    <span>{product.quantity}</span>
                    <Button variant="info" size="sm"><PlusLg size={10} /></Button>
                </td> */}

                <td>{product.quantity}</td>

                <td>₱{product.subtotal}</td>

                <td>
                  <Button
                    variant="danger"
                    onClick={() => removeToCart(product.id, product.name)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })
        );
        
        // computing for total price
        user.cart.forEach(product => totalPrice += product.subtotal)

        setFooter(
          <tr>
            <td colSpan={3} className="text-end h5 price-text"><strong>Total</strong></td>
            <td className="h5 price-text"><strong>₱{totalPrice}</strong></td>
            <td>
              <Button variant="success" onClick={() => checkOut(totalPrice)}>Checkout</Button>
            </td>
          </tr>
        )
      }
    })
  }

  useEffect(() => {
    fetchData();
  });


  return (
    <>
      <div className="cart-table mx-3">
        {(cartLength === 0 || user.isAdmin || user.id === null) ? (
          <h3 className="text-center">Cart Empty</h3>
        ) : (
          <>
            <h3>Cart</h3>
            <Table striped responsive className="text-center">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="table-group-divider">{localcart}</tbody>
              <tfoot className="table-group-divider">{footer}</tfoot>
            </Table>
          </>
        )}
      </div>
    </>
  );
}
