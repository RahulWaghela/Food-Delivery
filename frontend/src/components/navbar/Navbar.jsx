import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

export default function Navbar({setShowLogin}) {
  const [active, setActive] = useState('home');
   const {getTotalCartAmount, token, setToken}=useContext(StoreContext)
  const handleMenuClick = (menu) => {
    setActive(menu);
  };
  const navigate=useNavigate();

  const logout=()=>{
    localStorage.removeItem('token');
    setToken("");
    navigate('/')

  }
  return (
    <div className="Navbar">

      <Link to='/'>
      <img src={assets.logo} alt="Logo" />
      </Link>
      <ul className="navbar-menu">
        <Link to='/' className={active === 'home' ? 'active' : ''} onClick={() => handleMenuClick('home')}>home</Link>
        <a href='#explore-menu' className={active === 'menu' ? 'active' : ''} onClick={() => handleMenuClick('menu')}>menu</a>
        {/* <a href='#' className={active === 'mobile-app' ? 'active' : ''} onClick={() => handleMenuClick('mobile-app')}>mobile app</a> */}
        <a href='#footer' className={active === 'contact-us' ? 'active' : ''} onClick={() => handleMenuClick('contact-us')}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" />
        <div className="navbar-search-icon">
          <Link to='/cart'>
          <img src={assets.basket_icon} alt="Basket" />
          </Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token ? <button onClick={()=>setShowLogin(true)} className="navbar-button">sign in</button>
        : <div className="navbar-profile">
          <img src={assets.profile_icon} alt="" />
          <ul className='nav-profile-dropdown'>
            <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" />Orders</li>
            <hr />
            <li onClick={logout}><img src={assets.logout_icon} alt="" />Logout</li>

          </ul>
        </div>
        
      }
      </div>
    </div>
  );
}
