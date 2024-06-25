import React, { useEffect, useState } from 'react'
import './order.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const Orders = () => {
  const url = 'http://localhost:8080'
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list")
      if (response.data.success) {
        setOrders(response.data.data);
        // console.log(response.data.data)
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  const statusHandler = async (event, orderId) => {
  // console.log(`${event} ${orderId} `);
  const response= await axios.post(`${url}/api/order/status/`,{
    orderId,
    status:event.target.value
  })
   if(response.data.success){
    await fetchOrders();
   }
  
  }
  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className='order add'>
      <h1>Orders page</h1>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, itemIndex) => {
                  if (itemIndex === order.items.length - 1) {
                    return `${item.name} x ${item.quantity}`;
                  } else {
                    return `${item.name} x ${item.quantity}, `;
                  }
                })}
              </p>
              <p className="order-item-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
              <div className="order-item-address">
                <p>{`${order.address.street}`}</p>
                <p>{`${order.address.city} ${order.address.state} ${order.address.country} ${order.address.zipcode}`}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>Amount: {order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="food processing">food processing</option>
              <option value="out for delivery">out for delivery</option>
              <option value="Deliverd">Deliverd</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
