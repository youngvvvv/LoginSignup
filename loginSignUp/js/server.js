const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
server.listen(8082, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:8082`);
});

// 웹소켓 연결 처리
wss.on('connection', function connection(ws) {
    console.log('Client connected via WebSocket');

    ws.on('message', function incoming(message) {
        console.log('Received from client: ' + message);
        // 여기서 서버가 필요에 따라 메시지를 처리
        // 예를 들어, 받은 메시지를 다른 로직에 사용하거나 저장

        // 다른 클라이언트에 메시지를 전송할 수 있습니다
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(""+message);
            }
        });
    });
});




/* 페이지 로드 시, 저장된 받은 메시지 목록을 업데이트
window.onload = function() {
    updateReceivedMessages();
} 
*/
app.use(express.static(path.join(__dirname, '../')));

// 루트 경로에 대한 요청을 처리
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});



// HTML 파일 제공
// app.use(express.static('public'));  // 'public' 디렉터리에 있는 파일을 서빙

// 서버 시작
const PORT = 8082;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
