import { useContext, useEffect, useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom";

import '../App.css';

export default function UpdateProduct() {

    const {productId} = useParams();

    const navigate = useNavigate();

    const {user} = useContext(UserContext);

    const [updateName, setUpdateName] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updatePrice, setUpdatePrice] = useState("");
    const [updateStocks, setUpdateStocks] = useState("");
    const [updateTags, setUpdateTags] = useState("");
    const [updatePicInputState, setUpdatePicInputState] = useState("");
    const [updateSelectedFile, setUpdateSelectedFile] = useState("");

    const resetUpdateInputs = () => {
        setUpdateName("");
        setUpdateDescription("");
        setUpdatePrice("");
        setUpdateStocks("");
        setUpdateTags("");
        setUpdatePicInputState("");
        // setProductId("");
        setUpdateSelectedFile("");
        navigate(`/admin`)
      };

    const handleUpdatePictureState = (e) => {
      const file = e.target.files[0];
      setUpdateSelectedFile(file);
      setUpdatePicInputState(e.target.value);
    };

    const handleUpdatedSubmit = (e) => {
      e.preventDefault();
      if(!updateSelectedFile) {
        updateData();

      } else {

        const reader = new FileReader();
        reader.readAsDataURL(updateSelectedFile);
        reader.onloadend = () => {
          updatedImage(reader.result);
        }
        reader.onerror = () => {
          console.error("Error reading image!");
        }
      }
    }
  
    // if updated without changing the picture
    const updateData = () => {
      Swal.fire({
        title: "Are you sure you want to save the modified product?",
        icon: "info",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await fetch(
              `${process.env.REACT_APP_API_URL}/products/${productId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  name: updateName,
                  description: updateDescription,
                  price: updatePrice,
                  stocks: updateStocks,
                  tags: updateTags,
                  pictures: ""
                }),
              }
            );
            //   fetchData();
            Swal.fire({
              title: "Saved",
              icon: "success",
              text: "Product is modified!",
            });
            resetUpdateInputs();
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Something is wrong on saving the product.",
            });
          }
        },
      });
    }

    // if updated with changing of picture
    const updatedImage = (updatedImage) => {
      Swal.fire({
        title: "Are you sure you want to save the modified product?",
        icon: "info",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await fetch(
              `${process.env.REACT_APP_API_URL}/products/${productId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  name: updateName,
                  description: updateDescription,
                  price: updatePrice,
                  stocks: updateStocks,
                  tags: updateTags,
                  pictures: updatedImage,
                }),
              }
            );
            //   fetchData();
            Swal.fire({
              title: "Saved",
              icon: "success",
              text: "Product is modified!",
            });
            resetUpdateInputs();
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Something is wrong on saving the product.",
            });
          }
        },
      });
    }

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        setUpdateName(data.name);
        setUpdateDescription(data.description);
        setUpdatePrice(data.price);
        setUpdateStocks(data.stocks);
        setUpdateTags(data.tags);
      })
    }, [])

    return (
      <>
        <Form
          id="update-product-form"
          onSubmit={(e) => handleUpdatedSubmit(e)}
          className="px-md-5 px-3"
        >
          <h3>Update Product</h3>
          <Form.Group className="mb-3" controlId="name">
            <FloatingLabel
              className="mb-3"
              controlId="name"
              label="Product Name"
            >
              <Form.Control
                type="text"
                placeholder="Product Name"
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <FloatingLabel
              className="mb-3"
              controlId="description"
              label="Description"
            >
              <Form.Control
                type="text"
                placeholder="Description"
                as="textarea" aria-label="With textarea"
                style= {{height: "100px"}}
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <FloatingLabel className="mb-3" controlId="price" label="Price">
              <Form.Control
                type="text"
                placeholder="Price"
                value={updatePrice}
                onChange={(e) => setUpdatePrice(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-3" controlId="stocks">
            <FloatingLabel className="mb-3" controlId="stocks" label="Stocks">
              <Form.Control
                type="text"
                placeholder="Stocks"
                value={updateStocks}
                onChange={(e) => setUpdateStocks(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-3" controlId="tags">
            <Form.Label>Category </Form.Label>
            <Form.Select
              aria-label="Default select example"
              className="align-top"
              variant="success"
              value={updateTags}
              onChange={(e) => setUpdateTags(e.target.value)}
            >
              <option value="Choose Category">Choose Category</option>
              <option value="Strings">Strings</option>
              <option value="Wind">Wind</option>
              <option value="Accessories">Accessories</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Picture <span className="text-muted">(1 image only)</span>
            </Form.Label>
            <Form.Control
              type="file"
              name="pic"
              accept=".jpeg, .jpg, .png"
              onChange={handleUpdatePictureState}
              value={updatePicInputState}
            />
          </Form.Group>
          <div className="d-flex flex-row-reverse">
            <Button
              variant="success"
              type="submit"
              id="submitBtn"
              className="ms-3"
            >
              Submit
            </Button>
            <Button
              variant="outline-danger"
              onClick={resetUpdateInputs}
              className=""
            >
              Cancel
            </Button>
          </div>
        </Form>
      </>
    );
}