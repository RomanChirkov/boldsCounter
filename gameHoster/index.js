// добавить кнопку сброса, выводить все роли игроков в отдельном поле, сбрасывать поля 

let playersArea;
let rolesArea;
let titleArea;
let discordArea;
let rndButton;
let resetButton;
let premiumCheckbox;
let konfs;
let csrfKey;
let finalPoolText;


document.addEventListener("readystatechange", function () {
    playersArea = document.querySelector("#players");
    rolesArea = document.querySelector("#roles");
    rndButton = document.querySelector('#random');
    resetButton = document.querySelector('#reset');
    titleArea = document.querySelector('#title');
    discordArea = document.querySelector('#discord');
    csrfKey = document.querySelector("#csrfKey");
    finalPoolText = document.querySelector("#finalPoolText")
    premiumCheckbox = document.querySelector("#premium");

    rndButton.addEventListener("click", createArrays);
    resetButton.addEventListener("click", reset);

    playersArea.addEventListener("keyup", (event) => {
        localStorage.setItem("playersArea", playersArea.value)
        checkAreas();
    });
    rolesArea.addEventListener("keyup", (event) => {
        localStorage.setItem("rolesArea", rolesArea.value)
        checkAreas();
    });
    titleArea.addEventListener("keyup", (event) => {
        localStorage.setItem("titleArea", titleArea.value)
        checkAreas();
    });
    discordArea.addEventListener("keyup", (event) => {
        localStorage.setItem("discordArea", discordArea.value)
        checkAreas();
    });
    csrfKey.addEventListener("keyup", (event) => {
        localStorage.setItem("csrfKey", csrfKey.value)
        checkAreas();
    });
    checkAreas();
    playersArea.value = localStorage.getItem("playersArea");
    rolesArea.value = localStorage.getItem("rolesArea");
    titleArea.value = localStorage.getItem("titleArea");
    discordArea.value = localStorage.getItem("discordArea");
    csrfKey.value = localStorage.getItem("csrfKey");
    finalPoolText.innerHTML = localStorage.getItem("finalPoolText");
});

let playersArr = [];
let rolesArr = [];
let finalPool = {};

function createArrays() {
    konfs = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    playersArr = [];
    rolesArr = [];
    finalPool = {};
    playersArr = playersArea.value.trim().split("\n");
    rolesArr = rolesArea.value.trim().split("\n");
    playersArr = playersArr.filter((x) => x !== "");
    for (let i = 0; i < playersArr.length; i++) {
        playersArr[i] = playersArr[i].trim().split("(")[0].trim();
    }
    for (let i = 0; i < playersArr.length; i++) {
        if (!rolesArr[i]) {
            rolesArr[i] = "мж"
        }
    }
    console.log(playersArr, rolesArr)
    randomRoles()
}

function randomRoles() {
    playersArr = shuffle(playersArr);
    rolesArr = shuffle(rolesArr);
    for (let i = 0; i < playersArr.length; i++) {
        finalPool[playersArr[i]] = rolesArr[i];
    }
    console.log(finalPool)
    finalPoolText.innerHTML = "";
    for (player in finalPool) {
        finalPoolText.innerHTML += `<p>${player}: ${finalPool[player]}</p>`;
    }
    localStorage.setItem("finalPoolText", finalPoolText.innerHTML);
    document.body.appendChild(finalPoolText);
    rndButton.disabled = true;
    setTimeout(() => { setKonfs(); }, 500);
}

