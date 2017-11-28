window.onload = pageLoad;
var modes = ['#fabe58', '#cc4a4c', 'green', 'white']
var mode = 1;
var powerScreenOn;

function pageLoad() {
    var powerButton = document.getElementById("powerButton");
    powerButton.onclick = screenPowerOn;
    modeButton.onclick = changeMode;
}

function screenPowerOn() {
    powerButton.innerText = 'выкл';
    powerButton.classList.add('pressed');
    powerButton.onclick = screenPowerOff;
    powerScreenOn = setInterval(getMap, 1000); 
}
function screenPowerOff() {
    powerButton.innerText = 'вкл';
    var powerText = document.getElementById("powerPanel");
    powerText.innerHTML = "Ожидание";
    powerButton.classList.remove('pressed');
    powerButton.onclick = screenPowerOn;
    document.getElementById("screen-output").innerHTML = '';
    document.getElementById("id-output").innerHTML = 'NO DATA';
    document.getElementById("date-output").innerHTML = 'NO DATA';
    clearInterval(powerScreenOn);
}
function getMap() {
      var xhttp = new XMLHttpRequest();
      var powerText = document.getElementById("powerPanel");
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            powerText.innerHTML = "Получение данных";
            var json_map = JSON.parse(this.responseText);
            document.getElementById("id-output").innerHTML = json_map.id;
            document.getElementById("date-output").innerHTML = new Date(json_map.date);
            document.getElementById("screen-output").innerHTML = json_map.map;
        } else if (this.readyState == 4 && this.status != 200 ) {        
            powerText.innerHTML = "Блокируется";
        };
      };
      xhttp.open("GET", "http://radar.lafox.net/api/getMap", true);
      xhttp.send();
}

function changeMode() {
    var screen = document.getElementById("screen-output");
    if (mode>modes.length-1) {
        mode = 0;
    }
    screen.style.color = modes[mode];
    mode++;

}
