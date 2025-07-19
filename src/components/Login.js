import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
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
      const response = await fetch('http://localhost/lockify/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const text = await response.text();
      console.log('Raw response:', text);
      try {
        const result = JSON.parse(text);
        console.log('Parsed response:', result);
        setMessage(result.message);
        if (result.status) {
          setFormData({ email: '', password: '' });
          localStorage.setItem('user_id', result.user_id);
        }
      navigate("/")
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        setMessage('Error: Invalid server response');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Error: Could not connect to the server');
    }
  };

  return (
    <div className='div-container'>
      <div className='form-container'>
        <h1 style={{ textAlign: 'center', fontSize: '50px', fontFamily: 'Verdana', color: '#ffffed' }}>
          Login
        </h1>
        <form onSubmit={handleSubmit}>
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
          <button type='submit' className='btn-container'>Login</button>
        </form>
        {message && <p style={{ textAlign: 'center', color: message.includes('Error') || message.includes('Invalid') ? 'red' : 'green' }}>{message}</p>}
        <p>Don't have an account? <Link to='/register'>Register</Link></p>
      </div>
    </div>
  );
};

export default Login;