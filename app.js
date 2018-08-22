const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const TWO_PI = Math.PI * 2;
const ballRadius = 10;
const paddleHeight = 20;
const paddleWidth = 100;
let ballX = canvas.width / 2,
    ballY = canvas.height - 30,
    paddleX = (canvas.width - paddleWidth) / 2,
    paddleY = canvas.height - paddleHeight,
    rightPressed = false,
    leftPressed = false,
    dx = 5,
    paddleDx = 7,
    dy = -5,
    score = 0,
    lives = 3,
    status = 1,
    bricks = [],
    brickRowCount = 3,
    brickColCount = 5,
    brickWidth = 100,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30;
class Ball {
    constructor(x, y, radius, dx, dy){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fillStyle = '#0095dd';
        ctx.fill();
        ctx.closePath();
    }
    update(obj){
        if(this.y + this.dy < this.radius ) {
            this.dy = -this.dy;
        }else if(this.y + this.dy > canvas.height - this.radius -obj.h) {
            if(this.x  > obj.x && this.x  < (obj.x + obj.w)){
                this.dy = -this.dy;
            }else {
                lives--;
                let lostMsg = 'GAME OVER, YOU HAVE NO LIVES';
                if(lives <=0){
                    lives = 0;
                    let textWidth = ctx.measureText(lostMsg).width;
                    textDrawing(ctx, (canvas.width / 2) - (textWidth / 2), canvas.height / 2, lostMsg);
                    setTimeout(_ => {  
                        document.location.reload();
                    }, 2000);
                }else {
                    this.x = canvas.width / 2;
                    this.y = canvas.height - 30;
                    this.dx = 5;
                    this.dy = -5;
                }
            }
        }
        if(this.x + dx < this.radius || this.x + this.dx > canvas.width - this.radius) {
            this.dx = -this.dx;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}
class Paddle {
    constructor(x, y = canvas.height - h, w, h, dx){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = '#0095dd';
        ctx.fill();
        ctx.closePath();
    }
    update(){
        if(rightPressed && this.x < (canvas.width - this.w)) {
            this.x += this.dx;
        }else if(leftPressed && this.x > 0) {
            this.x -= this.dx;
        }
    }
}
class Brick {
    constructor(x = 0, y = 0, w, h, status = 1 ){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.status = status;
    }
    draw(ctx) {
        if(this.status === 1){
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#0095dd';
            ctx.fill();
            ctx.closePath();
        }
    }
    update(obj){
        if(this.status === 1){
            if(obj.x > this.x && 
                obj.x < this.x + this.w &&
                obj.y > this.y &&
                obj.y < this.y + this.h){
                    obj.dy = -obj.dy;
                    this.status = 0;
                    score++;
                }
        }
    }
}

const ball = new Ball(ballX, ballY, ballRadius, dx, dy);
const paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight, paddleDx);
for(let c = 0; c < brickColCount; c++){
    for(let r = 0; r < brickRowCount;r++){
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks.push(new Brick(brickX, brickY, brickWidth, brickHeight));
    }
}
function textDrawing(ctx = ctx, x, y, msg){
    ctx.font = '18px Orbitron';
    ctx.fillStyle = '#333';
    ctx.fillText(msg, x, y);
}
function draw(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw(ctx);
    paddle.draw(ctx);
    let scoreMsg = `Score: ${score}`;
    let livesMsg = `Lives: ${lives}`;
    let livesMsgWidth = ctx.measureText(livesMsg).width;
    textDrawing(ctx, 8, 20, scoreMsg);
    textDrawing(ctx, canvas.width - (livesMsgWidth + 8), 20, livesMsg);
    ball.update(paddle);
    paddle.update(); 
    bricks.forEach(brick => {
        brick.draw(ctx);
        brick.update(ball);
    });
    if(score === bricks.length){
        let winMsg = `YOU WIN, CONGRATULATION!`;
        let textWidth = ctx.measureText(winMsg).width;
        textDrawing(ctx, (canvas.width / 2) - (textWidth / 2), canvas.height / 2, winMsg);
        setTimeout( _ => {
            document.location.reload();
        }, 2000);
    }
    requestAnimationFrame(function(){
        draw(ctx);
    });
}
function keyDownHandler(event){
    if(event.keyCode === 39){
        rightPressed = true;
    }else if(event.keyCode === 37){
        leftPressed = true;
    }
}
function keyUpHandler(event){
    if(event.keyCode === 39){
        rightPressed = false;
    }else if(event.keyCode === 37){
        leftPressed = false;
    }
}
function mouseMoveHandler(event){
    const relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > paddle.w / 2 && relativeX < canvas.width - paddle.w / 2){
        paddle.x = relativeX - paddle.w / 2;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

draw(ctx);