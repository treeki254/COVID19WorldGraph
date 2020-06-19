var mainCanvas = document.querySelector("#myWorldChart");
var mainContext = mainCanvas.getContext("2d");

var chartArea = document.querySelector("div.chart-area");

let widthFromWindow = window.innerWidth - 300 + "px";
chartArea.style.width = widthFromWindow;
mainCanvas.width = $("div.chart-area").width();

let heightFromWindow = window.innerHeight - 150 + "px";
chartArea.style.height = heightFromWindow;
mainCanvas.height = $("div.chart-area").height();

var chartWidth = mainCanvas.width;
var chartHeight = mainCanvas.height;

var miniCanvas = document.querySelector("#myMiniChart");
var miniContext = miniCanvas.getContext("2d");

miniCanvas.width = $(".chart-pie").width();
miniCanvas.height = $(".chart-pie").height();

var miniWidth = miniCanvas.width;
var miniHeight = miniCanvas.height;

window.addEventListener("resize", function() {
  
    let widthFromWindow = window.innerWidth - 300 + "px";
    chartArea.style.width = widthFromWindow;
    chartWidth = mainCanvas.width = $("div.chart-area").width();

    let heightFromWindow = window.innerHeight - 150 + "px";
    chartArea.style.height = heightFromWindow;
    chartHeight = mainCanvas.height = $("div.chart-area").height();

    miniWidth = miniCanvas.width = $(".chart-pie").width();
    miniHeight = miniCanvas.height = $(".chart-pie").height();
});

mainCanvas.addEventListener("click", pause);

var calendar = document.querySelector("#miniCalendar");
var pursuitNats = document.querySelector(".mr-2"); // 추적 국가 표시할 부분

var today = new Date();
today.getHours() >= 11 ? today : today.setDate(today.getDate() - 1); // 11시 이후에 해당 날짜 파일이 만들어지므로
today = dateToString(today);

var fileURL = "http://52.79.234.221:8080/CoronaGraph/" + today.substring(0, 4) + today.substring(5,7) + today.substring(8, 10) +"CoronaWorld.json";
var filePath = "dataset/20200618CoronaWorld.json"; // AWS 또는 인터넷이 안 될 경우 로컬 파일로

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var speed = 100;
var count = 0;
var anim; // requestAnimation의 id값. cancelAnimation에 전달
var isAnimate = true;
var isRelocating = false;
var relocationCount = 0;

var worldIdx = 0;
var chnIdx = 0; // 2월 15일 이전 데이터 있는 국가들(중국, 일본 등)은 따로 인덱스&객체

var startDateOfCHN = new Date(2020 , 0, 20); // 현재 1월 20일(중국 등)
var startDate = new Date(2020, 1, 15); // 2월 15일(세계) 
var endDate; // 파일 날짜의 하루 전, 혹은 이틀 전(월드미터스가 아직 갱신 되지 않았을 경우)
var duration, days, durationOfCHN, daysOfCHN;
var curDate; // 차트에 표시할 날짜. yyyy-mm-dd 형식의 문자열


var formerCountries = ["Australia", "Belgium", "Canada", "China", "Finland", "France", "Germany", "Hong Kong", "India", "Italy", "Japan", "Malaysia",
"Nepal", "Philippines", "Russia", "S. Korea", "Singapore", "Spain", "Sri Lanka", "Sweden", "Thailand", "UAE", "UK", "USA"]; // 2월 15일 이전에 데이터가 있는 국가들의 목록
var formerNations = []; // 2월 15일 이전에 데이터가 있는 국가들의 이름과 인덱스 저장
var nations = [];  // 파일에서 읽어온 나라 이름과 데이터 시작 인덱스 배열 저장 
var world = []; // 국가 이름, 확진자, 사망자, 인덱스, 이미지, 좌표를 포함한 객체 넣을 배열
var formerWorld = []; // 2월 15일 이전에 데이터가 있는 국가들의 객체 저장

var dict = {"China":"중국", "S. Korea":"한국", "USA":"미국", "Brazil":"브라질", "Russia":"러시아", "Spain":"스페인", "UK":"영국", "Italy":"이탈리아", 
"India":"인도", "France":"프랑스", "Germany":"독일", "Peru":"페루", "Turkey":"터키", "Iran":"이란", "Chile":"칠레", "Canada":"캐나다", "Mexico":"멕시코",
"Saudi Arabia":"사우디아라비아", "Pakistan":"파키스탄", "Belgium":"벨기에", "Qatar":"카타르", "Bangladesh":"방글라데시", "Netherlands":"네덜란드",
"Belarus":"벨라루스", "Ecuador":"에콰도르", "Sweden":"스웨덴", "Singapore":"싱가포르", "UAE":"아랍에미리트", "South Africa":"남아프리카 공화국", 
"Portugal":"포르투갈", "Switzerland":"스위스", "Colombia":"콜롬비아", "Kuwait":"쿠웨이트", "Indonesia":"인도네시아", "Ireland":"아일랜드", "Egypt":"이집트",
"Ukraine":"우크라이나", "Poland":"폴란드", "Romania":"루마니아", "Philippines":"필리핀", "Dominican Republic":"도미니카 공화국", "Israel":"이스라엘", "Japan":"일본",
"Argentina":"아르헨티나", "Austria":"오스트리아", "Afghanistan":"아프가니스탄", "Panama":"파나마", "Denmark":"덴마크", "Oman":"오만", "Serbia":"세르비아",
"Bahrain":"바레인", "Kazakhstan":"카자흐스탄", "Nigeria":"나이지리아", "Bolivia":"볼리비아", "Armenia":"아르메니아", "Algeria":"알제리", "Czechia":"체코", 
"Norway":"노르웨이", "Moldova":"몰도바", "Ghana":"가나", "Malaysia":"말레이시아", "Morocco":"모로코", "Australia":"호주", "Finland":"핀란드", "Iraq":"이라크",
"Cameroon":"카메룬", "Azerbaijan":"아제르바이잔", "Honduras":"온두라스", "Guatemala":"과테말라", "Sudan":"수단", "Luxembourg":"룩셈부르크", "Tajikistan":"타지키스탄",
"Hungary":"헝가리", "Guinea":"기니", "Uzbekistan":"우즈베키스탄", "Senegal":"세네갈", "Djibouti":"지부티", "Thailand":"태국", "DRC":"콩고 민주 공화국",
"Greece":"그리스", "Ivory Coast":"코트디부아르", "Gabon":"가봉", "Bulgaria":"불가리아", "El Salvador":"엘 살바도르", "Bosnia and Herzegovina":"보스니아 헤르체고비나",
"Croatia":"크로아티아", "North Macedonia":"북마케도니아", "Haiti":"아이티", "Cuba":"쿠바", "Somalia":"소말리아", "Kenya":"케냐", "Estonia":"에스토니아", 
"Kyrgyzstan":"키르기즈스탄", "Iceland":"아이슬란드", "Maldives":"몰디브", "Mayotte":"마요트", "Lithuania":"리투아니아", "Sri Lanka":"스리랑카", "Nepal":"네팔", 
"Slovakia":"슬로바키아", "Venezuela":"베네수엘라", "New Zealand":"뉴질랜드", "Slovenia":"슬로베니아", "Equatorial Guinea":"적도 기니", "Mali":"말리",
"Guinea-Bissau":"기니비사우", "Lebanon":"레바논", "Ethiopia":"에티오피아", "Albania":"알바니아", "Hong Kong":"홍콩", "Tunisia":"튀니지", "Latvia":"라트비아",
"Zambia":"잠비아", "Costa Rica":"코스타리카", "CAR":"중앙아프리카 공화국", "South Sudan":"남수단", "Paraguay":"파라과이", "Niger":"니제르", "Cyprus":"키프로스",
"Sierra Leone":"시에라리온", "Burkina Faso":"부르키나 파소", "Uruguay":"우루과이", "Georgia":"조지아", "Chad":"차드", "Madagascar":"마다가스카르", "Andorra":"안도라",
"Nicaragua":"니카과라", "Jordan":"요르단", "San Marino":"산마리노", "Malta":"몰타", "Congo":"콩고", "Jamaica":"자메이카", "Mauritania":"모리타니", "French Guiana":"프랑스령 기아나"};

var minX = 0;
var maxX = 8;
var minY = 0;
var maxY = 1; // 특정 국가 추적하면 값이 count별로 바뀌고, scatter 이미지 그릴 때 참조해야하므로 일단 전역 변수로
// 2바퀴째 이상 그릴 때에도 똑같아야 하므로 axisSetting의 min max를 직접 변경하지 않고 따로 변수 마련함

var isPursuitChanged = false; // 추적 국가 바뀌었을 때 표시
var pursuitCountries1 = ["", "", "", "Canada", "Canada", "", "", "", "", ""]; // 추적국가 변경 또는 해제했다가 디폴트로 돌아갈 때 참조
var pursuitCountries2 = ["", "", "", "USA", "Mexico", "", "", "", "", ""];
var emptyCountries = ["", "", "", "", "", "", "", "", "", ""]; // 추적 하지 않을 때 사용

var imgWidth, imgHeight; // 설정될 이미지 기본 크기

var miniX, miniY, miniX2, miniY2; // 미니맵 클릭 좌표

var isMiniDrawing = false;
var miniColor = miniCanvas.style.backgroundColor;

function startDrag(event){
    let rect = miniCanvas.getBoundingClientRect();
    miniX = event.clientX - rect.left; 
    miniY = event.clientY - rect.top;
    isMiniDrawing = true;
}

function keepDrag(event){
    if (isMiniDrawing){
        let rect = miniCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left; 
        let y = event.clientY - rect.top;
        let sx = x > miniX ? miniX : x;
        let sy = y > miniY ? miniY : y;
        
        drawMinimap();

        miniContext.strokeStyle = "gray";
        miniContext.strokeRect(sx, sy, Math.abs(miniX - x), Math.abs(miniY - y));
        
    }
    
}

function endDrag(event){
    let rect = miniCanvas.getBoundingClientRect();
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top;
    if (Math.abs(miniX - x) < 10 || Math.abs(miniY - y) < 10) drawMinimap(miniX, miniY); // 드래그 크기가 작은 경우 클릭으로 처리(실수 방지 등)
    else {
        let startX, startY, endX, endY;

        if (x > miniX) {
            startX = miniX; endX = x;
        } else {
            startX = x; endX = miniX;
        }

        if (y > miniY) {
            startY = miniY; endY = y;
        } else {
            startY = y; endY = miniY;
        }

        drawMinimap(startX, startY, endX, endY);
    }
    isMiniDrawing = false;
}

