
var getData = localStorage.getItem("receivedMessages");
var qrcodeText = " https://f340-58-234-12-186.ngrok-free.app/loginMobile.html?data="+getData;
new QRCode(document.getElementById("qrcodeImage"), {
    width: 200,
    height: 200,
    colorDark : "rgb(245,245,220)",
    colorLight : "rgb(85, 107, 47)",
    text: qrcodeText
});


function setLocalData() {
    try {
        var stringData = document.getElementById("localDataInput").value;
        localStorage.setItem("stringData_", stringData);
        //makeCode();
        
    } catch (error) {
        console.error("Error setting data:", error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const setLocalDataButton = document.getElementById("setLocalData");
    if (setLocalDataButton) {
        setLocalDataButton.addEventListener('click', setLocalData);
    }
});
