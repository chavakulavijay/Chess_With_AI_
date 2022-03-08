import React from 'react'
import { Link } from 'react-router-dom'

function Start() {
    console.log("moce")
    return (
        <div className='Startup'> 
            <h1 className='Heading'>CHESS MASTER</h1>
            
                <Link to="/game" className='link'><button className='btn'>Start Game</button></Link>
        </div>
    )
}



export default Start