miniCanvas.addEventListener("mousedown", startDrag);
miniCanvas.addEventListener("mouseup", endDrag);
miniCanvas.addEventListener("mousemove", keepDrag);

function setCaseRange() {
    let axis = axisSettings;
    let isNotCancel = true;
    let isMinInputYet = true;
    let isMaxInputYet = true;
    let num, tempMinX, tempMaxX;

    while(isMinInputYet && isNotCancel){
        num = parseInt( prompt("확진자 최소 범위를 입력하세요") );
        if(isNaN(num) || num == null || num == ""){
            isNotCancel = false;
        } else if (!isFinite(num) || num < 0 || num > axis.screenLimitX[axis.axisIdx]) {
            alert("적절한 범위의 숫자(0~" + axis.screenLimitX[axis.axisIdx] + ")를 입력하세요");
        } else {
            tempMinX = num;
            isMinInputYet = false;
        }
    }

    while(isMaxInputYet && isNotCancel){
        num = parseInt( prompt("확진자 최대 범위를 입력하세요") );
        if (isNaN(num) || num == null || num == "") {
            isNotCancel = false;
        } else if(!isFinite(num) || num <= tempMinX || num > axis.screenLimitX[axis.axisIdx]){
            alert("적절한 범위의 숫자(" + (tempMinX + 1)  + "~" + axis.screenLimitX[axis.axisIdx] + ")를 입력하세요");
        } else {
            tempMaxX = num;
            isMaxInputYet = false;

            axis.pursuitNat1 = emptyCountries.slice(0);
            axis.pursuitNat2 = emptyCountries.slice(0);
            axis.isDefaultScreen = false;

            minX = tempMinX;
            maxX = tempMaxX;
        }
    }
    
};

function setDeathRange() {
    let axis = axisSettings;
    let isNotCancel = true;
    let isMinInputYet = true;
    let isMaxInputYet = true;
    let num, tempMinY, tempMaxY;

    while(isMinInputYet && isNotCancel){
        num = parseInt( prompt("사망자 최소 범위를 입력하세요") );
        if(isNaN(num) || num == null || num == ""){
            isNotCancel = false;
        } else if (!isFinite(num) || num < 0 || num > axis.screenLimitY[axis.axisIdx]) {
            alert("적절한 범위의 숫자(0~" + axis.screenLimitY[axis.axisIdx] + ")를 입력하세요");
        } else {
            tempMinY = num;
            isMinInputYet = false;
        }
    }

    while(isMaxInputYet && isNotCancel){
        num = parseInt( prompt("사망자 최대 범위를 입력하세요") );
        if (isNaN(num) || num == null || num == "") {
            isNotCancel = false;
        } else if(!isFinite(num) || num <= tempMinY || num > axis.screenLimitY[axis.axisIdx]){
            alert("적절한 범위의 숫자(" + (tempMinY + 1)  + "~" + axis.screenLimitY[axis.axisIdx] + ")를 입력하세요");
        } else {
            tempMaxY = num;
            isMaxInputYet = false;

            axis.pursuitNat1 = emptyCountries.slice(0);
            axis.pursuitNat2 = emptyCountries.slice(0);
            axis.isDefaultScreen = false;

            minY = tempMinY;
            maxY = tempMaxY;
        }
    }
    
};

function toggleFullScreen() { // 전체화면으로 차트 보기
    let cvs = mainCanvas;
    if (cvs.requestFullscreen) {
        cvs.requestFullscreen();
      } else if (cvs.mozRequestFullScreen) { /* Firefox */
        cvs.mozRequestFullScreen();
      } else if (cvs.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        cvs.webkitRequestFullscreen();
      } else if (cvs.msRequestFullscreen) { /* IE/Edge */
        cvs = window.top.document.body; //To break out of frame in IE
        cvs.msRequestFullscreen();
      }
};

document.addEventListener("keypress", function(e) { // 전체화면 enter key
    if (e.keyCode === 13) {
      toggleFullScreen();
    }
}, false);

function setSpeed(val){
    if (val < speed) count = 0;
    speed = val;
};

function changeDate(val){
    let userDate = stringToDate(val);
    chnIdx = (userDate - startDateOfCHN) / 86400000;
    worldIdx = (userDate - startDate) / 86400000;
    worldIdx = worldIdx > 0 ? worldIdx : 0;
    switch(true){
        case chnIdx < 12:
            axisSettings.axisIdx = 0;
            break;
        case chnIdx < 26:
            axisSettings.axisIdx = 1;
            break;
        case worldIdx < 15:
            axisSettings.axisIdx = 2;
            break;
        case worldIdx < 30:
            axisSettings.axisIdx = 3;
            break;
        case worldIdx < 46:
            axisSettings.axisIdx = 4;
            break;
        case worldIdx < 61:
            axisSettings.axisIdx = 5;
            break;
        case worldIdx < 76:
            axisSettings.axisIdx = 6;
            break;
        case worldIdx < 91:
            axisSettings.axisIdx = 7;
            break;
        case worldIdx < 107:
            axisSettings.axisIdx = 8;
            break;    
        default:
            axisSettings.axisIdx = 9;
            break;
    }
    isPursuitChanged = true;
    curDate = val;
};

function selectCountry(){
    let received = event.target.value;
    let axis = axisSettings
    let pursuit1 = axis.pursuitNat1[axis.axisIdx];
    let pursuit2 = axis.pursuitNat2[axis.axisIdx];

    if (received == pursuit2) axis.pursuitNat2 = emptyCountries; // 이미 쫓고 있는 국가의 값이 전달된다면 해제이므로
    
    else if (received == pursuit1) { // 1번 추적을 해제할 경우 2번을 올리고, 2번 슬롯은 비움

        axis.pursuitNat1 = axis.pursuitNat2.slice(0);
        axis.pursuitNat2 = emptyCountries.slice(0);
        
    } else {
        if (formerCountries.includes(received)){ // 2월 15일 전에 데이터가 있는 국가는 전체 변경

            if (pursuit1) axis.pursuitNat2.fill(received); // 1번 추적 국가가 있는 경우 2번 슬롯 교체
            else axis.pursuitNat1.fill(received);

        } else { // 2월 15일 이후의 국가들은 2월말 이후 값 변경

            if (pursuit1) axis.pursuitNat2.fill(received, 2); // 1번 추적 국가가 있는 경우 2번 슬롯 교체
            else axis.pursuitNat1.fill(received, 2);
        }
        
    }

    isPursuitChanged = true;
    axis.isDefaultScreen = false;
    addDropDown();
};

function addDropDown(){
    let select = document.getElementById("chase");
    let pursuit1 = axisSettings.pursuitNat1[axisSettings.axisIdx];
    let pursuit2 = axisSettings.pursuitNat2[axisSettings.axisIdx];

    select.innerHTML = "";

    if(pursuit1){
        let el = document.createElement("a"); 
        el.className = "dropdown-item";
        el.textContent = dict[pursuit1] + "(추적 중)";
        el.value = pursuit1;
        el.addEventListener("click", selectCountry);
        select.appendChild(el); 
    }
    if(pursuit2){
        let el = document.createElement("a"); 
        el.className = "dropdown-item";
        el.textContent = dict[pursuit2] + "(추적 중)";
        el.value = pursuit2;
        el.addEventListener("click", selectCountry);
        select.appendChild(el); 
    }

    let countryLength = formerWorld.length;
    for (var i = 0; i < countryLength; i++) { 
        let el = document.createElement("a");
        el.value = formerWorld[i].nation;
        if(el.value == pursuit1 || el.value == pursuit2) continue; // 추적 중인 국가 제외
        if(formerWorld[i].totCase[chnIdx] < 1) continue; // 0명 국가 제외
        el.className = "dropdown-item";
        el.textContent = formerWorld[i].name;
        el.addEventListener("click", selectCountry);
        select.appendChild(el); 
    }

    if(chnIdx > 25){
        countryLength = world.length;
        for (var i = 0; i < countryLength; i++) { 
            let el = document.createElement("a");
            el.value = world[i].nation;
            if(el.value == pursuit1 || el.value == pursuit2) continue; // 추적 중인 국가 제외
            if(world[i].totCase[worldIdx] < 1) continue; // 0명 국가 제외
            el.className = "dropdown-item";
            el.textContent = world[i].name;
            el.addEventListener("click", selectCountry);
            select.appendChild(el); 
        }
    }
}

function pause(){
    if (isAnimate == true) {
        cancelAnimationFrame(anim);
        isAnimate = false;
    } else {
        anim = requestAnimationFrame(drawCircle);
        isAnimate = true;
    }
};

function initialize(){
    let axis = axisSettings;
    axis.pursuitNat1 = pursuitCountries1.slice(0);
    axis.pursuitNat2 = pursuitCountries2.slice(0);
    axis.isDefaultScreen = true;
    minX = axis.defaultMinX[axis.axisIdx];
    maxX = axis.defaultMaxX[axis.axisIdx];
    minY = axis.defaultMinY[axis.axisIdx];
    maxY = axis.defaultMaxY[axis.axisIdx];
};

function dateToString(objectDate){
    let year = objectDate.getFullYear();
    let month = objectDate.getMonth() + 1;
    month = month < 9 ? "0" + month : month;
    let date = objectDate.getDate();
    date = date < 10 ? "0" + date : date;

    return year + "-" + month + "-" + date;
}

function stringToDate(stringDate){
    let year = stringDate.substring(0,4);
    let month = stringDate.substring(5,7);
    let date = stringDate.substring(8,10);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
}

function isOutOfRangeX(cord){
    if (cord < minX || maxX < cord) return true;
    else return false;
}

function isOutOfRangeY(cord){
    if (cord < minY || maxY < cord) return true;
    else return false;
}

