import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';

import './App.css';
import AppNavBar from './components/AppNavBar';
import AdminDashboard from './pages/AdminDashboard';
import Error from './pages/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MobileUserDetails from './pages/MobileUserDetails';
import MyAccount from './pages/MyAccount';
import OrdersUser from './pages/OrdersUser';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import Register from './pages/Register';
import UpdateProduct from './pages/UpdateProduct';
import Users from './pages/Users';

import Strings from './pages/Strings';
import Wind from './pages/Wind';
import Accessories from './pages/Accessories'

import Cart from './components/Cart';

import { Container } from "react-bootstrap"
import './App.css';

function App() {
  const [user, setUser] = useState({
    //null
    // email: localStorage.getItem("email")
    id: null,
    isAdmin: null,
  });

//we can check the changes in our User state.
// console.log(user);

//Function for clearing localStorage on logout
const unsetUser = () =>{
  localStorage.clear();
}

useEffect(() =>{
// console.log(user);
// console.log(localStorage);
}, [user])

// To update the User State upon page load if a user already exist.
useEffect(() =>{
fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);

    //set the user states values with the user details upon successful login
    if (typeof data._id !== "undefined") {
      setUser({
        //undefined
        id: data._id,
        isAdmin: data.isAdmin,
      });
    }
    //set back the initial state of the user
    else {
      setUser({
        //undefined
        id: null,
        isAdmin: null,
      });
    }
  });
}, [])

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Container fluid className='p-0 allMargin'>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/cart" element={<Cart/>} />
            <Route exact path="/admin" element={<AdminDashboard/>} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route exact path='/mobile-user-details' element={<MobileUserDetails/>} />
            <Route exact path='/account' element={<MyAccount/>} />
            <Route exact path='/user/orders' element={<OrdersUser />} />
            <Route exact path="/products" element={<Products />} />
            <Route exact path="/products/update-product/:productId" element={<UpdateProduct />} />
            <Route exact path="/products/:productId" element={<ProductView />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/products/strings" element={<Strings />} />
            <Route exact path="/products/wind" element={<Wind />} />
            <Route exact path="/products/accessories" element={<Accessories />} />
            <Route exact path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
