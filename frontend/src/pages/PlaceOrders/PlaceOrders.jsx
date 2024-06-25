import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './PlaceOrder.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const PlaceOrders = () => {
  const { getTotalCartAmount, token, food_list, cartItems, } = useContext(StoreContext);
  const url='http://localhost:8080'
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();


    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo['quantity'] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    // const navigate = useNavigate();
    //  useEffect(() => {
    //     if(!token){
    //       navigate('/cart')
    //     }
    //     if(getTotalCartAmount()===0){
    //       navigate('/cart')
    //     }
    //  }, [token])
     


    let orderData={
      address:data,
      items:orderItems,
      amount:getTotalCartAmount() + 2
    }
  
    try {
      const response = await axios.post(`http://localhost:8080/api/order/place`, orderData, { headers: { token } });
      console.log('Order placed successfully:', response.data); // Log response for debugging
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url); // Redirect to Stripe checkout
      } else {
        alert('Error placing order: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again later.');
    }
  };
  

    return (
    <form className='place-order' onSubmit={onSubmitHandler}>
      <div className="place-order-left">
        <p>Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name='firstName'
            type="text"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder='First Name'
          />
          <input
            required
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder='Last name'
          />
        </div>
        <input
          required
          type="email"
          name='email'
          onChange={onChangeHandler}
          value={data.email}
          placeholder='Enter Email Address'
        />
        <input
          required
          type="text"
          name='street'
          onChange={onChangeHandler}
          value={data.street}
          placeholder='Street address'
        />
        <div className="multi-fields">
          <input
            required
            type="text"
            name='city'
            onChange={onChangeHandler}
            value={data.city}
            placeholder='City'
          />
          <input
            required
            type="text"
            name='state'
            onChange={onChangeHandler}
            value={data.state}
            placeholder='State'
          />
        </div>
        <div className="multi-fields">
          <input
            required
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder='Zip code'
          />
          <input
            required
            type="text"
            name='country'
            onChange={onChangeHandler}
            value={data.country}
            placeholder='Country'
          />
        </div>
        <input
          required
          type="text"
          name='phone'
          onChange={onChangeHandler}
          value={data.phone}
          placeholder='Enter Phone'
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />

          <div className="cart-total-details">
            <p>Total</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
          </div>
          <hr />
          <button className='cartBtn' type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrders;