var axisSettings = {// 축 설정 방법 2가지 중 선택하기
    axisIdx : 0,
    pursuitNat1 : ["", "", "", "Canada", "Canada", "", "", "", "", ""], // 1말, 2초, 2말, 3초, 3말, 4초, 4말, 5초, 5말, 6초
    pursuitNat2 : ["", "", "", "USA", "Mexico", "", "", "", "", ""],
    isPursuitNat1InWorld : false, // 추적하는 국가가 world에 있는지 formerWorld에 있는지 (worldIdx chnIdx 중 무엇을 쓸지 결정)
    isPursuitNat2InWorld : false,
    isDefaultScreen : true, // 미니맵에서 화면 선택한 경우, 디폴트 화면 이동 방지
    isStucked : false, // 범위 안에 있지만 범위가 너무 커서 추적국가가 구석이 박힌 경우 재조정 요청
    pursuitNat1Case : [], // 추적 국가의 확진자, 사망자 찾기의 반복을 피하기 위해 보름마다 저장하고 시작
    pursuitNat1Death : [],
    pursuitNat2Case : [],
    pursuitNat2Death : [],
    pursuitPointX : 0.9, // 1. 포인트를 중심으로 축 설정. 추적시 포인트 찍을 위치 // 0~1 사이 값
    pursuitPointY : 0.9,
    nextMinMax : [0, 0, 0, 0], // 다음 구간 min max 값을 저장해둠으로써 여러번 반복해서 찾지 않도록 함 // minX, maxX, minY, maxY
    defaultMinX : [0, 3, 0, 0, 0, 0, 0, 0, 0, 1000], // 1말, 2초, 2말, 3초, 3말, 4초, 4말, 5초, 5말, 6초
    defaultMaxX : [8, 16, 70, 100, 1000, 1000, 1600, 2500, 5000, 10000], // 1월 디폴트 값은 전역변수에서 시작하므로 바꿀시 같이 수정할 것
    defaultMinY : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    defaultMaxY : [1, 1, 1, 1, 40, 30, 70, 150, 200, 450],
    intervalMinX : [8, 13, 70, 100, 1000, 3000, 1600, 2500, 5000, 9000], // 간격이 너무 좁혀지거나 멀어지지 않도록 쓰는 숫자 (일단 maxX - minX로 채움)
    intervalMinY : [1, 1, 1, 1, 40, 30, 70, 150, 200, 450],
    screenLimitX : [7, 16, 68, 3650, 200000, 660000, 1100000, 1500000, 1900000, 2500000], // 미니맵 최대 수치 // 가장 마지막 값은 추후 축 설정 없이 추적 가능하도록 큰 값 
    screenLimitY : [1, 1, 1, 75, 5200, 33000, 65000, 90000, 110000, 150000],
    
    initializeAxis : function() {

        // 다음 추적 국가가 있는 경우는 축 이동 중에 min max 설정 됨
        // 여기는 추적국가 없는 경우와 처음으로 돌아오는 경우 디폴트

        if ( ( chnIdx == 0 && (this.pursuitNat1[this.axisIdx] == "China" || this.pursuitNat2[this.axisIdx] == "China") ) || this.isDefaultScreen && ( chnIdx == 0 || (!this.pursuitNat1[this.axisIdx] && !this.pursuitNat2[this.axisIdx]) ) ){
            minX = this.defaultMinX[this.axisIdx];
            maxX = this.defaultMaxX[this.axisIdx];
            minY = this.defaultMinY[this.axisIdx];
            maxY = this.defaultMaxY[this.axisIdx];
        }
        
    },
    drawAxis : function() {

        let worldRef = world;
        let formerRef = formerWorld;
        let worldLength = world.length;
        let formerLength = formerWorld.length;
        let isFoundYet1, isFoundYet2;
        isFoundYet1 = isFoundYet2 = true;
        let caseNext1, deathNext1, caseNext2, deathNext2, targetNation1, targetNation2, maxCordX, minCordX, maxCordY, minCordY;
        
        let chrtWidth = chartWidth; // minX, maxY등은 직접 변경해야하므로 지역변수로 참조하지 않음
        let chrtHeight = chartHeight;
        let diff = count / speed;

        // 위쪽에서 min max 구하고, 아래쪽에서 격자 그리기

        // chnIdx 0 = 1월 20일, 11 = 1월 31일, 25 = 2월 14일
        // worldIdx 0 = 2월 15일, 14 = 2월 29일, 29 = 3월 15일, 45 = 3월 31일, 60 = 4월 15일, 75 = 4월 30일, 90 = 5월 15일, 106 = 5월 31일
        
        if (this.isDefaultScreen && (count > speed/2) && ( [11, 25].includes(chnIdx) || [14, 29, 45, 60, 75, 90, 106].includes(worldIdx) ) ) { // 특정 날짜되면 축 이동 // 일단 반나절동안 변경되도록 설정
            // 밑에서 다음 min max 구하고, 여기선 계산만
            let halfdayDiff = ((count - speed/2) * 2) / speed; // 반나절만에 축 이동하기 위한 diff

            minX = minX + (this.nextMinMax[0] - minX) * halfdayDiff;
            maxX = maxX + (this.nextMinMax[1] - maxX) * halfdayDiff;
            minY = minY + (this.nextMinMax[2] - minY) * halfdayDiff;
            maxY = maxY + (this.nextMinMax[3] - maxY) * halfdayDiff;


        } else if(this.isDefaultScreen && (count == Math.floor(speed/2)) && ( [11, 25].includes(chnIdx) || [14, 29, 45, 60, 75, 90, 106].includes(worldIdx) ) ){ // 특정 날짜되면 축 이동 // 일단 반나절동안 변경되도록 설정
            // 특정 count에서 다음 min max 결정하고, 이후 카운트에선 계산만
            
            if( this.pursuitNat2[this.axisIdx + 1] && this.pursuitNat1[this.axisIdx + 1] ){ // 다음 구간에 2개 국가를 추적할 경우
                targetNation1 = this.pursuitNat1[this.axisIdx + 1];
                targetNation2 = this.pursuitNat2[this.axisIdx + 1];
                let targets = [targetNation1, targetNation2];

                for(let i=0; (isFoundYet1 || isFoundYet2) && i < formerLength; i++){
                    if(targets.includes(formerRef[i].nation) ){
                        if(formerRef[i].nation == targetNation1){
                            caseNext1 = formerRef[i].totCase[chnIdx + 1];
                            deathNext1 = formerRef[i].totDeath[chnIdx + 1];
                            targets = [targetNation2];
                            isFoundYet1 = false;

                        } else if (formerRef[i].nation == targetNation2){
                            caseNext2 = formerRef[i].totCase[chnIdx + 1];
                            deathNext2 = formerRef[i].totDeath[chnIdx + 1];
                            targets = [targetNation1];
                            isFoundYet2 = false;

                        }
                    }
                }

                for(let i=0; (isFoundYet1 || isFoundYet2) && i < worldLength; i++){
                    if(targets.includes(worldRef[i].nation) ){
                        if(worldRef[i].nation == targetNation1){
                            caseNext1 = worldRef[i].totCase[worldIdx + 1];
                            deathNext1 = worldRef[i].totDeath[worldIdx + 1];
                            targets = [targetNation2];
                            isFoundYet1 = false;

                        } else if (worldRef[i].nation == targetNation2){
                            caseNext2 = worldRef[i].totCase[worldIdx + 1];
                            deathNext2 = worldRef[i].totDeath[worldIdx + 1];
                            targets = [targetNation1];
                            isFoundYet2 = false;

                        }
                    }
                }

                if(caseNext1 >= caseNext2){
                    maxCordX = caseNext1;
                    minCordX = caseNext2;
                } else {
                    maxCordX = caseNext2;
                    minCordX = caseNext1;
                }
                this.nextMinMax[1] = (maxCordX - minCordX < this.intervalMinX[this.axisIdx + 1]) ? minCordX + this.intervalMinX[this.axisIdx + 1] : maxCordX * 2;
                this.nextMinMax[0] = Math.ceil(minCordX * 0.95);

                if(deathNext1 >= deathNext2){
                    maxCordY = deathNext1;
                    minCordY = deathNext2;
                } else {
                    maxCordY = deathNext2;
                    minCordY = deathNext1;
                }

                this.nextMinMax[3] = (maxCordY - minCordY < this.intervalMinY[this.axisIdx + 1]) ? minCordY + this.intervalMinY[this.axisIdx + 1] : maxCordY * 2;
                this.nextMinMax[2] = Math.ceil(minCordY * 0.95);

            } else if ( this.pursuitNat1[this.axisIdx + 1] ){ // 국가 1개를 추적할 경우

                targetNation1 = this.pursuitNat1[this.axisIdx + 1];

                for(let i=0; i < formerLength; i++){
                    if(formerRef[i].nation == targetNation1){
                        caseNext1 = formerRef[i].totCase[chnIdx + 1];
                        deathNext1 = formerRef[i].totDeath[chnIdx + 1];
                        isFoundYet1 = false;
                        break;
                    }
                }
                for(let i=0; isFoundYet1 && i < worldLength; i++){
                    if(worldRef[i].nation == targetNation1){
                        caseNext1 = worldRef[i].totCase[worldIdx + 1];
                        deathNext1 = worldRef[i].totDeath[worldIdx + 1];
                        isFoundYet1 = false;
                        break;
                    }
                }

                this.nextMinMax[1] = caseNext1 * 2 < this.intervalMinX[this.axisIdx + 1] ? caseNext1 + this.intervalMinX[this.axisIdx + 1] : caseNext1 * 2;
                this.nextMinMax[0] = Math.ceil(caseNext1 * 0.95);

                this.nextMinMax[3] = deathNext1 * 2 < this.intervalMinY[this.axisIdx + 1] ? deathNext1 + this.intervalMinY[this.axisIdx + 1] : deathNext1 * 2;
                this.nextMinMax[2] = Math.ceil(deathNext1 * 0.95);


            } else { // 추적할 국가가 없는 경우
                this.nextMinMax[0] = this.defaultMinX[this.axisIdx + 1];
                this.nextMinMax[1] = this.defaultMaxX[this.axisIdx + 1];
                this.nextMinMax[2] = this.defaultMinY[this.axisIdx + 1];
                this.nextMinMax[3] = this.defaultMaxY[this.axisIdx + 1];
            }

        }
        else {

            if ( this.pursuitNat2[this.axisIdx] && this.pursuitNat1[this.axisIdx] ){ // 양 끝에 추적 국가 설정한 경우, 기존 min max에 추적국가가 접근했을 경우 min max 변경
                
                if( count == 0 || isPursuitChanged ){ // count 0일 때 or 추적 국가 변경시 추적국가 확진자, 사망자 찾아둠. 그 이외에는 찾은 배열로 계산만
                    targetNation1 = this.pursuitNat1[this.axisIdx];
                    targetNation2 = this.pursuitNat2[this.axisIdx];
                    let targets = [targetNation1, targetNation2];

                    for(let i=0; (isFoundYet1 || isFoundYet2) && i < formerLength; i++){
                        if(targets.includes(formerRef[i].nation) ){
                            if(formerRef[i].nation == targetNation1){
                                this.pursuitNat1Case = formerWorld[i].totCase;
                                this.pursuitNat1Death = formerWorld[i].totDeath;
                                targets = [targetNation2];
                                isFoundYet1 = false;
                                this.isPursuitNat1InWorld = false;

                            } else if (formerRef[i].nation == targetNation2){
                                this.pursuitNat2Case = formerWorld[i].totCase;
                                this.pursuitNat2Death = formerWorld[i].totDeath;
                                targets = [targetNation1];
                                isFoundYet2 = false;
                                this.isPursuitNat2InWorld = false;
                            }
                        }
                    }
                    for(let i=0; (isFoundYet1 || isFoundYet2) && i < worldLength; i++){
                        if(targets.includes(worldRef[i].nation) ){
                            if(worldRef[i].nation == targetNation1){
                                this.pursuitNat1Case = world[i].totCase;
                                this.pursuitNat1Death = world[i].totDeath;
                                targets = [targetNation2];
                                isFoundYet1 = false;
                                this.isPursuitNat1InWorld = true;

                            } else if (worldRef[i].nation == targetNation2){
                                this.pursuitNat2Case = world[i].totCase;
                                this.pursuitNat2Death = world[i].totDeath;
                                targets = [targetNation1];
                                isFoundYet2 = false;
                                this.isPursuitNat2InWorld = true;
                            }
                        }
                    }

                }

                if(this.isPursuitNat1InWorld){
                    caseNext1 = this.pursuitNat1Case[worldIdx] + (this.pursuitNat1Case[worldIdx + 1] - this.pursuitNat1Case[worldIdx]) * diff;
                    deathNext1 = this.pursuitNat1Death[worldIdx] + (this.pursuitNat1Death[worldIdx + 1] - this.pursuitNat1Death[worldIdx]) * diff;
                } else {
                    caseNext1 = this.pursuitNat1Case[chnIdx] + (this.pursuitNat1Case[chnIdx + 1] - this.pursuitNat1Case[chnIdx]) * diff;
                    deathNext1 = this.pursuitNat1Death[chnIdx] + (this.pursuitNat1Death[chnIdx + 1] - this.pursuitNat1Death[chnIdx]) * diff;
                }

                if(this.isPursuitNat2InWorld){
                    caseNext2 = this.pursuitNat2Case[worldIdx] + (this.pursuitNat2Case[worldIdx + 1] - this.pursuitNat2Case[worldIdx]) * diff;
                    deathNext2 = this.pursuitNat2Death[worldIdx] + (this.pursuitNat2Death[worldIdx + 1] - this.pursuitNat2Death[worldIdx]) * diff;
                } else {
                    caseNext2 = this.pursuitNat2Case[chnIdx] + (this.pursuitNat2Case[chnIdx + 1] - this.pursuitNat2Case[chnIdx]) * diff;
                    deathNext2 = this.pursuitNat2Death[chnIdx] + (this.pursuitNat2Death[chnIdx + 1] - this.pursuitNat2Death[chnIdx]) * diff;
                }

                if(caseNext1 >= caseNext2){
                    maxCordX = caseNext1;
                    minCordX = caseNext2;
                } else {
                    maxCordX = caseNext2;
                    minCordX = caseNext1;
                }

                if(deathNext1 >= deathNext2){
                    maxCordY = deathNext1;
                    minCordY = deathNext2;
                } else {
                    maxCordY = deathNext2;
                    minCordY = deathNext1;
                }

                if ( isPursuitChanged || ( (chnIdx % 5 == 0 && this.pursuitNat1[this.axisIdx] != "China" && this.pursuitNat2[this.axisIdx] != "China" ) && minCordX * 10 < maxX) ) this.isStucked = true; // 범위에 비해 너무 작아서 구석에 몰린 경우 조정 요구
                isPursuitChanged = false; // 방금 바꾼 국가에 대해 조정 필요한지 확인 후 해제

                // 축 이동이나 기본 설정으로 크기는 어느 정도 맞췄으므로, 경계선에 닿았을 경우만 조정

                if (!isRelocating){

                    if ( isOutOfRangeX(minCordX) || isOutOfRangeX(maxCordX) || isOutOfRangeY(minCordY) || isOutOfRangeY(maxCordY) || this.isStucked )  { // 추적 국가 변경시 현재 범위 밖에 있는 경우 조정함

                        minX = minCordX - (1 - this.pursuitPointX) * this.intervalMinX[this.axisIdx];
                        minX = minX < 0 ? 0 : minX;
                        minX = this.isStucked ? minX/2 : minX;
                        maxX = maxCordX * 2.5 - minX > this.intervalMinX[this.axisIdx] * 2 ? maxCordX * 1.5 : maxCordX * 2.5; // 간격이 좁으면 최대값을 크게, 간격 크면 최대값 작게
                        maxX = maxX > 2 ? maxX : 2;

                        minY = minCordY - (1 - this.pursuitPointY) * this.intervalMinY[this.axisIdx];
                        minY = minY < 0 ? 0 : minY;
                        minY = this.isStucked ? minY/2 : minY;
                        maxY = maxCordY * 2.5 - minY > this.intervalMinY[this.axisIdx] * 2 ? maxCordY * 1.5 : maxCordY * 2.5;
                        maxY = maxY > 2 ? maxY : 2;

                        if(this.isStucked) this.isStucked = false;

                    } else {

                        if( maxCordX > maxX * 0.9 ){ // 추적 국가가 범위 밖이라 범위 조정 필요시 or 추적 국가가 경계선 접근시 화면 재배치(확장) 요청
                    
                            let gap = (maxCordX - minCordX) * (1 - this.pursuitPointX) / (1 - 2 * (1 - this.pursuitPointX)); // 포인트를 중심으로 축 설정
                            minX = minCordX - gap;
                            maxX = maxCordX + gap;
                            minX = (maxX - minX) < this.intervalMinX[this.axisIdx] ? maxX - this.intervalMinX[this.axisIdx] : minX;
                            minX = minX < 0 ? 0 : minX;
                            isRelocating = true;
                        }

                        if( maxCordY > maxY * 0.9){
                        
                            let gap = (maxCordY - minCordY) * (1 - this.pursuitPointY) / (1 - 2 * (1 - this.pursuitPointY));
                            minY = minCordY - gap;
                            maxY = maxCordY + gap;
                            minY = (maxY - minY) < this.intervalMinY[this.axisIdx] ? maxY - this.intervalMinY[this.axisIdx] : minY;
                            minY = minY < 0 ? 0 : minY;
                            isRelocating = true;
                        }
                    }

                } else {

                    if(relocationCount % 2 == 0){
                        // min도 설정?
                        if (maxX < 80000){
                            maxX *= 1.05;
                            minX *= 1.05;
                        } else {
                            maxX *= 1.02;
                            minX *= 1.02;
                        }
                        maxY *= 1.05;
                        minY *= 1.05;
                    }
                }
                
                

            } else if(this.pursuitNat1[this.axisIdx]){ // 1개 국가 추적
                
                if( count == 0 || isPursuitChanged ){ // count 0일 때 추적국가 확진자, 사망자 찾아둠. 그 이외에는 찾은 배열로 계산만
                    targetNation1 = this.pursuitNat1[this.axisIdx];

                    for(let i=0; i < formerLength; i++){
                        if(formerRef[i].nation == targetNation1){
                            this.pursuitNat1Case = formerWorld[i].totCase;
                            this.pursuitNat1Death = formerWorld[i].totDeath;
                            isFoundYet1 = false;
                            this.isPursuitNat1InWorld = false;
                            break;
                        }
                    }
                    for(let i=0; isFoundYet1 && i < worldLength; i++){
                        if(worldRef[i].nation == targetNation1){
                            this.pursuitNat1Case = world[i].totCase;
                            this.pursuitNat1Death = world[i].totDeath;
                            targets = [targetNation2];
                            isFoundYet1 = false;
                            this.isPursuitNat1InWorld = true;
                            break;
                        } 
                    }
                }

                if(this.isPursuitNat1InWorld){
                    maxCordX = this.pursuitNat1Case[worldIdx] + (this.pursuitNat1Case[worldIdx + 1] - this.pursuitNat1Case[worldIdx]) * diff;
                    maxCordY = this.pursuitNat1Death[worldIdx] + (this.pursuitNat1Death[worldIdx + 1] - this.pursuitNat1Death[worldIdx]) * diff;
                } else {
                    maxCordX = this.pursuitNat1Case[chnIdx] + (this.pursuitNat1Case[chnIdx + 1] - this.pursuitNat1Case[chnIdx]) * diff;
                    maxCordY = this.pursuitNat1Death[chnIdx] + (this.pursuitNat1Death[chnIdx + 1] - this.pursuitNat1Death[chnIdx]) * diff;
                }

                if ( isPursuitChanged || ( (chnIdx % 5 == 0 && this.pursuitNat1[this.axisIdx] != "China") && maxCordX * 10 < maxX) ) this.isStucked = true; // 범위에 비해 너무 작아서 구석에 몰린 경우 조정 요구
                isPursuitChanged = false; // 방금 바꾼 국가에 대해 조정 필요한지 확인 후 해제

                // 축 이동이나 기본 설정으로 크기는 어느 정도 맞췄으므로, 경계선에 닿았을 경우만 조정

                if (!isRelocating){

                    if ( isOutOfRangeX(maxCordX) || isOutOfRangeY(maxCordY) || this.isStucked ) { // 추적 국가 변경시 현재 범위 밖에 있는 경우 조정함

                        minX = maxCordX - (1 - this.pursuitPointX) * this.intervalMinX[this.axisIdx];
                        minX = minX < 0 ? 0 : minX;
                        maxX = maxCordX < 20000 ? maxCordX * 2.5 : maxCordX * 1.5;
                        maxX = maxX > 2 ? maxX : 2;

                        minY = maxCordY - (1 - this.pursuitPointY) * this.intervalMinY[this.axisIdx];
                        minY = minY < 0 ? 0 : minY;
                        maxY = maxCordY < 20000 ? maxCordY * 2.5 : maxCordY * 1.5;
                        maxY = maxY > 2 ? maxY : 2;

                        if(this.isStucked) this.isStucked = false;

                    } else {

                        if( maxCordX > maxX * 0.9 ){ // 추적 국가가 범위 밖이라 범위 조정 필요시 or 추적 국가가 경계선 접근시 화면 재배치(확장) 요청
                    
                            minX = (maxX - minX) < this.intervalMinX[this.axisIdx] ? maxX - this.intervalMinX[this.axisIdx] : minX; // 포인트를 중심으로 축 설정
                            minX = minX < 0 ? 0 : minX;
                            maxX = (maxCordX - minX) * ((1-this.pursuitPointX)/this.pursuitPointX) + maxCordX; // 비례식
                            isRelocating = true;
                        }

                        if( maxCordY > maxY * 0.9 ){
                        
                            minY = (maxY - minY) < this.intervalMinY[this.axisIdx] ? maxY - this.intervalMinY[this.axisIdx] : minY;
                            minY = minY < 0 ? 0 : minY;
                            maxY = (maxCordY - minY) * ((1-this.pursuitPointY)/this.pursuitPointY) + maxCordY; // 비례식
                            isRelocating = true;
                        }
                        
                    } 
                    
                } else {

                    if(relocationCount % 2 == 0){
                        if (maxX < 80000){
                            maxX *= 1.05;
                            minX *= 1.05;
                        } else {
                            maxX *= 1.02;
                            minX *= 1.02;
                        }
                        maxY *= 1.05;
                        minY *= 1.05;
                    }
                    
                }        

            } 

        }

            // draw the grid
            mainContext.beginPath();
            mainContext.strokeStyle = "blue";
            mainContext.lineWidth = 0.5;
            mainContext.setLineDash([5, 15]); // 점선 설정

            let gapX, gapY, intervalX, intervalY, startLineX, startLineY, normalized;
            gapX = maxX - minX;
            gapY = maxY - minY;

            switch(true){
                case gapX > 100000: // 100000보다 클 경우 100000 단위로 격자 그리기
                    if(minX % 100000 == 0) startLineX = minX;
                    else startLineX = minX - (minX % 100000) + 100000;
                    intervalX = 50000;
                    break;
                case gapX > 10000: // 10000보다 클 경우 10000 단위로 격자 그리기
                    if(minX % 10000 == 0) startLineX = minX;
                    else startLineX = minX - (minX % 10000) + 10000;
                    intervalX = 10000;
                    break;
                case gapX > 1000: // 1000보다 클 경우 1000 단위로 격자 그리기
                    if(minX % 1000 == 0) startLineX = minX;
                    else startLineX = minX - (minX % 1000) + 1000;
                    intervalX = 1000;
                    break;
                case gapX > 300: // 300보다 클 경우 100 단위로 격자 그리기
                    if(minX % 100 == 0) startLineX = minX;
                    else startLineX = minX - (minX % 100) + 100;
                    intervalX = 100;
                    break;
                case gapX > 50: // 50보다 클 경우 50 단위로 격자 그리기
                    if(minX % 50 == 0) startLineX = minX;
                    else if(minX % 100 < 50){
                        startLineX = minX - (minX % 100) + 50;

                    } else{ // 나머지가 50보다 큰 경우
                        startLineX = minX - (minX % 100) + 100;
                    }
                    intervalX = 50;
                    break;
                case gapX > 10: // 10보다 클 경우 10 단위로 격자 그리기
                    if(minX % 10 == 0) startLineX = minX;
                    else startLineX = minX - (minX % 10) + 10;
                    intervalX = 10;
                    break;
                default: // 10보다 작을 경우 5 단위로 격자 그리기
                    if(minX % 5 == 0) startLineX = minX;
                    else if(minX < 0) startLineX = 0; // 0부터 시작할 수 있도록
                    else startLineX = minX - (minX % 5) + 5;
                    intervalX = 5;
                    break;
            }

            switch(true){
                case gapY > 10000: // 10000보다 클 경우 10000 단위로 격자 그리기
                    if(minY % 10000 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 10000) + 10000;
                    intervalY = 10000;
                    break;
                case gapY > 1000: // 1000보다 클 경우 1000 단위로 격자 그리기
                    if(minY % 1000 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 1000) + 1000;
                    intervalY = 1000;
                    break;
                case gapY > 600: // 600보다 클 경우 200 단위로 격자 그리기
                    if(minY % 200 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 200) + 200;
                    intervalY = 200;
                    break;
                case gapY > 300: // 300보다 클 경우 100 단위로 격자 그리기
                    if(minY % 100 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 100) + 100;
                    intervalY = 100;
                    break;
                case gapY > 100: // 100보다 클 경우 50 단위로 격자 그리기
                    if(minY % 50 == 0) startLineY = minY;
                    else if(minY % 100 < 50){
                        startLineY = minY - (minY % 100) + 50;

                    } else{ // 나머지가 50보다 큰 경우
                        startLineY = minY - (minY % 100) + 100;
                    }
                    intervalY = 50;
                    break;
                case gapY > 40: // 40보다 클 경우 20 단위로 격자 그리기
                    if(minY % 20 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 20) + 20;
                    intervalY = 20;
                    break;
                case gapY > 10: // 10보다 클 경우 10 단위로 격자 그리기
                    if(minY % 10 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 10) + 10;
                    intervalY = 10;
                    break;
                case gapY > 5: // 5보다 클 경우 5 단위로 격자 그리기
                    if(minY % 5 == 0) startLineY = minY;
                    else startLineY = minY - (minY % 5) + 5;
                    intervalY = 5;
                    break;
                default: // 5보다 작을 경우 1 단위로 격자 그리기
                    if(minY % 1 == 0) startLineY = minY;
                    else if(minY < 0) startLineY = 0; // 0부터 시작할 수 있도록
                    else startLineY = minY - (minY % 1) + 1;
                    intervalY = 1;
                    break;
            }

            mainContext.font =  "0.8rem Trebuchet MS";
            mainContext.fillStyle = "black";
            mainContext.textBaseline = "bottom";

            for(var i = startLineX; i <= maxX; i+=intervalX){
                normalized = (i-minX) / (maxX-minX) * chrtWidth;
                mainContext.moveTo(normalized,0);
                mainContext.lineTo(normalized, chrtHeight);
                mainContext.fillText(i, normalized, chrtHeight);
            }

            mainContext.fillStyle = "tomato";
            mainContext.textAlign = "left";
            mainContext.textBaseline = "bottom";

            for(var i = startLineY; i <= maxY; i+=intervalY){
                normalized = chrtHeight - (i-minY) / (maxY-minY) * chrtHeight;
                mainContext.fillText(i, 0, normalized);
                mainContext.moveTo(0, normalized);
                mainContext.lineTo(chrtWidth, normalized);
            }
            mainContext.stroke();
        
    }
};

