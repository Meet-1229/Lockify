import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

const Navbar = () => {
  const navigate=useNavigate()
  const handleLogout = () =>{
    localStorage.removeItem("user_id");
    navigate('/login');
  }

  return (
    <div className='navbar-container'>
      <div className='navbar-heading'>
        <Link to='/'>Lockify</Link>
      </div>
      < div className='navbar-routes'>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
        {!localStorage.getItem("user_id") ?
          <div className='navbar-btn'>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </div> :
          <div className='navbar-btn'>
            <button onClick={handleLogout}>Logout</button>
          </div>}
      </div >
    </div>
  )
}

export default Navbar
