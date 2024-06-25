import React, { useContext, useEffect } from 'react';
import './verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  // const { url } = useContext(StoreContext);
  const navigate = useNavigate();
   const  url='http://localhost:8080'
  const verifyPayment = async () => {
    try {
      console.log(`Verifying payment: success=${success}, orderId=${orderId}`);
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      console.log('Verification response:', response.data);

      if (response.data.success) {
        navigate("/myorders");
      } else {
        // alert('Order failed');
        navigate('/')
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Empty dependency array to ensure this runs only once

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
