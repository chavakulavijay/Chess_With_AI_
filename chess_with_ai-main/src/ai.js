const pawn_table=[
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
];
const knight_table=[
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20,   0,   5,   5,   0, -20, -40],
    [-30,   5,  10,  15,  15,  10,   5, -30],
    [-30,   0,  15,  20,  20,  15,   0, -30],
    [-30,   5,  15,  20,  20,  15,   0, -30],
    [-30,   0,  10,  15,  15,  10,   0, -30],
    [-40, -20,   0,   0,   0,   0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];
const bishop_table=[
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10,   5,   0,   0,   0,   0,   5, -10],
    [-10,  10,  10,  10,  10,  10,  10, -10],
    [-10,   0,  10,  10,  10,  10,   0, -10],
    [-10,   5,   5,  10,  10,   5,   5, -10],
    [-10,   0,   5,  10,  10,   5,   0, -10],
    [-10,   0,   0,   0,   0,   0,   0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];
const rook_table=[
    [ 0,  0,  0,  5,  5,  0,  0,  0],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
]
const queen_table =[
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10,   0,   5,  0,  0,   0,   0, -10],
    [-10,   5,   5,  5,  5,   5,   0, -10],
    [  0,   0,   5,  5,  5,   5,   0,  -5],
    [ -5,   0,   5,  5,  5,   5,   0,  -5],
    [-10,   0,   5,  5,  5,   5,   0, -10],
    [-10,   0,   0,  0,  0,   0,   0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
];
var piece_values={};
piece_values.ROOK=500;
piece_values.KNIGHT=320;
piece_values.BISHOP=330;
piece_values.QUEEN=900;
piece_values.KING=20000;
piece_values.PAWN=100;
class Hueristics{
    static evaluate(chessboard){
        var material=this.get_material_score(chessboard);
        var pawns=this.get_piece_positional_score(chessboard,"PAWN",pawn_table);
        var knights=this.get_piece_positional_score(chessboard,"KNIGHT",knight_table);
        var bishops=this.get_piece_positional_score(chessboard,"BISHOP",bishop_table);
        var rooks=this.get_piece_positional_score(chessboard,"ROOK",rook_table);
        var queens=this.get_piece_positional_score(chessboard,"QUEEN",queen_table);

        return material+pawns+knights+bishops+rooks+queens
    }
    static get_piece_positional_score(chessboard,piece_type,table){
        var white=0;
        var black=0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                var piece = chessboard.find( p => p.x === i && p.y === j);
                if(piece){
                    if (piece.type===piece_type) {
                        if(piece.team==="w"){
                        white+=table[i][j];
                        }
                        else{
                            black+=table[7-i][j];
                        }
                    }
                }
            }
        }
        return white-black;
    }
    static get_material_score(chessboard){
        var white=0;
        var black=0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                var piece = chessboard.find( p => p.x === i && p.y === j);
                if(piece){
                    if (piece.team==="w") {
                        white+=piece_values[`${piece.type}`];
                    }
                    else{
                        black+=piece_values[`${piece.type}`];
                    }
                }
            }
        }
        return white-black;
    }
}
function get_piece(chessboard,x,y) {
    if (!in_bounds(x,y)){
        return 0;
    }
    const piece = chessboard.find(p => p.x === x && p.y === y);
    if(!piece)
        return 0;
    return piece;
}
// to check if the piece is in bounds of the chess
function in_bounds(x,y) {
    return (x>=0 && y>=0 && x<8 && y<8)
}
function get_move(chessboard,xto,yto,piece) {
    var move=0;
    if(in_bounds(xto,yto)){
        var coin=get_piece(chessboard,xto,yto)
        if(coin!==0){
            if(coin.team!==piece.team){
                move= {xfrom:piece.x,yfrom:piece.y,xto:xto,yto:yto,castling_move:false,piece:piece};
            }
        }
        else{
            move= {xfrom:piece.x,yfrom:piece.y,xto:xto,yto:yto,castling_move:false,piece:piece};
        }
    }
    return move;
}
function get_possible_horizontal_moves(chessboard,piece){
    var moves=[];
    var coin=0;
    // horizontal right movement
    for (let i = 1; i < 8-piece.x; i++) {
        coin = get_piece(chessboard,piece.x+i,piece.y);
        moves.push(get_move(chessboard,piece.x+i,piece.y,piece));
        if(coin!==0)
            break;
    }
    // horizontal left movement
    for (let i = 1; i < piece.x+1; i++) {
        coin = get_piece(chessboard,piece.x-i,piece.y);
        moves.push(get_move(chessboard,piece.x-i,piece.y,piece));
        if(coin!==0)
            break;
    }
    //vertical downwards
    for (let i = 1; i < 8 - piece.y; i++) {
        coin = get_piece(chessboard,piece.x,piece.y+i);
        moves.push(get_move(chessboard,piece.x,piece.y+i,piece));
        if(coin!==0)
            break;
    }
    // vertical upwards
    for (let i = 1; i < piece.y+1; i++) {
        coin = get_piece(chessboard,piece.x,piece.y-i);
        moves.push(get_move(chessboard,piece.x,piece.y-i,piece));
        if(coin!==0)
            break;
    }
    return remove_null_from_list(moves)
}
function get_possible_diagonal_moves(chessboard,piece) {
    var moves=[];
    var coin =0 ;
    for (let i = 1; i < 8; i++) {
        if(!in_bounds(piece.x+i,piece.y+i)){
            break;
        }
        coin=get_piece(chessboard,piece.x+i,piece.y+i);
        moves.push(get_move(chessboard,piece.x+i,piece.y+i,piece));
        if(coin!==0)
            break
    }
    for (let i = 1; i < 8; i++) {
        if(!in_bounds(piece.x+i,piece.y-i)){
            break;
        }
        coin=get_piece(chessboard,piece.x+i,piece.y-i);
        moves.push(get_move(chessboard,piece.x+i,piece.y-i,piece));
        if(coin!==0)
            break
    }
    for (let i = 1; i < 8; i++) {
        if(!in_bounds(piece.x-i,piece.y-i)){
            break;
        }
        coin=get_piece(chessboard,piece.x-i,piece.y-i);
        moves.push(get_move(chessboard,piece.x-i,piece.y-i,piece));
        if(coin!==0)
            break
    }
    for (let i = 1; i < 8; i++) {
        if(!in_bounds(piece.x-i,piece.y+i)){
            break;
        }
        coin=get_piece(chessboard,piece.x-i,piece.y+i);
        moves.push(get_move(chessboard,piece.x-i,piece.y+i,piece));
        if(coin!==0)
            break
    }
    return remove_null_from_list(moves);
}
function remove_null_from_list(l){
    const moves=[];
    l.forEach(element => {
        if(element!==0){
            moves.push(element);
        }
    });
    return moves
}

