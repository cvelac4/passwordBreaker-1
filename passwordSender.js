/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const sha256 = require('js-sha256');
const WebSocket = require('ws');
const packageData = require('./package.json');
const readline = require('readline');
const ip = require('ip');

const serverIp = ip.address();

var numClients = 0;

const lineInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const server = new WebSocket.Server({ 
	port: packageData.port 
});

const broadcast = (data) => {
	server.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

let hashed;
const attackSpace = Math.pow(26, 4);

lineInterface.on('line', (line) => {
        
        if (line.length === 4) {
            let range = attackSpace/ numClients;
            hashed = sha256(line);
            broadcast(JSON.stringify({
		
		command: 'BREAK',
		range,
                hashed,
	}));
        }
    
	
     
});	

server.on('connection', (ws) => { 
    //console.log(`${messageData.ip} has connected`);
                                numClients++;
                                console.log(numClients + " computer(s) connected");
                                
                         
                               
				ws.send(JSON.stringify({
                                    command: 'init',
                                    data: numClients,
                                }));
                                
	ws.on('message', (message) => {
		const messageData = JSON.parse(message);
		switch (messageData.command) {
			case 'OPEN':
				
                                                
					
				
				break;
			case 'MESSAGE':
				console.log(`${messageData.ip} sent :  ${messageData.data}`);
				server.clients.forEach((client) => {
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						client.send(message);
					}
				});
				break;
                        case 'FOUND' : 
                                console.log(messageData.answer);
                                break;
			default:
			console.log('unknown command');
		}
	});
	console.log('client connected');
});

console.log(`Listening at  ws:\/\/${serverIp}:${packageData.port}`);




/*const sha256 = require('js-sha256');
// a-z
let availableItems = 26;
// max length 6 chars
let maxLength = 4;
// attack range
let attackRange = Math.pow(availableItems, maxLength);
let testPassword = 'abcd';
let targetHash = sha256(testPassword);
console.log(`Total bruteforce combinations : ${attackRange}`);
console.log(`Attacking : ${testPassword} : ${targetHash}`);

// 36^2, 36^1, 36^0 ect
let splits = [];
for (let i = 0; i < maxLength; i++) {
    splits.push(Math.pow(availableItems, i));
}

let letterMapper;
let mappedNumber;
let basedIndex;
let mapped;
let hashed;
for (let i = 0; i < attackRange; i++) {
    // map our letter
    mappedNumber = i;
    letterMapper = [];
    for (let j = maxLength-1; j >=0; j--) {
        basedIndex = Math.floor(mappedNumber/splits[j]);
        letterMapper.push(String.fromCharCode(97 + basedIndex));
        mappedNumber = mappedNumber%splits[j];
    }
    mapped = letterMapper.join('');
    hashed = sha256(mapped);
    //console.log(`${mapped} hashes to: ${hashed}`);
    if (targetHash === hashed) {
        console.log(`PASSWORD BROKEN : '${mapped}' Attempt number: ${i}`);
        break;
    }
}*/