function addNations() {

    let nationsLength = formerNations.length;
    for(let i=0; i<nationsLength ; i+=1 ){
        let addNation = {};
        addNation.nation = formerNations[i][0];
        addNation.idx = formerNations[i][1];
        addNation.img = [];
        for(let j=0; j<4; j++){
            addNation.img[j] = new Image();
            addNation.img[j].src = "img/flag/" + addNation.nation + "_" + j + ".png";
        }
        addNation.signal = 0;
        addNation.name = dict[addNation.nation];
        formerWorld[i] = addNation;
    }

    nationsLength = nations.length;
    for(let i=0; i<nationsLength ; i+=1 ){
         let addNation = {};
         addNation.nation = nations[i][0];
         addNation.idx = nations[i][1];
         addNation.img = [];
         for(let j=0; j<4; j++){
             addNation.img[j] = new Image();
             addNation.img[j].src = "img/flag/" + addNation.nation + "_" + j + ".png";
         }
         addNation.signal = 0;
         addNation.name = dict[addNation.nation];
         world[i] = addNation;
     }
     
};

function setSignal(){
    let arrLength = world.length;
    let status;
    for(let i=0; chnIdx > 25 && i<arrLength; i++){
        status = world[i].totCase[worldIdx + 1] - world[i].totCase[worldIdx];
        switch(true) {
            case status < 10:
                world[i].signal = 0;
                break;
            case status < 100:
                world[i].signal = 1;
                break;
            case status < 1000:
                world[i].signal = 2;
                break;
            default:
                world[i].signal = 3;
                break;
        }
    }

    arrLength = formerWorld.length;
    for(let i=0; i<arrLength; i++){
        status = formerWorld[i].totCase[chnIdx + 1] - formerWorld[i].totCase[chnIdx];
        switch(true) {
            case status < 10:
                formerWorld[i].signal = 0;
                break;
            case status < 100:
                formerWorld[i].signal = 1;
                break;
            case status < 1000:
                formerWorld[i].signal = 2;
                break;
            default:
                formerWorld[i].signal = 3;
                break;
        }
    }
};

