import React, { useContext, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const LoginPopUp = ({ setShowLogin }) => {
    const { setToken } = useContext(StoreContext);
    const [currentState, setCurrentState] = useState('Login'); // Set initial state to 'Login'
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const BaseUrl = 'http://localhost:8080';
    const onChangehandle = (e) => {
        const { name, value } = e.target;
        setData((data) => ({ ...data, [name]: value }));
    };

    const onSubmitHandle = async (e) => {
        e.preventDefault();
        let url = `${BaseUrl}/api/user/`;
        url += currentState === 'Sign up' ? 'register' : 'login';
    
        console.log('Submitting to URL:', url); // Log URL
        console.log('Submitting data:', data); // Log data being sent
    
        try {
            const response = await axios.post(url, data);
            console.log('Response:', response); // Log response
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error to submit the data:', error.response || error.message || error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className='login-popup'>
            <form className='login-popup-container' onSubmit={onSubmitHandle}>
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currentState === 'Sign up' && (
                        <input
                            type="text"
                            onChange={onChangehandle}
                            name='name'
                            value={data.name}
                            placeholder='Enter Your Name'
                            required
                        />
                    )}
                    <input
                        type="email"
                        name='email'
                        onChange={onChangehandle}
                        value={data.email}
                        placeholder='Enter Your Email'
                        required
                    />
                    <input
                        type="password"
                        name='password'
                        onChange={onChangehandle}
                        value={data.password}
                        placeholder='Enter Your Password'
                        required
                    />
                </div>
                <button type='submit'>{currentState === 'Sign up' ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" id="terms" required />
                    <p>Agree to the terms and condition</p>
                </div>
                {currentState === 'Login' ? (
                    <p>Create a new account? <span onClick={() => setCurrentState('Sign up')}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrentState('Login')}>Login here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopUp;
