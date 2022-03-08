import React from 'react'

function Tile({val,image}) {
    
    if ((val) % 2 === 0) {
        return (
            <div>
                <div className="tile tile_black" >
                    {image && <div className="coin" style={{backgroundImage: `url(${image})`}}></div>}
                </div>
            </div>
        )
    }
    else{
        return (
            <div>
                <div className="tile tile_white" >
                    {image && <div className="coin" style={{backgroundImage:`url(${image})`}}></div>}
                </div>
            </div>
        )
    }
}

export default Tile
