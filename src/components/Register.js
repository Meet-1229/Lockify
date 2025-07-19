import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact: '',
    password: ''
  });
  let navigate=useNavigate()
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending data:', formData);
    try {
      const response = await fetch('http://localhost/lockify/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      setMessage(result.message);
      if (result.status) {
        setFormData({ username: '', email: '', contact: '', password: '' });
      }
    navigate("/login")
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Error: Could not connect to the server');
    }
  };

  return (
    <div className='div-container'>
      <div className='form-container'>
        <h1 style={{ textAlign: 'center', fontSize: '50px', fontFamily: 'Verdana', color: '#ffffed' }}>
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Please enter your name'
            required
          />
          <label>Phone No:</label>
          <input
            type='tel'
            name='contact'
            value={formData.contact}
            onChange={handleChange}
            placeholder='Please enter your phone number'
            required
          />
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Please enter your email'
            required
          />
          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Please enter your password'
            required
          />
          <button type='submit' className='btn-container'>Register</button>
        </form>
        {message && <p style={{ textAlign: 'center', color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  );
};

export default Register;