function setKonfs() {
    for (player in finalPool) {
        let konfa = finalPool[player].split("#")[1];
        if (konfa) {
            konfs[konfa][player] = finalPool[player].split("#")[0];
            delete finalPool[player];
        }
    }
    sendRoles();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sendRoles() {
    let totalMessages = 0;
    let currentMessagesSent = 0;
    for (player in finalPool) {
        totalMessages++;
    }
    konfs.forEach((konfa) => {
        if (!isObjectEmpty(konfa)) {
            totalMessages++;
        }
    });
    csrfKey = csrfKey.value;
    for (player in finalPool) {
        let messageContent = `<p>Привет, твоя роль - <strong>${finalPool[player]}</strong></p>
                              <p>Дискорд ведущего - <strong>${discordArea.value}</strong></p>
                              <p>Удачной игры!</p>`;
        let messengerTo = `${player}`
        currentMessagesSent++;
        fetch("https://prodota.ru/forum/messenger/compose/", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://prodota.ru/forum/topic/222920/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `form_submitted=1&csrfKey=${csrfKey}&MAX_FILE_SIZE=2097152&plupload=272bcf3154038ad79a8dc6b3962ac4d5&messenger_to_original=&messenger_to=${messengerTo}&messenger_title=${titleArea.value}&messenger_content=${messageContent}&messenger_content_upload=8d04e5e8305e622bca761d3a0a8a85d8`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        console.log(`Sent ${currentMessagesSent} of ${totalMessages}`);
        if(currentMessagesSent == totalMessages){
            rndButton.disabled = false;
        }
        if (!premiumCheckbox.checked && currentMessagesSent !== totalMessages) {
            sleep(30000);
        }
    }
    konfs.forEach((konfa) => {
        if (!isObjectEmpty(konfa)) {
            let messageContent;
            let messengerTo = "";
            messageContent = `<p>Всем привет!</p>
                              <p>Конфа: </p>`;
            for (player in konfa) {
                messageContent += `<strong>${player} - ${konfa[player]}</strong><br>`;
                messengerTo += `${player}\r\n`
            }
            messageContent += `<p>Дискорд ведущего - <strong>${discordArea.value}</strong></p><p>Удачной игры!</p>`;
            fetch("https://prodota.ru/forum/messenger/compose/", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://prodota.ru/forum/topic/222920/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `form_submitted=1&csrfKey=${csrfKey}&MAX_FILE_SIZE=2097152&plupload=272bcf3154038ad79a8dc6b3962ac4d5&messenger_to_original=&messenger_to=${messengerTo}&messenger_title=${titleArea.value}&messenger_content=${messageContent}&messenger_content_upload=8d04e5e8305e622bca761d3a0a8a85d8`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            currentMessagesSent++;
            console.log(`Sent ${currentMessagesSent} of ${totalMessages}`);
            if(currentMessagesSent == totalMessages){
                rndButton.disabled = false;
            }
            if (!premiumCheckbox.checked && currentMessagesSent !== totalMessages) {
                sleep(30000);
            }
        }
    })
}

function reset() {
    localStorage.setItem("playersArea", "");
    localStorage.setItem("rolesArea", "");
    localStorage.setItem("titleArea", "");
    localStorage.setItem("discordArea", "");
    // localStorage.setItem("csrfKey", "");
    localStorage.setItem("finalPoolText", "");

    playersArea.value = localStorage.getItem("playersArea");
    rolesArea.value = localStorage.getItem("rolesArea");
    titleArea.value = localStorage.getItem("titleArea");
    discordArea.value = localStorage.getItem("discordArea");
    // csrfKey.value = localStorage.getItem("csrfKey");
    finalPoolText.innerHTML = localStorage.getItem("finalPoolText");
}

function checkAreas() {
    if (playersArea.value !== "" && rolesArea.value !== "" && titleArea.value !== "" && discordArea.value !== "" && csrfKey.value !== "") {
        rndButton.disabled = false;
    } else {
        rndButton.disabled = true;
    }
}

function isObjectEmpty(value) {
    return (
        Object.prototype.toString.call(value) === '[object Object]' && JSON.stringify(value) === '{}'
    );
}

function sleep(millis) {
    var t = (new Date()).getTime();
    var i = 0;
    while (((new Date()).getTime() - t) < millis) {
        i++;
    }
}