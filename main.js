var board = new Array();
var score = 0;
var hasConfliced = new Array();
$(document).ready(function($) {
	newgame();




});

function newgame(){
	//初始化棋盘格
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}


//创建4*4网格,初始化数组board,	
function init(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("<div>",{
				"class": "grid-cell",
				"id": "grid-cell-"+i+"-"+j
			}).css({
				"top": getPosTop(i,j),
				"left": getPosLeft(i,j)
			}).appendTo('#grid-container');
		}
	}

	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConfliced[i] = new Array();
		for (var j = 0; j < 4; j++) {
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
					"top": getPosTop(i,j)+50,
					"left": getPosLeft(i,j)+50
				});
			}else{
				theNumberCell.css({
					"width": "100px",
					"height": "100px",
					"top": getPosTop(i,j),
					"left": getPosLeft(i,j),
					"background-color": getNumberBackgroundColor(board[i][j]),
					"color": getNumberColor(board[i][j])
				});	
				theNumberCell.text(board[i][j]);
			}
			hasConfliced[i][j] = false;
		}
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
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 38: //up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 39: //right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break
		case 40: //down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		default:
			break;
	}
})

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