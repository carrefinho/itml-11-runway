const { StillCamera } = require("pi-camera-connect");
const stillCamera = new StillCamera();

const Jimp = require('jimp');
const io = require('socket.io-client');
const socket = io.connect('http://kk-radiant.local:3000', {reconnect: true});

const token = "data:image/jpeg;base64,";

socket.on('connect', () => {
    console.log('connected');

    stillCamera.takeImage().then( async (image) => {
        let jpegImage = await Jimp.read(image);
        await jpegImage.resize(600, 400);
        let base64 = await jpegImage.getBase64Async(Jimp.AUTO);
        
        socket.emit('query', {
            "image": base64,
            "max_detections": 10
        });
    });
});

socket.on('data', (data) => {
    console.log(data.outputData);
});