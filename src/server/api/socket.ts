import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 3000 });
wss.addListener("error",(e:Event)=>{console.log("wrong",e)});
wss.on('connection', (ws) => {
  ws.on('message', () => {
    console.log('Received message ');
  });

});
wss.on('error', (error) => {
  console.log('后端WebSocket error:', error);
});

console.log('WebSocket server is running on ws://localhost:3001');

