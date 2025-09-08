let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 1280;

const GRID_SIZE = 64;
const BASE_X = GRID_SIZE*3;
const BASE_Y = GRID_SIZE*3;
const UNIT_SIZE = GRID_SIZE*1;

let capture;
let captureImage;
let captureFlag = false;

const BUTTON_OFFSET = 8;
const BUTTON_W = CANVAS_W/4;
const BUTTON_H = BUTTON_W/2;
const BUTTON_Y = CANVAS_H*2/3;
const BUTTON_M = 24;
let capButton, saveButton;

const DEBUG = true;
const DEBUG_VIEW_X = 40;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}
function getFn() {
	const val = {
		facingMode: "user"
	};
	if (wSelect.value()!=0){
		val.width = +wSelect.value();
	}
	if (hSelect.value()!=0){
		val.height = +hSelect.value();
	}
//		audio: false,
//		video: CAMERA_SETTING[select.value()].value
/*
		video: {
			width: 720,
			height: 1280,
			facingMode: "user"
		}
*/
	console.log(val);
//	capture = createCapture(val);
	capture = createCapture({
		audio: false,
		video: val
	});
	capture.hide();
	captureFlag = true;
}
function capFn() {
	if (!captureFlag){
		const wr = capture.width/CANVAS_W;
		const w = int(UNIT_SIZE*9*wr);
		captureImage = capture.get(int(BASE_X*wr), int(BASE_Y*wr), w, w);
		captureFlag = true;
	}else{
		captureFlag = false;
	}
}
function saveFn() {
	if (captureFlag){
		const fileName = 'np'+year()+month()+day()+hour()+minute()+second();
		console.log(fileName);
		captureImage.save(fileName, 'jpg');
	}
}
function setup() {
	createCanvas(CANVAS_W, CANVAS_H);
	time = millis();
	rectMode(CENTER);

	capture = createCapture({
		audio: false,
		video: {
			width: 720,
			height: 720
		}
	});
	capture.hide();

	capButton = buttonInit('cap', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y);
	capButton.mousePressed(capFn);
	saveButton = buttonInit('save', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y+BUTTON_H+BUTTON_M);
	saveButton.mousePressed(saveFn);
	textAlign(CENTER,CENTER);
}
function buttonInit(text, w, h, x, y) {
	let button = createButton(text);
	button.size(w,h);
	button.position(x+BUTTON_OFFSET,y+BUTTON_OFFSET);
	button.style('font-size', '48px');
	return button;
}
function draw() {
	background(48);
	let current = millis();
	if ( (current-time)>=1000 ){
		time += 1000;
		fps = frameCount - frameCountBuffer;
		frameCountBuffer = frameCount;
	}
	if (DEBUG){
		stroke(128);
		strokeWeight(1);
		for (let i=0; i<CANVAS_H/GRID_SIZE; i++){
			line(0, i*GRID_SIZE, CANVAS_W, i*GRID_SIZE);
		}
		for (let i=0; i<CANVAS_W/GRID_SIZE; i++){
			line(i*GRID_SIZE, 0, i*GRID_SIZE, CANVAS_H);
		}
	}
	if (captureFlag){
		image(captureImage, BASE_X, BASE_Y, UNIT_SIZE*9, UNIT_SIZE*9);
	}else{
		image(capture, 0, 0, 960, 960);
	}
	stroke(200);
	strokeWeight(3);
	for (let i=0; i<10; i++){
		line(BASE_X, BASE_Y+UNIT_SIZE*i, BASE_X+UNIT_SIZE*9, BASE_Y+UNIT_SIZE*i);
	}
	for (let i=0; i<10; i++){
		line(BASE_X+UNIT_SIZE*i, BASE_Y, BASE_X+UNIT_SIZE*i, BASE_Y+UNIT_SIZE*9);
	}
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
	text('w:'+capture.width+' h:'+capture.height, DEBUG_VIEW_X, debugY);
}
function touchMoved() {
	return false;
}