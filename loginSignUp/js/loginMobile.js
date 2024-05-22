document.addEventListener('DOMContentLoaded', function() {
    const ws = new WebSocket('wss://f340-58-234-12-186.ngrok-free.app/');
    const video = document.getElementById("video");
    let verificationInterval;

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };


    ws.onmessage = function(event) {
        console.log('Message from server:', event.data);
        const data = JSON.parse(event.data);
        
        if (data.type === 'loginResponse') {
            localStorage.setItem('loginStatic', JSON.stringify(data.isMatch));
            handleLoginResponse(data.isMatch);
            if (data.isMatch) {
                // isMatch가 true일 때 로직 실행 종료
                console.log("Login process completed with success.");
                ws.close(); // WebSocket 연결 종료
                return; // 추가 실행 중지
            }
        }
    };
    
     function getQueryParam(param) {
    var url = window.location.href;
    var searchParams = new URLSearchParams(url.substring(url.indexOf('?')));
    return searchParams.get(param);
    }

    var dataValue;

    window.onload = function() {
        dataValue = getQueryParam('data');
    };  
    document.getElementById('startVerification').addEventListener('click', function() {
        if (!verificationInterval) {
            verificationInterval = setInterval(verifyFaceAgainstStoredDescriptor, 5000);
            console.log('Verification started.');
        }
    });

    document.getElementById('stopVerification').addEventListener('click', function() {
        if (verificationInterval) {
            clearInterval(verificationInterval);
            verificationInterval = null;
            console.log('Verification stopped.');
        }
    });


    function verifyFaceAgainstStoredDescriptor() {
        const storedDescriptorString = dataValue;
       
        const storedDescriptor = JSON.parse(storedDescriptorString);
        
        // 이 함수는 mobileCamera.js에서 캡처된 실시간 디스크립터와 비교를 수행
        // 여기서는 mobileCamera.js에서 이미 얼굴 인식이 수행되고 있으므로 그 결과를 사용
        const liveDescriptor = window.saveddDescriptor;  // 실시간 얼굴 인식 결과 가져오기(stringforQR로 계산된 결과임)
        if (liveDescriptor) {
            
            const isMatch = compareDescriptors(storedDescriptor, liveDescriptor);
            console.log(isMatch);
            sendMatchResult(isMatch);
        } else {
            console.log('No live descriptor captured.');
        }
    }

    function compareDescriptors(storedDescriptor, liveDescriptor) {
        const distance = Math.abs(storedDescriptor- liveDescriptor);
       
        return distance <0.1 ; // 적절한 매칭 임계값 설정
    }

    function sendMatchResult(isMatch) {
        console.log('Sending match result to server:', isMatch);
        ws.send(JSON.stringify({ type: 'loginVerification', isMatch: isMatch }));
    }

    function handleLoginResponse(isMatch) {
        if (isMatch) {
            console.log('Login successful!');
            // 성공적으로 로그인 되었다면 다음 페이지로 이동 혹은 UI 업데이트
        } else {
            alert('Login failed. Face does not match.');
            // 로그인 실패 처리
        }
    }

    //setInterval(verifyFaceAgainstStoredDescriptor,5000); // 주기적으로 검증 실행
});