function drawMinimap(){ // count 0마다 실행
    let worldLength = formerWorld.length;
    let mapWidth = miniWidth;
    let mapHeight = miniHeight;
    let gapX = maxX - minX;
    let gapY = maxY - minY;
    let axis = axisSettings;
    let pursuit1 = axis.pursuitNat1[axis.axisIdx];
    let pursuit2 = axis.pursuitNat2[axis.axisIdx];

    let maxCase = axis.screenLimitX[axis.axisIdx];
    let maxDeath = axis.screenLimitY[axis.axisIdx];

    let pursuit1Idx = -1;
    let pursuit2Idx = -1;
    
    let cases, deaths, cordX, cordY, realCordX, realCordY, screenMinX, screenMaxX, screenMinY, screenMaxY, isPursuit1InWorld, isPursuit2InWorld, squareX, squareY, squareW, squareH;

    if (chnIdx > 25) { // 2월 15일 이전 이후 다르게
        screenMinX = minX - gapX * 2; // screenM : 미니맵 캔버스의 확진자, 사망자 값들 // 이 안에 min max 값으로 현재 화면 사각형 그림
        screenMinY = minY - gapY * 2;
        screenMaxX = maxX + gapX * 2;
        screenMaxY = maxY + gapY * 2;
        
        if (screenMinX < 0) {
            screenMinX = 0;
            screenMaxX += gapX * 3;
            screenMaxX = screenMaxX > 2 ? screenMaxX : 2;

        } else if (screenMaxX > maxCase) {
            screenMinX -= gapX * 3;
            screenMaxX = maxCase;  
        }

        if (screenMinY < 0) {
            screenMinY = 0;
            screenMaxY += gapY * 3;
            screenMaxY = screenMaxY > 2 ? screenMaxY : 2;

        } else if (screenMaxY > maxDeath) {
            screenMinY -= gapY * 3;
            screenMaxY = maxDeath;  
        }

    } else {
        screenMinX = 0;
        screenMinY = 0;
        screenMaxX = maxCase;
        screenMaxY = maxDeath;
    }

    if (arguments.length == 2) { // 미니맵을 클릭해서 화면 전환하는 경우

        let startX = parseInt(arguments[0]);
        let startY = parseInt(arguments[1]);

        // 마우스 좌표를 통해 min max 계산하면 밑에서 screen과 square 계산됨

        gapX = axis.intervalMinX[axis.axisIdx]; // 스크린 크기는 디폴트 max - min 값으로 고정
        gapY = axis.intervalMinY[axis.axisIdx]; // gap 크기가 커진 상태에서 화면 전환시 최대-최소치를 벗어나거나 잘 안 잡힐 수 있기 때문

        let cordMinX = startX - (gapX / 2) / (screenMaxX - screenMinX) * mapWidth;  
        let tempMinX = cordMinX / mapWidth * (screenMaxX - screenMinX) + screenMinX; // 좌표에서 구한 확진자의 크기를 screenMinX에 더하여 minX를 구함

        if (tempMinX < 0) {
            minX = 0;
            maxX = gapX;
            maxX = maxX > 2 ? maxX : 2;

        } else {
            minX = tempMinX;
            maxX = tempMinX + gapX;
            maxX = maxX > 2 ? maxX : 2;
        }
        
        if (maxX > maxCase){
            maxX = maxCase;
            minX = maxCase - gapX;
        }
        
        let cordMaxY = startY - (gapY / 2) / (screenMaxX - screenMinX) * mapHeight;
        let tempMaxY = screenMaxY - cordMaxY / mapHeight * (screenMaxY - screenMinY); // 좌표에서 구한 사망자의 크기를 screenMaxY에 빼어 maxY를 구함
        
        
        if (tempMaxY > maxDeath){
            maxY = maxDeath;
            minY = maxDeath - gapY;
        } else {
            maxY = tempMaxY;
            minY = tempMaxY - gapY;
            maxY = maxY > 2 ? maxY : 2;
        }
        
        if (minY < 0){
            minY = 0
            maxY = gapY;
            maxY = maxY > 2 ? maxY : 2;
        }

        // axisSettings의 추적국과 default, interval min max값 무효화해야 고정됨
        // default min max, interval min max는 건드리지 않고, isDefaultScreen 속성으로 화면 이동 방지
        // interval min max 값은 미니맵 클릭할 때 사용하므로 변경하지 말아야
        
        axis.pursuitNat1 = emptyCountries.slice(0);
        axis.pursuitNat2 = emptyCountries.slice(0);
        axis.isDefaultScreen = false;
        
        
        if (chnIdx > 25) { // min max로부터 screen 구하는 구간만 재실행
            gapX = maxX - minX;
            gapY = maxY - minY;
            screenMinX = minX - gapX * 2;
            screenMinY = minY - gapY * 2;
            screenMaxX = maxX + gapX * 2;
            screenMaxY = maxY + gapY * 2;
            
            if (screenMinX < 0) {
                screenMinX = 0;
                screenMaxX += gapX * 3;
                screenMaxX = screenMaxX > 2 ? screenMaxX : 2;

            } else if (screenMaxX > maxCase) {
                screenMinX -= gapX * 3;
                screenMaxX = maxCase;  
            }
    
            if (screenMinY < 0) {
                screenMinY = 0;
                screenMaxY += gapY * 3;
                screenMaxY = screenMaxY > 2 ? screenMaxY : 2;

            } else if (screenMaxY > maxDeath) {
                screenMinY -= gapY * 3;
                screenMaxY = maxDeath;
            }
        }

    } else if (arguments.length == 4){ // 미니맵을 드래그하는 경우

        let startX = parseInt(arguments[0]); // 마우스 좌표를 통해 min max 계산하면 밑에서 screen과 square 계산됨
        let startY = parseInt(arguments[1]);
        let endX = parseInt(arguments[2]);
        let endY = parseInt(arguments[3]);

        let tempMinX = startX / mapWidth * (screenMaxX - screenMinX) + screenMinX; // 좌표에서 구한 확진자의 크기를 screenMinX에 더하여 minX를 구함
        let tempMaxX = endX / mapWidth * (screenMaxX - screenMinX) + screenMinX; // 클릭과 달리 처음과 마지막에 찍는 곳이 모서리

        let tempMaxY = screenMaxY - startY / mapHeight * (screenMaxY - screenMinY); // 좌표에서 구한 사망자의 크기를 screenMaxY에 빼어 maxY를 구함
        let tempMinY = screenMaxY - endY / mapHeight * (screenMaxY - screenMinY);

        gapX = tempMaxX - tempMinX;
        gapY = tempMaxY - tempMinY;

        if (tempMinX < 0) {
            minX = 0;
            maxX = gapX;
            maxX = maxX > 2 ? maxX : 2;

        } else if (tempMaxX > maxCase){
            maxX = maxCase;
            minX = maxCase - gapX;

        } else {
            minX = tempMinX;
            maxX = tempMaxX;
            maxX = maxX > 2 ? maxX : 2;
        }

        if (tempMaxY > maxDeath){
            maxY = maxDeath;
            minY = maxDeath - gapY;

        } else if (tempMinY < 0){
            minY = 0
            maxY = gapY;
            maxY = maxY > 2 ? maxY : 2;

        } else {
            maxY = tempMaxY;
            minY = tempMinY;
            maxY = maxY > 2 ? maxY : 2;
        }

        // axisSettings의 추적국과 default, interval min max값 무효화해야 고정됨
        // default min max, interval min max는 건드리지 않고, isDefaultScreen 속성으로 화면 이동 방지
        // interval min max 값은 미니맵 클릭할 때 사용하므로 변경하지 말아야
        
        axis.pursuitNat1 = emptyCountries.slice(0);
        axis.pursuitNat2 = emptyCountries.slice(0);
        axis.isDefaultScreen = false;

        if (chnIdx > 25) { // min max로부터 screen 구하는 구간만 재실행
            gapX = maxX - minX;
            gapY = maxY - minY;
            screenMinX = minX - gapX * 2;
            screenMinY = minY - gapY * 2;
            screenMaxX = maxX + gapX * 2;
            screenMaxY = maxY + gapY * 2;
            
            if (screenMinX < 0) {
                screenMinX = 0;
                screenMaxX += gapX * 3;
                screenMaxX = screenMaxX > 2 ? screenMaxX : 2;

            } else if (screenMaxX > maxCase) {
                screenMinX -= gapX * 3;
                screenMaxX = maxCase;  
            }
    
            if (screenMinY < 0) {
                screenMinY = 0;
                screenMaxY += gapY * 3;
                screenMaxY = screenMaxY > 2 ? screenMaxY : 2;

            } else if (screenMaxY > maxDeath) {
                screenMinY -= gapY * 3;
                screenMaxY = maxDeath;  
            }
        }
    }

    squareX = (minX - screenMinX)/(screenMaxX - screenMinX) * mapWidth;
    squareX = squareX < 0 ? 0 : squareX;

    squareY = (maxY - screenMinY)/(screenMaxY - screenMinY);
    squareY = squareY > 1 ? 0 : mapHeight - squareY * mapHeight;

    squareW = (maxX  - minX)/(screenMaxX - screenMinX) * mapWidth;
    squareW = squareX + squareW > mapWidth ? mapWidth - squareX : squareW;

    squareH = (maxY - minY)/(screenMaxY - screenMinY) * mapHeight;
    squareH = squareY + squareH > mapHeight ? mapHeight - squareY : squareH;


    miniContext.clearRect(0, 0, mapWidth, mapHeight);
    miniContext.beginPath();

    miniContext.lineWidth = 3;
    miniContext.strokeStyle = "black";
    miniContext.strokeRect(squareX, squareY, squareW, squareH);
    
    for(let i = 0; i < worldLength; i++) {

        if (formerWorld[i].nation == pursuit1) { // 빨간 점을 나중에 그려서 묻히지 않게 하기
            pursuit1Idx = i;
            isPursuit1InWorld = false;
            continue;
        }
        else if (formerWorld[i].nation == pursuit2) {
            pursuit2Idx = i;
            isPursuit2InWorld = false;
            continue;
        }

        cases = formerWorld[i].totCase[chnIdx];
        deaths = formerWorld[i].totDeath[chnIdx];

        if (cases < screenMinX || screenMaxX < cases) continue;
        if (deaths < screenMinY || screenMaxY < deaths) continue;

        // cases와 deaths를 해당 순간의 최소값-최대값 이내로 정규화한 값으로 바꿈
        // y축은 위에서부터 세므로, chartHeight에서 뺀다
        // size는 확진자 값을 정규화한 값을 조절
        // 숫자가 생각보다 내려왔으므로 fillText의 realCordY에 일정 값을 뺌
        cordX = (cases - screenMinX) / (screenMaxX - screenMinX);
        cordY = (deaths - screenMinY) / (screenMaxY - screenMinY);
        
        realCordX = cordX * mapWidth;
        realCordY = mapHeight - cordY * mapHeight;

        miniContext.arc(realCordX, realCordY, 3, 0, Math.PI * 2, false);
        //miniContext.closePath();
        
        miniContext.fillStyle = "blue";
        miniContext.fill();

        miniContext.beginPath();

    }
    
    if(chnIdx > 25) { // 2월 15일 이후부터 시작
        worldLength = world.length;
        for(let i = 0; i < worldLength; i++) {

            if (world[i].nation == pursuit1) { // 빨간 점을 나중에 그려서 묻히지 않게 하기
                pursuit1Idx = i;
                isPursuit1InWorld = true;
                continue;
            }
            else if (world[i].nation == pursuit2) {
                pursuit2Idx = i;
                isPursuit2InWorld = true;
                continue;
            }
            
            cases = world[i].totCase[worldIdx];
            deaths = world[i].totDeath[worldIdx];

            if (cases < screenMinX || screenMaxX < cases) continue;
            if (deaths < screenMinY || screenMaxY < deaths) continue;

            // cases와 deaths를 해당 순간의 최소값-최대값 이내로 정규화한 값으로 바꿈
            // y축은 위에서부터 세므로, chartHeight에서 뺀다
            // size는 확진자 값을 정규화한 값을 조절
            // 숫자가 생각보다 내려왔으므로 fillText의 realCordY에 일정 값을 뺌
            cordX = (cases - screenMinX) / (screenMaxX - screenMinX);
            cordY = (deaths - screenMinY) / (screenMaxY - screenMinY);
            
            realCordX = cordX * mapWidth;
            realCordY = mapHeight - cordY * mapHeight;

            miniContext.arc(realCordX, realCordY, 3, 0, Math.PI * 2, false);
            //miniContext.closePath();

            miniContext.fillStyle = "blue";
            miniContext.fill();

            miniContext.beginPath();

        }
    }

    // 추적 국가는 파란 점에 가리지 않게 마지막에 그리기

    if (pursuit1Idx >= 0){
        if (isPursuit1InWorld) {
            cases = world[pursuit1Idx].totCase[worldIdx];
            deaths = world[pursuit1Idx].totDeath[worldIdx];

            cordX = (cases - screenMinX) / (screenMaxX - screenMinX);
            cordY = (deaths - screenMinY) / (screenMaxY - screenMinY);
            
            realCordX = cordX * mapWidth;
            realCordY = mapHeight - cordY * mapHeight;

            miniContext.arc(realCordX, realCordY, 3, 0, Math.PI * 2, false);
            //miniContext.closePath();

            miniContext.fillStyle = "red";
            miniContext.fill();

            miniContext.beginPath();

        } else {
            cases = formerWorld[pursuit1Idx].totCase[chnIdx];
            deaths = formerWorld[pursuit1Idx].totDeath[chnIdx];

            cordX = (cases - screenMinX) / (screenMaxX - screenMinX);
            cordY = (deaths - screenMinY) / (screenMaxY - screenMinY);
            
            realCordX = cordX * mapWidth;
            realCordY = mapHeight - cordY * mapHeight;

            miniContext.arc(realCordX, realCordY, 3, 0, Math.PI * 2, false);

            miniContext.fillStyle = "red";
            miniContext.fill();

            miniContext.beginPath();
        }
    }

    if (pursuit2Idx >= 0){
        if (isPursuit2InWorld) {
            cases = world[pursuit2Idx].totCase[worldIdx];
            deaths = world[pursuit2Idx].totDeath[worldIdx];

            cordX = (cases - screenMinX) / (screenMaxX - screenMinX);
            cordY = (deaths - screenMinY) / (screenMaxY - screenMinY);
            
            realCordX = cordX * mapWidth;
            realCordY = mapHeight - cordY * mapHeight;

            miniContext.arc(realCordX, realCordY, 3, 0, Math.PI * 2, false);

            miniContext.fillStyle = "red";
            miniContext.fill();

            miniContext.beginPath();

        } else {
            cases = formerWorld[pursuit2Idx].totCase[chnIdx];
            deaths = formerWorld[pursuit2Idx].totDeath[chnIdx];

            cordX = (cases - screenMinX) / (screenMaxX - screenMinX);
            cordY = (deaths - screenMinY) / (screenMaxY - screenMinY);
            
            realCordX = cordX * mapWidth;
            realCordY = mapHeight - cordY * mapHeight;

            miniContext.arc(realCordX, realCordY, 3, 0, Math.PI * 2, false);
            //miniContext.closePath();

            miniContext.fillStyle = "red";
            miniContext.fill();

            miniContext.beginPath();
        }
    }

    miniContext.fillStyle = "black";
    miniContext.textAlign = "end";
    miniContext.textBaseline = "bottom";
    miniContext.font = "oblique 0.8rem Century Gothic";

    miniContext.fillText(Math.round(screenMinX) + "~" + Math.round(screenMaxX), miniWidth, miniHeight - 10);
    miniContext.textAlign = "start";
    miniContext.textBaseline = "top";
    miniContext.fillText(Math.round(screenMinY) + "~" + Math.round(screenMaxY), 10, 0);

    if (pursuit2) pursuitNats.textContent = dict[pursuit1] + ", " + dict[pursuit2] + " 추적 중";
    else if (pursuit1) pursuitNats.textContent = dict[pursuit1] + " 추적 중";
    else pursuitNats.textContent = "추적 중인 국가 없음";

};

