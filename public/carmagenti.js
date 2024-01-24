let player_num = 0;

let player1;
let player2;

let background;

const socket = new WebSocket("ws://10.40.1.128:8080");

socket.addEventListener("open", function(event){
	
});

socket.addEventListener("message", function(event){

	console.log("Server: ", event.data);

	let data = JSON.parse(event.data);

	if(data.player_num != undefined){
		player_num = data.player_num;
		console.log("Jugador num ", player_num);
	}
	else if (data.x != undefined){
		if (player_num == 2){
			player1.x = data.x;
			player1.y = data.y;
			player1.rotation = data.r;
		}
		else if (player_num == 1){
			player2.x = data.x;
			player2.y = data.y;
			player2.rotation = data.r;
		}
	}

});

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: {
	preload: preload,
	create: create,
	update: update
	}
}

const game = new Phaser.Game(config);

const CAR_SPEED = 5;
const CAR_ROTATION = 5;	

let player1_angle = 0;
let player2_angle = 0;

let space;

function preload()
{
	this.load.image('car_red', 'assets/PNG/Cars/car_red_small_1.png');
    this.load.image('car_blue','assets/PNG/Cars/car_blue_small_1.png');
	this.load.image('background','assets/PNG/Background.png');

	this.load.image('bullet','assets/PNG/Bullet.png');
}

function create()
{
	player1 = this.add.image(200, 300, 'car_red')
	player2 = this.add.image(600, 300, 'car_blue')
	
	background = this.add.image(400,300,'background');

	cursors = this.input.keyboard.createCursorKeys();

	space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	player1.setDepth(1);
	player2.setDepth(1);
}

function update()
{
	if (player_num == 0)
		return;

	if (player_num == 1){
		if (cursors.up.isDown){
			player1.y -= CAR_SPEED*Math.cos(player1_angle*Math.PI/180);
			player1.x += CAR_SPEED*Math.sin(player1_angle*Math.PI/180);
		}

		if (cursors.left.isDown){
			player1_angle -= CAR_ROTATION;
		}
		else if (cursors.right.isDown){
			player1_angle += CAR_ROTATION;
		}

		player1.rotation = player1_angle*Math.PI/180;

		let player_data = {
			x: player1.x,
			y: player1.y,
			r: player1.rotation
	}

	socket.send(JSON.stringify(player_data));

	if (space.isDown){
    	bullet = this.add.image(player1.x, player1.y, 'bullet');
    }

}


	if (player_num == 2){
		if (cursors.up.isDown){
			player2.y -= CAR_SPEED*Math.cos(player2_angle*Math.PI/180);
			player2.x += CAR_SPEED*Math.sin(player2_angle*Math.PI/180);
		}

		if (cursors.left.isDown){
			player2_angle -= CAR_ROTATION;
		}
		else if (cursors.right.isDown){
			player2_angle += CAR_ROTATION;
		}

		player2.rotation = player2_angle*Math.PI/180;

		let player_data2 = {
			x: player2.x,
			y: player2.y,
			r: player2.rotation
	}

	socket.send(JSON.stringify(player_data2));
	}
}
