import { Accordion, Table } from "react-bootstrap"
import { useContext, useEffect, useState } from "react";

import UserContext from "../UserContext";
import '../App.css';

export default function OrdersUser() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    const fetchOrders = () => {
        fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}/orders`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            
          setOrders(data.map(products => {
                
                return (
                  <Accordion flush>
                    {products.length === 2 ? (
                      <Accordion.Item eventKey={products[1].orderId}>
                        <Accordion.Header>
                          Order Id: {products[1].orderId}
                        </Accordion.Header>
                        <Accordion.Body>
                          <h5>Order Summary</h5>
                          <h6>Date: {products[1].checkOutDate}</h6>
                          <Table striped responsive className="text-center" >
                            <thead>
                              <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Order Status</th>
                              </tr>
                            </thead>
                            <tbody className="table-group-divider">
                              {products[0].map((product) => {
                                return (
                                  <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>₱{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>₱{product.subtotal}</td>
                                    <td>{products[1].isCompleted ? "Completed" : "Pending"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="table-group-divider">
                              <tr>
                                <td
                                  colSpan={3}
                                  className="text-end h5 price-text"
                                >
                                  <strong>Total</strong>
                                </td>
                                <td className="h5 price-text">
                                  <strong>₱{products[1].total}</strong>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <Accordion.Item>
                        <Accordion.Item eventKey={products.orderId}>
                          <Accordion.Header>
                            Order Id: {products.orderId}
                          </Accordion.Header>
                          <Accordion.Body>
                            <h5>Order Summary</h5>
                            <h6>Date: {products.checkOutDate}</h6>
                            <Table striped responsive className="text-center" key={products.orderId}>
                              <thead>
                                <tr>
                                  <th>Product Name</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Subtotal</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody className="table-group-divider">
                                <tr key={products.orderId}>
                                  <td>{products.name}</td>
                                  <td>₱{products.price}</td>
                                  <td>{products.quantity}</td>
                                  <td>₱{products.subtotal}</td>
                                  <td>{products.isCompleted ? "Completed" : "Pending"}</td>
                                </tr>
                              </tbody>
                              <tfoot className="table-group-divider">
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="text-end h5 price-text"
                                  >
                                    <strong>Total</strong>
                                  </td>
                                  <td className="h5 price-text">
                                    <strong>₱{products.total}</strong>
                                  </td>
                                </tr>
                              </tfoot>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion.Item>
                    )}
                  </Accordion>
                );
            }))
        })
    }
    
    useEffect(() => {
        fetchOrders();
    },[])

    return (
      <>
        <div className="orders-view mx-3">
            <h3>Orders</h3>
            {orders}
        </div>
      </>
    );
}