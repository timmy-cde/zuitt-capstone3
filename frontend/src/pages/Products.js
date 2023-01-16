import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";

import ProductCard from "../components/ProductCard";
import "../App.css"

export default function Products() {
    const [products, setProducts] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products`)
        .then(res => res.json())
        .then((data) => {
            setProducts(
                data.map((product, index) => {
                    if(index < 5) {
                      return <ProductCard key={product._id} prodProp={product} load={'lazy'} />
                    } else {
                      return <ProductCard key={product._id} prodProp={product} load={'auto'}/>
                    }
                })
            )
        })
    })
 
    return user.isAdmin ? (
      <Navigate to={"/admin"} />
    ) : (
      <>
        <div className="products" key={products._id}>
            {products}
        </div>
        <div className="mb-5"></div>
      </>
    );
}