function drawCircle() {

    mainContext.clearRect(0, 0, chartWidth, chartHeight);
    //mainContext.fillStyle = 'rgba(255, 255, 255, 0.4)';
    //mainContext.fillRect(0, 0, chartWidth, chartHeight); // 흘려그리기

    // 날짜 표시
    miniContext.fillStyle = "black";
    miniContext.textAlign = "end";
    miniContext.textBaseline = "top";
    miniContext.font = "initial 1rem Arial Black";
    if((count + 1) == speed) {
        let nextDay = new Date(startDateOfCHN.getTime() + 86400000 * (chnIdx + 1)); // 1000 * 60 * 60 * 24 == millisec per day // 날짜 바꾸는 순간 chnIdx는 아직 증가하지 않았으므로
        curDate = dateToString(nextDay); //다음 인덱스 그리는 순간 날짜 변하게 변경
    }
    miniContext.fillText(curDate, miniWidth, 0);

    mainContext.fillStyle = "#e6e6e6";
    mainContext.textAlign = "end";
    mainContext.textBaseline = "bottom";
    mainContext.font = "2rem Noto Sans KR";
    mainContext.fillText(curDate, chartWidth, chartHeight - 10);

    let axis = axisSettings;
    // draw the grid
    axis.drawAxis();

    // draw the circle
    mainContext.beginPath();
    
    let diff = count / speed;
    let worldLength = formerWorld.length;
    let pursuit1 = axis.pursuitNat1[axis.axisIdx];
    let pursuit2 = axis.pursuitNat2[axis.axisIdx];
    let cases, deaths, cordX, cordY, size, realCordX, realCordY, resizedImgWidth, resizedImgHeight, pursuit1Idx, pursuit2Idx;
    
    
    for(let i = 0; i < worldLength; i++) {
        
        if (formerWorld[i].nation == pursuit1){ // 추적 국가는 마지막에 그리기 위해 통과
            pursuit1Idx = i;
            continue;
        } else if (formerWorld[i].nation == pursuit2){
            pursuit2Idx = i;
            continue;
        }

        if (count < speed) {

            cases = formerWorld[i].totCase[chnIdx] + (formerWorld[i].totCase[chnIdx + 1] - formerWorld[i].totCase[chnIdx]) * diff;
            if ( cases < minX || maxX < cases ) continue; 

            deaths = formerWorld[i].totDeath[chnIdx] + (formerWorld[i].totDeath[chnIdx + 1] - formerWorld[i].totDeath[chnIdx]) * diff;
            if ( deaths < minY  || maxY < deaths ) continue;


        } else {
            cases = formerWorld[i].totCase[chnIdx+1];
            if ( cases < minX || maxX < cases ) continue;

            deaths = formerWorld[i].totDeath[chnIdx+1];
            if ( deaths < minY || maxY < deaths ) continue;

        }

        // cases와 deaths를 해당 순간의 최소값-최대값 이내로 정규화한 값으로 바꿈
        // y축은 위에서부터 세므로, chartHeight에서 뺀다
        // size는 확진자 값을 정규화한 값을 조절
        // 숫자가 생각보다 내려왔으므로 fillText의 realCordY에 일정 값을 뺌
        cordX = (cases - minX) / (maxX - minX);
        cordY = (deaths - minY) / (maxY - minY);
        if(isNaN(cordX)) cordX = 0.01;
        if(isNaN(cordY)) cordY = 0.01; // 발생 막 시작한 국가를 큰 화면으로 볼 때 사망자가 0인 경우, Y축 크기가 1이 안 되는 경우가 있음. 그 때 그리기 위해 숫자 지정
        size = ( (cordX + cordY) / 2 + 0.7) / 8;
        realCordX = cordX * chartWidth;
        realCordY = chartHeight - cordY * chartHeight;
        resizedImgWidth = imgWidth * size;
        resizedImgHeight = imgHeight * size;

        mainContext.drawImage(formerWorld[i].img[formerWorld[i].signal], realCordX - resizedImgWidth/2 , realCordY - resizedImgHeight/2 , resizedImgWidth, resizedImgHeight);
        mainContext.font =  "700 1rem Nanum Gothic";
        mainContext.fillStyle = "black";
        mainContext.textAlign = "center";
        mainContext.fillText(Math.floor(cases), realCordX, realCordY - resizedImgHeight/2 + 19);
        mainContext.fillStyle = "orange";
        mainContext.font =  "800 1rem Nanum Gothic";
        mainContext.fillText(formerWorld[i].name, realCordX, realCordY + 10);
        mainContext.fillStyle = "red";
        mainContext.font =  "700 1rem Nanum Gothic";
        mainContext.fillText(Math.floor(deaths), realCordX, realCordY + resizedImgHeight/2 - 2);

    }
    
    if(chnIdx > 25) { // 2월 15일 이후부터 시작

        worldLength = world.length;
        for(let i = 0; i < worldLength; i++) {

            if (world[i].nation == pursuit1){ // 추적 국가는 마지막에 그리기 위해 통과
                pursuit1Idx = i;
                continue;
            } else if (world[i].nation == pursuit2){
                pursuit2Idx = i;
                continue;
            }

            if (count < speed) {
                cases = world[i].totCase[worldIdx] + (world[i].totCase[worldIdx + 1] - world[i].totCase[worldIdx]) * diff;
                if ( cases < minX || maxX < cases ) continue; 

                deaths = world[i].totDeath[worldIdx] + (world[i].totDeath[worldIdx + 1] - world[i].totDeath[worldIdx]) * diff;
                if ( deaths < minY  || maxY < deaths ) continue;


            } else {
                cases = world[i].totCase[worldIdx+1];
                if ( cases < minX || maxX < cases ) continue;

                deaths = world[i].totDeath[worldIdx+1];
                if ( deaths < minY || maxY < deaths ) continue;

            }

            // cases와 deaths를 해당 순간의 최소값-최대값 이내로 정규화한 값으로 바꿈
            // y축은 위에서부터 세므로, chartHeight에서 뺀다
            // size는 확진자 값을 정규화한 값을 조절
            // 숫자가 생각보다 내려왔으므로 fillText의 realCordY에 일정 값을 뺌
            cordX = (cases - minX) / (maxX - minX);
            cordY = (deaths - minY) / (maxY - minY);
            if(isNaN(cordX)) cordX = 0.01;
            if(isNaN(cordY)) cordY = 0.01; // 발생 막 시작한 국가를 큰 화면으로 볼 때 사망자가 0인 경우, Y축 크기가 1이 안 되는 경우가 있음. 그 때 그리기 위해 숫자 지정
            size = ( (cordX + cordY) / 2 + 0.7) / 8; //( (cordX + cordY) / 2 + 0.5) / 10 * 2;
            realCordX = cordX * chartWidth;
            realCordY = chartHeight - cordY * chartHeight;
            resizedImgWidth = imgWidth * size;
            resizedImgHeight = imgHeight * size;

            mainContext.drawImage(world[i].img[world[i].signal], realCordX - resizedImgWidth/2 , realCordY - resizedImgHeight/2 , resizedImgWidth, resizedImgHeight);
            mainContext.font =  "700 1rem Nanum Gothic";
            mainContext.fillStyle = "black";
            mainContext.textAlign = "center";
            mainContext.fillText(Math.floor(cases), realCordX, realCordY - resizedImgHeight/2 + 19);
            mainContext.fillStyle = "orange";
            mainContext.font =  "800 1rem Nanum Gothic";
            mainContext.fillText(world[i].name, realCordX, realCordY + 10);
            mainContext.fillStyle = "red";
            mainContext.font =  "700 1rem Nanum Gothic";
            mainContext.fillText(Math.floor(deaths), realCordX, realCordY + resizedImgHeight/2 - 2);

        }
    }

    let pursuits = [];
    let formerPursuits = [];
    let idx;

    if (pursuit1) {
        if (axis.isPursuitNat1InWorld) pursuits.push(pursuit1Idx);
        else formerPursuits.push(pursuit1Idx);
    }

    if (pursuit2) {
        if (axis.isPursuitNat2InWorld) pursuits.push(pursuit2Idx);
        else formerPursuits.push(pursuit2Idx);
    }

    for(let i = 0; i < formerPursuits.length; i++) {

        idx = formerPursuits[i];

        if (count < speed) {

            cases = formerWorld[idx].totCase[chnIdx] + (formerWorld[idx].totCase[chnIdx + 1] - formerWorld[idx].totCase[chnIdx]) * diff;
            if ( cases < minX || maxX < cases ) continue; 

            deaths = formerWorld[idx].totDeath[chnIdx] + (formerWorld[idx].totDeath[chnIdx + 1] - formerWorld[idx].totDeath[chnIdx]) * diff;
            if ( deaths < minY  || maxY < deaths ) continue;


        } else {
            cases = formerWorld[idx].totCase[chnIdx+1];
            if ( cases < minX || maxX < cases ) continue;

            deaths = formerWorld[idx].totDeath[chnIdx+1];
            if ( deaths < minY || maxY < deaths ) continue;

        }

        // cases와 deaths를 해당 순간의 최소값-최대값 이내로 정규화한 값으로 바꿈
        // y축은 위에서부터 세므로, chartHeight에서 뺀다
        // size는 확진자 값을 정규화한 값을 조절
        // 숫자가 생각보다 내려왔으므로 fillText의 realCordY에 일정 값을 뺌
        cordX = (cases - minX) / (maxX - minX);
        cordY = (deaths - minY) / (maxY - minY);
        if(isNaN(cordX)) cordX = 0.01;
        if(isNaN(cordY)) cordY = 0.01; // 발생 막 시작한 국가를 큰 화면으로 볼 때 사망자가 0인 경우, Y축 크기가 1이 안 되는 경우가 있음. 그 때 그리기 위해 숫자 지정
        size = ( (cordX + cordY) / 2 + 0.7) / 8;
        realCordX = cordX * chartWidth;
        realCordY = chartHeight - cordY * chartHeight;
        resizedImgWidth = imgWidth * size;
        resizedImgHeight = imgHeight * size;

        mainContext.shadowOffsetX = 5;
        mainContext.shadowOffsetY = 5;
        mainContext.shadowBlur = 4;
        mainContext.shadowColor = "LightBlue";

        mainContext.drawImage(formerWorld[idx].img[formerWorld[idx].signal], realCordX - resizedImgWidth/2 , realCordY - resizedImgHeight/2 , resizedImgWidth, resizedImgHeight);
        
        mainContext.shadowOffsetX = 0;
        mainContext.shadowOffsetY = 0;
        mainContext.shadowBlur = 0;

        mainContext.font =  "700 1rem Nanum Gothic";
        mainContext.fillStyle = "black";
        mainContext.textAlign = "center";
        mainContext.fillText(Math.floor(cases), realCordX, realCordY - resizedImgHeight/2 + 19);

        mainContext.fillStyle = "orange";
        mainContext.font =  "800 1rem Nanum Gothic";
        mainContext.fillText(formerWorld[idx].name, realCordX, realCordY + 10);

        mainContext.fillStyle = "red";
        mainContext.font =  "700 1rem Nanum Gothic";
        mainContext.fillText(Math.floor(deaths), realCordX, realCordY + resizedImgHeight/2 - 2);

    }
    
    if(chnIdx > 25) { // 2월 15일 이후부터 시작

        for(let i = 0; i < pursuits.length; i++) {

            idx = pursuits[i];

            if (count < speed) {
                cases = world[idx].totCase[worldIdx] + (world[idx].totCase[worldIdx + 1] - world[idx].totCase[worldIdx]) * diff;
                if ( cases < minX || maxX < cases ) continue; 

                deaths = world[idx].totDeath[worldIdx] + (world[idx].totDeath[worldIdx + 1] - world[idx].totDeath[worldIdx]) * diff;
                if ( deaths < minY  || maxY < deaths ) continue;


            } else {
                cases = world[idx].totCase[worldIdx+1];
                if ( cases < minX || maxX < cases ) continue;

                deaths = world[idx].totDeath[worldIdx+1];
                if ( deaths < minY || maxY < deaths ) continue;

            }

            // cases와 deaths를 해당 순간의 최소값-최대값 이내로 정규화한 값으로 바꿈
            // y축은 위에서부터 세므로, chartHeight에서 뺀다
            // size는 확진자 값을 정규화한 값을 조절
            // 숫자가 생각보다 내려왔으므로 fillText의 realCordY에 일정 값을 뺌
            cordX = (cases - minX) / (maxX - minX);
            cordY = (deaths - minY) / (maxY - minY);
            if(isNaN(cordX)) cordX = 0.01;
            if(isNaN(cordY)) cordY = 0.01; // 발생 막 시작한 국가를 큰 화면으로 볼 때 사망자가 0인 경우, Y축 크기가 1이 안 되는 경우가 있음. 그 때 그리기 위해 숫자 지정
            size = ( (cordX + cordY) / 2 + 0.7) / 8;
            realCordX = cordX * chartWidth;
            realCordY = chartHeight - cordY * chartHeight;
            resizedImgWidth = imgWidth * size;
            resizedImgHeight = imgHeight * size;

            mainContext.shadowOffsetX = 5;
            mainContext.shadowOffsetY = 5;
            mainContext.shadowBlur = 4;
            mainContext.shadowColor = "LightBlue";
            
            mainContext.drawImage(world[idx].img[world[idx].signal], realCordX - resizedImgWidth/2 , realCordY - resizedImgHeight/2 , resizedImgWidth, resizedImgHeight);

            mainContext.shadowOffsetX = 0;
            mainContext.shadowOffsetY = 0;
            mainContext.shadowBlur = 0;

            mainContext.font =  "700 1rem Nanum Gothic";
            mainContext.fillStyle = "black";
            mainContext.textAlign = "center";
            mainContext.fillText(Math.floor(cases), realCordX, realCordY - resizedImgHeight/2 + 19);

            mainContext.fillStyle = "orange";
            mainContext.font =  "800 1rem Nanum Gothic";
            mainContext.fillText(world[idx].name, realCordX, realCordY + 10);

            mainContext.fillStyle = "red";
            mainContext.font =  "700 1rem Nanum Gothic";
            mainContext.fillText(Math.floor(deaths), realCordX, realCordY + resizedImgHeight/2 - 2);

        }
    }

    if (count == 0) drawMinimap();
    
    if (isRelocating){

        if (relocationCount < 20){
            relocationCount++;
        } else {
            relocationCount = 0;
            isRelocating = false;
        }

    } else if (count < speed) {
        count++;
    } else {
        count = 0;
        chnIdx = (chnIdx != durationOfCHN) ? ++chnIdx : 0;
        worldIdx = (chnIdx > 26 && worldIdx != duration) ? ++worldIdx : 0; // 2월 16일부터 worldIdx 증가 시작
        setSignal();
        if ([12, 26, 0].includes(chnIdx)){ // 2월 1일, 2월 15일, 첫 날로 되돌아가는 순간 축 기본변수 변경
            if(chnIdx != 0) ++axis.axisIdx;
            else {
                axis.axisIdx = 0;
                curDate = dateToString(startDateOfCHN);
            }
            axis.initializeAxis();
        }
        if ([15, 30, 46, 61, 76, 91, 107].includes(worldIdx)){ // 3월 1일, 3월 16일, 4월 1일, 4월 16일, 5월 1일, 5월 16일, 6월 1일에 축 기본변수 변경
            ++axis.axisIdx;
            axis.initializeAxis();
        }
        addDropDown();
        //calendar.value = curDate; // 애니메이션에 1일 단위로 끊김 현상 발생
    }   

    anim = requestAnimationFrame(drawCircle);
}

