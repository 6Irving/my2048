var board = new Array();
var score = 0;
var hasConfliced = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function($) {
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

	if (documentWidth>500) {
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellspace = 20;
	}

	$("#grid-container").css({
		"width": gridContainerWidth-2*cellspace,
		"height": gridContainerWidth-2*cellspace,
		"padding": cellspace,
		"border-radius": 0.02*gridContainerWidth
	});

	$(".grid-cell").css({
		"width": cellSideLength,
		"height": cellSideLength,
		"border-radius": 0.02*cellSideLength
	});
}

function newgame(){
	//初始化棋盘格
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}


//创建4*4网格,初始化数组board,	
function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop(i,j));
            gridCell.css('left', getPosLeft(i,j));
        }

    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConfliced[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConfliced[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
}

function updateBoardView(){
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
			var theNumberCell = $('#number-cell-'+i+'-'+j);

			if(board[i][j]==0){
				theNumberCell.css({
					"width": "0px",
					"height": "0px",
					"top": getPosTop(i,j)+cellSideLength*0.5,
					"left": getPosLeft(i,j)+cellSideLength*0.5
				});
			}else{
				theNumberCell.css({
					"width": cellSideLength,
					"height": cellSideLength,
					"top": getPosTop(i,j),
					"left": getPosLeft(i,j),
					"background-color": getNumberBackgroundColor(board[i][j]),
					"color": getNumberColor(board[i][j])
				});	
				theNumberCell.text(board[i][j]);
			}
			hasConfliced[i][j] = false;
		}
		$(".number-cell").css("line-height",cellSideLength+"px");
		$(".number-cell").css("font-size",0.6*cellSideLength+"px");

	}
}

function generateOneNumber(){

	if(nospace(board)){
		return false;
	}
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));
	var times = 0;
	while(times<50){
		if(board[randx][randy] == 0){
			break;
		}
		var randx = parseInt(Math.floor(Math.random()*4));
		var randy = parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if(times ==50){
		for (var i = 0; i < 4; i++) {
			for (var i = 0; i < 4; i++) {
				if(board[i][j] == 0){
					randx = i;
					randy = j;
				}
			};
		};
	}

	//随机一个数字
	var randNumber = Math.random()<0.5?2:4;
	//随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);

	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37: //left
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 38: //up
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 39: //right
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break
		case 40: //down
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		default:
			break;
	}
})

document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx -startx;
	var deltay = endy -starty;

	if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
		return;
	}

	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax > 0){
			//move right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}else{
			//move left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}
	}else{
		if(deltay > 0){
			//move down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}else{
			//move up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}
	}
});

function isGameOver(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	alert("GameOver!");
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if(board[i][j]!=0){
				for (var k = 0; k < j; k++) {
					if(board[i][k]==0 && noBlock(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k]==board[i][j] && noBlock(i,k,j,board) && !hasConfliced[i][j]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//addscore
						score += board[i][k];
						updateScore(score);

						hasConfliced[i][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if(board[i][j]!=0){
				for (var k = 3; k > j; k--) {
					if(board[i][k]==0 && noBlock(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k]==board[i][j] && noBlock(i,j,k,board) && !hasConfliced[i][j]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//addscore
						score += board[i][k];
						updateScore(score);

						hasConfliced[i][j] = false;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if(board[i][j]!=0){
				for (var k = 0; k < i; k++) {
					if(board[k][j]==0 && noBlock1(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j]==board[i][j] && noBlock1(j,k,i,board) && !hasConfliced[i][j]){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//addscore
						score += board[k][j];
						updateScore(score);

						hasConfliced[i][j] = true;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}
function moveDown(){
	if(!canMoveUp(board)){
		return false;
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >=0 ; i--){
			if(board[i][j]!=0){
				for (var k = 3; k > i; k--) {
					if(board[k][j]==0 && noBlock1(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j]==board[i][j] && noBlock1(j,i,k,board) && !hasConfliced[i][j]){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//addscore
						score += board[k][j];
						updateScore(score);

						hasConfliced[i][j] = true;
						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()",200);
	return true;
}