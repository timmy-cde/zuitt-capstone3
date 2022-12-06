import { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, FloatingLabel, Row, Col } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';
import '../App.css'

export default function AdminDashboard() {
    
    const { user } = useContext(UserContext);

    const navigate  = useNavigate()

    const [allProducts, setAllProducts] = useState([]);

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {

            setAllProducts(data.map(product => {
                return (
                  <tr key={product._id}>
                    <td>{product.tags}</td>
                    <td>
                      <Row>
                        <Col
                          md="4"
                          lg="3"
                          className="d-flex justify-content-center align-items-center wrapper"
                        >
                          <img
                            src={product.pictures[0].pic}
                            alt="product-pic"
                            height={"45rem"}
                            className="image"
                          />
                        </Col>
                        <Col
                          md="8"
                          lg="9"
                          className="d-flex align-items-center"
                        >
                          {product.name}
                        </Col>
                      </Row>{" "}
                    </td>
                    <td className="description">{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.stocks}</td>
                    <td>{product.isActive ? "Active" : "Inactive"}</td>
                    <td className='text-center'>
                      {product.isActive ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => archive(product._id, product.name)}
                        >
                          Archive
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className='mb-2'
                            onClick={() => unarchive(product._id, product.name)}
                          >
                            Unarchive
                          </Button>
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/products/update-product/${product._id}`
                              )
                            }
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
            }))
        })
    }

    const archive = (productId, productName) => {

        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/archive`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {

            if(data) {

              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                title: "Archive Successful!",
                icon: "success",
                text: `${productName} is now inactive.`
              });
              
              fetchData();
            }
            else {
                Swal.fire({
                    title: "Archive unsuccessful",
                    icon: "error",
                    text: "Something went wrong. Please try again later!"
                })

            }
        })
    }

    const unarchive = (productId, productName) => {

        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/reactivate`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {

            if(data) {

              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                title: "Unarchive Successful!",
                icon: "success",
                text: `${productName} is now active.`
              });
              
              fetchData();
            }
            else {
                Swal.fire({
                    title: "Unarchive unsuccessful",
                    icon: "error",
                    text: "Something went wrong. Please try again later!"
                })

            }
        })
    }

    // =========================================================================
    // CREATE Product
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stocks, setStocks] = useState("");
    const [tags, setTags] = useState("");
    const [picInputState, setPicInputState] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [isActive, setIsActive] = useState(false);
    
    // show modal on create product
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);

    const handleClose = () => {
      setShow(false)
    }

    function handleShow(breakpoint) {
      setFullscreen(breakpoint);
      setShow(true);
    }

    const resetInputs = () => {
      setName("");
      setDescription("");
      setPrice("");
      setStocks("");
      setTags("");
      setPicInputState("");
      setSelectedFile("");
    };

    const handlePictureState = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPicInputState(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if(!selectedFile) return;
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        uploadImages(reader.result);
      }
      reader.onerror = () => {
        console.error("Error reading image!");
      }
    }
    
    const uploadImages = async (base64Image) => {

      Swal.fire({
        title: "Are you sure you want to create product?",
        icon: 'info',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/products/createProduct`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                  name: name,
                  description: description,
                  price: price,
                  stocks: stocks,
                  tags: tags,
                  pictures: base64Image
                })
              });
              resetInputs();
              handleClose();
              fetchData();
              Swal.fire({
                title: "Success!",
                icon: "success",
                text: "Product is created!"
              });
          } catch (error) {
              console.error(error);
              Swal.fire({
                title: "Error",
                icon: "error",
                text: "Something is wrong on creating the product."
              });
            }
          }
        })
      }

    useEffect(() => {
        fetchData();
    }, [])

    // To disable or enable submit button
    useEffect(() => {
      if( 
        name !== "" &&
        description !== "" &&
        price !== "" &&
        stocks !== "" &&
        tags !== "" &&
        picInputState !== "" &&
        selectedFile !== ""
      ){
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }, [name, description, price, stocks, tags, picInputState, selectedFile]);

    return user.isAdmin ? (
      <>
        <div className="dashboard">
          <div className="mb-3 text-center">
            <h1>Admin Dashboard</h1>
            <Button
              variant="success"
              size="lg"
              className="mx-2 mb-2 mb-md-0"
              onClick={() => {
                handleShow("md-down");
                resetInputs();
              }}
            >
              Add New Product
            </Button>
            {/* ADD PRODUCT MODAL */}
            {
              <Modal
                show={show}
                fullscreen={fullscreen}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Create Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form id="create-product-form">
                    <Form.Group className="mb-3" >
                      <FloatingLabel
                        className="mb-3"
                        label="Product Name"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Product Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                      <FloatingLabel
                        className="mb-3"
                        label="Description"
                      >
                        <Form.Control
                          type="text"
                          required
                          as="textarea" aria-label="With textarea"
                          style= {{height: "100px"}}
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                      <FloatingLabel
                        className="mb-3"
                        label="Price"
                      >
                        <Form.Control
                          type="text"
                          required
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                      <FloatingLabel
                        className="mb-3"
                        label="Stocks"
                      >
                        <Form.Control
                          type="text"
                          required
                          placeholder="Stocks"
                          value={stocks}
                          onChange={(e) => setStocks(e.target.value)}
                        />
                      </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>
                        Category{" "}
                      </Form.Label>
                      <Form.Select
                        className="align-top"
                        variant="success"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      >
                        <option value="Choose Category">Choose Category</option>
                        <option value="Strings">Strings</option>
                        <option value="Wind">Wind</option>
                        <option value="Accessories">Accessories</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Picture{" "}
                        <span className="text-muted">(1 image only)</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="pic"
                        required
                        accept=".jpeg, .jpg, .png"
                        onChange={handlePictureState}
                        value={picInputState}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="outline-danger" onClick={handleClose}>
                    Cancel
                  </Button>
                  {isActive ? (
                    <Button
                      variant="success"
                      type="submit"
                      id="submitBtn"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      type="submit"
                      id="submitBtn"
                      disabled
                    >
                      Submit
                    </Button>
                  )}
                </Modal.Footer>
              </Modal>
            }

            <Button variant="info" size="lg" className="mx-2 mb-2 mb-md-0" onClick={() => navigate("/users")}>
              Show Users
            </Button>
          </div>

          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Category</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stocks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>{allProducts}</tbody>
          </Table>
        </div>
      </>
    ) : (
      <Navigate to="/" />
    );
}