$(document).ready(function () {
    $.getJSON(filePath, function (data) {
        $.each(data, function (prop, value) {
            let formers = formerCountries; // 2월 15일 이전 데이터 있는 국가들 참조
            let formersGap; // daysOfCHN - days //국가가 적어서 직접 작성. 나중엔 국가별로 날짜 받아와서 duration과 days 생성. 비워놓으면 값 넣어도 undefined, 일단 0으로 초기화 나중에 변경할 것
            if(prop == "index") {
                let valueLength = value.length;

                curDate = dateToString(startDateOfCHN); // 차트에 표시할 날짜. 중국 첫 날부터 시작이므로
                endDate = stringToDate(value[valueLength - 1][1]); // 마지막 항목의 날짜는 마지막 날짜가 옴
                duration = (endDate - startDate) / 86400000; // 밀리초를 일 단위로 환산  1000 * 60 * 60 * 24 == millisec per day
                days = duration + 1; // 데이터 날짜 수가 duration보다 1만큼 많으므로
                durationOfCHN = (endDate - startDateOfCHN) / 86400000;
                daysOfCHN = durationOfCHN + 1;
                formersGap = daysOfCHN - days;
                calendar.max = dateToString(endDate); // 달력 최대 날짜 설정
                
                for(let i=0; i<valueLength ; i+=days ){ // 국가가 일정 날짜 간격으로 있으므로 건너뜀
                    if(formers.includes(value[i][0])) {
                        if (value[i][2] == "North America") formerNations.push([value[i][0], i]);
                        i += formersGap;

                    } else {
                        if (value[i][2] == "North America") nations.push([value[i][0], i]);
                    }
                }
                addNations();
            }
            else if(prop == "data") {
                let worldLength = world.length;
                let totCase;
                let totDeath;
                for(let i = 0; i < worldLength ; i++){
                    let limit = duration + world[i].idx;
                    totCase = [];
                    totDeath = [];
                    for(let j = world[i].idx ; j <= limit ; j++){
                        totCase.push(parseInt(value[j][0]));
                        totDeath.push(parseInt(value[j][1]));
                    }
                    world[i].totCase = totCase;
                    world[i].totDeath = totDeath;
                }

                worldLength = formerWorld.length;
                for(let i = 0; i < worldLength ; i++){
                    let limit = durationOfCHN + formerWorld[i].idx;
                    totCase = [];
                    totDeath = [];
                    for(let j = formerWorld[i].idx ; j <= limit ; j++){
                        totCase.push(parseInt(value[j][0]));
                        totDeath.push(parseInt(value[j][1]));
                    }
                    formerWorld[i].totCase = totCase;
                    formerWorld[i].totDeath = totDeath;
                }
                
            }


        });

        // 그리기 전에 이미지 폭과 넓이 받아오기
        imgWidth = world[0].img[0].width * 0.8; 
        imgHeight = world[0].img[0].height * 0.8;
        // 신호등 색깔 설정
        setSignal();
        addDropDown();

        drawCircle(); // 애니메이션 실행

    });
});