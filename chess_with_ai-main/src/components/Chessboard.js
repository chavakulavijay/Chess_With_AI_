import React from 'react'
import Tile from './Tile';
import { useRef, useState } from 'react';
import AI from '../ai'
import Refree from '../refree/Refree';

const verticalAxis=["1","2","3","4","5","6","7","8"];
const horizantalAxis=["a","b","c","d","e","f","g","h"];
const initialBoardState = [];

for (let index = 0; index < horizantalAxis.length; index++) {
    initialBoardState.push({image:'icons/pawn_w.png', x:index ,y:1, type:"PAWN",team:"w"} )
}
for (let index = 0; index < horizantalAxis.length; index++) {
    initialBoardState.push({image:'icons/pawn_b.png', x:index ,y:6, type:"PAWN", team:"b" } )
}
console.log()
for(let p=0;p<2;p++){
    const type = (p===0)?"w":"b";
    const y = (p===0) ? 0:7;
    initialBoardState.push({image:`icons/rook_${type}.png`, x:0 , y:y, type:"ROOK", team:`${type}` })
    initialBoardState.push({image:`icons/rook_${type}.png`, x:7 , y:y, type:"ROOK", team:`${type}` })
    initialBoardState.push({image:`icons/bishop_${type}.png`, x:5 , y:y, type:"BISHOP", team:`${type}` })
    initialBoardState.push({image:`icons/bishop_${type}.png`, x:2 , y:y, type:"BISHOP", team:`${type}` })
    initialBoardState.push({image:`icons/knight_${type}.png`, x:1 , y:y, type:"KNIGHT", team:`${type}` })
    initialBoardState.push({image:`icons/knight_${type}.png`, x:6 , y:y, type:"KNIGHT", team:`${type}` })
    initialBoardState.push({image:`icons/king_${type}.png`, x:4 , y:y, type:"KING",team:`${type}` })
    initialBoardState.push({image:`icons/queen_${type}.png`, x:3 , y:y, type:"QUEEN",team:`${type}` })
} 
function clone(chessboard) {
    return chessboard;
}
function Chessboard() {
    const chessboardRef= useRef(null);
    const [activePiece, setActivePiece] = useState(null);
    const [pieces, setPieces] = useState(initialBoardState)
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pawnPromotionState, setPawnPromotionState] = useState(false);
    const [promotionPawn, setPromotionPawn] = useState();
    const refree = new Refree();
    
    const grabPiece = (e) =>{
        const chess_board = chessboardRef.current;
        const element=e.target;
        
        if(element.classList.contains("coin") &&  chess_board){            
            
            const x=e.clientX -45;
            const y=e.clientY -45;
            element.style.position ="absolute";
            element.style.left=`${x}px`;
            element.style.top=`${y}px`;
            setActivePiece(element);
            
            //setting location of a piece when clicked
            setGridX(Math.floor((e.clientX - chess_board.offsetLeft +40)/100));
            setGridY(Math.abs((Math.floor((e.clientY - chess_board.offsetTop +40)/100))-7));
        } 
        console.log(element);  
    }
    
    const movePiece = (e) =>{
        const chess_board = chessboardRef.current;
        if(activePiece && chess_board){
            const minX = chess_board.offsetLeft -25;        //Left most position of board
            const minY = chess_board.offsetTop  -25;        //Top most position of board
            const maxX = chess_board.offsetLeft + chess_board.clientWidth-70;       //Right most position of board
            const maxY = chess_board.offsetTop+chess_board.clientHeight-70;         //Bottom most position of board
            const x= e.clientX -45;
            const y=e.clientY -45;
            activePiece.style.position ="absolute";
            
            //Assigning left, top, right and bottom values 
            if( x < minX) activePiece.style.left=`${minX}px`;
            else if(x > maxX) activePiece.style.left=`${maxX}px`;
            else activePiece.style.left=`${x}px`
            
            if(y < minY) activePiece.style.top=`${minY}px`;
            else if(y > maxY) activePiece.style.top=`${maxY}px`;
            else activePiece.style.top=`${y}px`;
        }  
    }
    
    const dropPiece =(e) =>{
        const chess_board = chessboardRef.current;
        if(activePiece && chess_board){
            //New location for the pieces
            const x = Math.floor((e.clientX - chess_board.offsetLeft +40)/100);
            const y = Math.abs((Math.floor((e.clientY - chess_board.offsetTop +40)/100))-7);
            
            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
            // const attackedPiece = pieces.find(p => p.x === x && p.y === y);
            
            if(currentPiece){
                const valid = refree.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);
                //Updating location
                const isEnPassent = refree.isEnPassentMove(gridX,gridY,x,y,pieces,currentPiece.type,currentPiece.team);
                const pawnDirection = currentPiece.team === "w"? 1 : -1;
                //Making EnPassent move
                if(isEnPassent){
                    const updatedPieces = pieces.reduce((results, piece) =>{
                        if(piece.x === gridX  && piece.y === gridY){
                            piece.enPassant = false;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }
                        else if(!(piece.x === x && piece.y === y - pawnDirection)){
                            if(piece.type === "PAWN"){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    },[]);
                    setPieces(updatedPieces);
                }
                else if(valid){
                    console.log(currentPiece.type,gridX, gridY, x, y,currentPiece.team);
                    const attackingPiece = pieces.find((p)=> p.x === gridX && p.y === gridY);
                    const updatedPieces = pieces.reduce((results, piece) =>{
                        //Changing the position of Active piece and pushing to results
                        if(piece.x === gridX  && piece.y === gridY){
                            if(Math.abs(gridY - y) === 2 && piece.type === "PAWN"){
                                piece.enPassant = true;
                                pieces.forEach(p => {if(p !== piece) p.enPassant=false});
                            }
                            else{
                                piece.enPassant = false;
                                pieces.forEach(p => {if(p !== piece) p.enPassant=false});
                            }
                            piece.x = x;
                            piece.y = y;

                            const promoteRow = (piece.team === "w") ? 7 : 0;
                            if(y === promoteRow && piece.type === "PAWN"){
                                setPawnPromotionState(true);
                                setPromotionPawn(piece);
                            }
                            results.push(piece);
                        }
                        else if(piece.x === x && piece.y === y){
                            piece.type = attackingPiece.type;
                            piece.image = attackingPiece.image;
                            piece.team = attackingPiece.team;
                            results.push(piece);
                        }
                        //pushing every piece except current and attacked piece
                        else if(!(piece.x === x && piece.y === y)){
                            if(piece.type === "PAWN "){
                                piece.enPassant = false;
                                pieces.forEach(p => {if(p !== piece) p.enPassant=false});
                            }
                            results.push(piece);
                        }
                        return results;  
                    },[]);
                    setPieces(updatedPieces);
                    

                    let chessboard_=clone(pieces);
                    let updatedPosition = AI.get_ai_move(chessboard_,[]);
                    const aiAttackingPiece = pieces.find(p => p.x === updatedPosition.xfrom && p.y === updatedPosition.yfrom)
                    const updatePieces = pieces.reduce((results, piece) =>{
                        //Changing the position of Active piece and pushing to results
                        if(piece.x === updatedPosition.xfrom  && piece.y === updatedPosition.yfrom){
                            piece.x=updatedPosition.xto;
                            piece.y=updatedPosition.yto;
                            results.push(piece);
                        }
                        else if(piece.x === updatedPosition.xto && piece.y === updatedPosition.yto){
                            piece.image = aiAttackingPiece.image;
                            piece.team = aiAttackingPiece.team;
                            piece.type = aiAttackingPiece.type;
                            results.push(piece); 
                        }
                        else if(!(piece.x === updatedPosition.xto && piece.y === updatedPosition.yto)){
                            results.push(piece);
                        }
                        return results;  
                    },[]);
                    setPieces(updatePieces);
                    
                }
                //Getting back to original location
                else{
                    activePiece.style.position='relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
            setActivePiece(null);
        }
    }
    
    const pawnPromotion = (type) =>{
        if(promotionPawn === undefined){
            return;
        }
        const updatedPieces = pieces.reduce((results,piece)=>{
            if(piece.x === promotionPawn.x && piece.y === promotionPawn.y){
                piece.type = type;
                piece.image = `icons/${type.toLowerCase()}_${piece.team}.png`;
            }
            results.push(piece);
            
            return results;
        },[]);
        setPieces(updatedPieces);
        setPawnPromotionState(false);
    }

    let board=[];
    
    for(let j=verticalAxis.length-1;j>=0;j--){
        for(let i=0;i<horizantalAxis.length;i++){
            let image;
            pieces.forEach((p) => {
                if(p.x === i && p.y === j){
                    image=p.image;
                }
            });
            
            board.push(
                <Tile key={`${i},${j}`} val={i+j} image={image}></Tile>
                )
            }
        }
        
    return (
        <>  
            {pawnPromotionState && <div id="pawn-promotion-modal" >
                <div className="modal-body">
                    <img src={`/icons/rook_${promotionPawn.team}.png`} alt="" onClick={() => pawnPromotion("ROOK")}></img>
                    <img src={`/icons/bishop_${promotionPawn.team}.png`} alt="" onClick={() => pawnPromotion("BISHOP")}></img>
                    <img src={`/icons/queen_${promotionPawn.team}.png`} alt="" onClick={() => pawnPromotion("QUEEN")}></img>
                    <img src={`/icons/knight_${promotionPawn.team}.png`} alt="" onClick={() => pawnPromotion("KNIGHT")}></img>  
                </div>
                
            </div>}
            <div 
                onMouseMove={e => movePiece(e)}
                onMouseDown={e =>grabPiece(e)} 
                onMouseUp={e =>dropPiece(e)} 
                ref={chessboardRef}
                className='cb'>
                {board}
            </div>
        </>
    )
}



export default Chessboard

