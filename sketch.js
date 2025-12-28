let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 1280;

const GRID_SIZE = 64;
const BASE_X = GRID_SIZE*3;
const BASE_Y = GRID_SIZE*3;
const UNIT_SIZE = GRID_SIZE*1;
const BASE_W = GRID_SIZE*9;

let capture;
let captureImage;
let captureFlag = false;
let imageFlag = false;
//let sizeFlag = false;
const SIZE_MODE = [9,15,16];
let sizeMode = 0;
const ZOOM_MODE = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0];
let zoomMode = 0;

const BUTTON_OFFSET = 8;
const BUTTON_W = GRID_SIZE*3;
const BUTTON_H = GRID_SIZE*2;
const BUTTON_X = GRID_SIZE*1;
const BUTTON_Y = GRID_SIZE*16;
const BUTTON_M = 24;
let capButton, saveButton, startButton, sizeButton;
let zoomPlus, zoomMinus;

const DEBUG = true;
const DEBUG_VIEW_X = 40;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}
function startFn() {
	const val = {
		width: 720,
		height: 720,
		facingMode: {exact: "environment"}
	};
	capture = createCapture({
		audio: false,
		video: val
	});
	capture.hide();
	captureFlag = true;
}
function capFn() {
	if (captureFlag){
		if (imageFlag){
			imageFlag = false;
		}else{
			const z = ZOOM_MODE[zoomMode];
			const wr = capture.width/CANVAS_W/z;
			const w = int(UNIT_SIZE*9*wr);
			captureImage = capture.get(int((capture.width-w)/2), int((capture.width-w)/2), w, w);
			imageFlag = true;
		}
	}else{
	}
}
function saveFn() {
	let s = SIZE_MODE[sizeMode];
	if (imageFlag){
		const fileName = 'np'+s+'_'+year()+month()+day()+hour()+minute()+second();
		console.log(fileName);
		captureImage.save(fileName, 'jpg');
	}
}
function sizeFn() {
	sizeMode++;
	if (sizeMode>=SIZE_MODE.length){
		sizeMode = 0;
	}
}
function zoomPlusFn() {
	zoomMode++;
	if (zoomMode>=ZOOM_MODE.length){
		zoomMode = ZOOM_MODE.length-1;
	}
}
function zoomMinusFn() {
	zoomMode--;
	if (zoomMode<0){
		zoomMode = 0;
	}
}
function setup() {
	createCanvas(CANVAS_W, CANVAS_H);
	time = millis();
	rectMode(CENTER);
	capButton = buttonInit('cap', BUTTON_W, BUTTON_H, BUTTON_X+BUTTON_W+BUTTON_M, BUTTON_Y);
	capButton.mousePressed(capFn);
	saveButton = buttonInit('save', BUTTON_W, BUTTON_H, BUTTON_X+2*(BUTTON_W+BUTTON_M), BUTTON_Y);
	saveButton.mousePressed(saveFn);
	startButton = buttonInit('start', BUTTON_W, BUTTON_H, BUTTON_X, BUTTON_Y);
	startButton.mousePressed(startFn);
	sizeButton = buttonInit('size', BUTTON_W, BUTTON_H, BUTTON_X+3*(BUTTON_W+BUTTON_M), BUTTON_Y);
	sizeButton.mousePressed(sizeFn);
	zoomPlus = buttonInit('zoom+', BUTTON_W, BUTTON_H, BUTTON_X+0*(BUTTON_W+BUTTON_M), BUTTON_Y-GRID_SIZE*3);
	zoomPlus.mousePressed(zoomPlusFn);
	zoomMinus = buttonInit('zoom-', BUTTON_W, BUTTON_H, BUTTON_X+1*(BUTTON_W+BUTTON_M), BUTTON_Y-GRID_SIZE*3);
	zoomMinus.mousePressed(zoomMinusFn);
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
	const z = ZOOM_MODE[zoomMode];
	if (imageFlag){
		image(captureImage, BASE_X, BASE_Y, UNIT_SIZE*9, UNIT_SIZE*9);
	}else if (captureFlag){
//		image(capture, 0, 0, CANVAS_W, CANVAS_W);
		image(capture, CANVAS_W/2*(1-z), CANVAS_W/2*(1-z), CANVAS_W/2*(1+z), CANVAS_W/2*(1+z));
	}
	stroke(200);
	strokeWeight(3);
	const s = SIZE_MODE[sizeMode];
	for (let i=0; i<s+1; i++){
		line(BASE_X, BASE_Y+BASE_W*i/s, BASE_X+BASE_W, BASE_Y+BASE_W*i/s);
	}
	for (let i=0; i<s+1; i++){
		line(BASE_X+BASE_W*i/s, BASE_Y, BASE_X+BASE_W*i/s, BASE_Y+BASE_W);
	}
/*
	if (sizeFlag){
		for (let i=0; i<16; i++){
			line(BASE_X, BASE_Y+BASE_W*i/15, BASE_X+BASE_W, BASE_Y+BASE_W*i/15);
		}
		for (let i=0; i<16; i++){
			line(BASE_X+BASE_W*i/15, BASE_Y, BASE_X+BASE_W*i/15, BASE_Y+BASE_W);
		}
	}else{
		for (let i=0; i<10; i++){
			line(BASE_X, BASE_Y+UNIT_SIZE*i, BASE_X+UNIT_SIZE*9, BASE_Y+UNIT_SIZE*i);
		}
		for (let i=0; i<10; i++){
			line(BASE_X+UNIT_SIZE*i, BASE_Y, BASE_X+UNIT_SIZE*i, BASE_Y+UNIT_SIZE*9);
		}
	}
*/
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
	text('zoom:'+ZOOM_MODE[zoomMode], DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
	if (captureFlag){
		text('w:'+capture.width+' h:'+capture.height, DEBUG_VIEW_X, debugY);
	}
}
function touchMoved() {
	return false;
}