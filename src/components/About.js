import React from 'react'

const About = () => {
    return (
        <div>
            <div className='about-container'>
                <h1>Lockify</h1>
                <h2>Feature</h2>
                <ul>
                    <li>Easy to Add Note</li>
                    <li>Easy to Update Note</li>
                    <li>Easy to Delete Note</li>
                    <li>Easy to login & Register</li>
                </ul>
                <h2>Created By</h2>
                {/* <p style={{fontSize:"20px",marginLeft:"10px",marginTop:"-10px"}}>Meet Patel</p> */}
                <ul>
                    <li>Meet Patel</li>
                </ul>
            </div>
        </div>
    )
}

export default About