var piece_classes={};

piece_classes.PAWN = class {
    static is_starting_position(piece){
        if(piece.team==="b"){
            return piece.y===6;
        }
        else{
            return piece.y===1;
        }
    }
    static get_possible_moves(chessboard,piece) {
        var moves=[];
        var direction=-1;
        if(piece.team==="w"){
            direction=1;
        }
        // one step forward
        if(get_piece(chessboard,piece.x,piece.y+direction)===0){
            moves.push(get_move(chessboard,piece.x,piece.y+direction,piece));
        }
        // two step forward
        if(this.is_starting_position(piece) && get_piece(chessboard,piece.x,piece.y+direction,piece) === 0 && get_piece(chessboard,piece.x,piece.y+direction*2,piece) === 0){
            moves.push(get_move(chessboard,piece.x,piece.y+direction*2,piece));
        }
        var coin=get_piece(chessboard,piece.x + 1,piece.y + direction);
        if(coin!==0){
            moves.push(get_move(chessboard,piece.x + 1,piece.y + direction,piece));
        }
        coin=get_piece(chessboard,piece.x - 1,piece.y + direction);
        if(coin!==0){
            moves.push(get_move(chessboard,piece.x - 1,piece.y + direction,piece));
        }
        return remove_null_from_list(moves)
    }
}
piece_classes.ROOK = class {
    static get_possible_moves(chessboard,piece){
        return get_possible_horizontal_moves(chessboard,piece);
    }
}
piece_classes.BISHOP = class {
    static get_possible_moves(chessboard,piece){
        return get_possible_diagonal_moves(chessboard,piece);
    }
}
piece_classes.QUEEN = class {
    static get_possible_moves(chessboard,piece){
        var horizontal=get_possible_horizontal_moves(chessboard,piece);
        var diagonal=get_possible_diagonal_moves(chessboard,piece);
        return horizontal.concat(diagonal);
    }
}
piece_classes.KNIGHT = class {
    static get_possible_moves(chessboard,piece){
        var moves=[];
        moves.push(get_move(chessboard,piece.x+2,piece.y+1,piece));
        moves.push(get_move(chessboard,piece.x-1,piece.y+2,piece));
        moves.push(get_move(chessboard,piece.x-2,piece.y+1,piece));
        moves.push(get_move(chessboard,piece.x+1,piece.y-2,piece));
        moves.push(get_move(chessboard,piece.x+2,piece.y-1,piece));
        moves.push(get_move(chessboard,piece.x+1,piece.y+2,piece));
        moves.push(get_move(chessboard,piece.x-2,piece.y-1,piece));
        moves.push(get_move(chessboard,piece.x-1,piece.y-2,piece));

        return remove_null_from_list(moves);
    }
}
piece_classes.KING = class {
    static get_possible_moves(chessboard,piece){
        var moves=[];

        moves.push(get_move(chessboard,piece.x+1,piece.y,piece));
        moves.push(get_move(chessboard,piece.x+1,piece.y+1,piece));
        moves.push(get_move(chessboard,piece.x,piece.y+1,piece));
        moves.push(get_move(chessboard,piece.x-1,piece.y+1,piece));
        moves.push(get_move(chessboard,piece.x-1,piece.y,piece));
        moves.push(get_move(chessboard,piece.x-1,piece.y-1,piece));
        moves.push(get_move(chessboard,piece.x,piece.y-1,piece));
        moves.push(get_move(chessboard,piece.x+1,piece.y-1,piece));

        return remove_null_from_list(moves);
    }
}
function get_possible_moves(chessboard,color){
    var moves=[]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = chessboard.find(p => p.x === i && p.y === j);
            if(piece){
                if (piece.team===color) {
                    moves.push(piece_classes[`${piece.type}`].get_possible_moves(chessboard,piece));
                }
            }
        }
    }
    return moves;
};
function is_invalid_move(move,invalid_moves) {
    for (const invalid_move in invalid_moves) {
        if(equals(invalid_move,move))
            return true
        return false
    }
}
function equals(move1,move2) {
    return move1.xfrom===move2.xfrom && move1.yfrom===move2.yfrom && move1.xto===move2.xto && move1.yto===move2.yto;
}
function perform_move(chessboard,move) {
    var piece = chessboard.find( p => p.x === move.xfrom && p.y === move.yfrom);
    var new_chessboard=[];
    if(piece){
        piece.x = move.xto;
        piece.y = move.yto;
        new_chessboard = chessboard.map( (p) => {
            if(p.x===move.xto && p.y === move.yto){
                p=piece;
            }
            if(p.x===move.xfrom && p.y === move.yfrom){
                p=0;
            }  
            return p;   
        });
        piece.x= move.xfrom;
        piece.y= move.yfrom;    
    }
    return new_chessboard
}
function clone(chessboard){
    return chessboard;
}
function is_check(chessboard,color) {
    var other_color = "w";
    if(color==="w"){
        other_color="b";
    }
    for (const move in get_possible_moves(chessboard,other_color)) {
        perform_move(chessboard,move);
        var king_found = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = chessboard.find(p => p.x === i && p.y === j);
                if(piece){
                    if (piece.team===color && piece.type==="KING") {
                        king_found=true;
                    }
                }
            }
        }
        if(!king_found){
            return true;
        }
    }
    return false;
}
const infinity=100000000;
class AI{
    static get_ai_move(chessboard,invalid_moves){
        var best_move=0;
        var best_score=infinity;
        var copy=clone(chessboard);
        get_possible_moves(copy,"b").forEach(moves => {
            moves.forEach(move => {
                if(!is_invalid_move(move,invalid_moves)){
                    copy = perform_move(copy,move);
                    if(copy === chessboard){
                        console.log("asas")
                    }
                    var score = this.alphabeta(copy,2,-infinity,infinity,true);
                    if(score<best_score){
                        best_move=move;
                        best_score=score;
                    }
                }
            });
        });
        if(best_move===0){
            return 0;
        }
        copy=clone(chessboard);
        copy = perform_move(copy,best_move);
        if(is_check(copy,"b")){
            invalid_moves.push(best_move);
            return this.get_ai_move(chessboard,invalid_moves);
        }
        return best_move;
    }
    static alphabeta(chessboard,depth,a,b,maximizing){
        if(depth===0){
            return Hueristics.evaluate(chessboard);
        }
        var copy = clone(chessboard);
        var best_score;
        var possible_moves;
        var new_chessboard ;
        if(maximizing){
            best_score = -infinity;
            possible_moves=get_possible_moves(chessboard,"w");
            for (let i = 0; i < possible_moves.length; i++) {
                for (let j = 0; j < possible_moves[i].length; j++) {
                    new_chessboard = perform_move(copy,possible_moves[i][j]);
                    best_score = Math.max(best_score,this.alphabeta(new_chessboard, depth-1, a, b, false));
                    a = Math.max(a,best_score);
                    if(b<=a){
                        break;
                    }
                    return best_score;
                }    
            }
        }
        else{
            best_score = infinity;
            possible_moves=get_possible_moves(chessboard,"w");
            for (let i = 0; i < possible_moves.length; i++) {
                for (let j = 0; j < possible_moves[i].length; j++) {
                    new_chessboard = perform_move(copy,possible_moves[i][j]);
                    best_score = Math.min(best_score,this.alphabeta(new_chessboard, depth-1, a, b, false));
                    a = Math.min(a, best_score);
                    if(b<=a){
                        break ;
                    }
                    return best_score;
                } 
            }
        }
    }
}

export default AI