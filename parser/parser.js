const headers = {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
};
let pages = [];
let topic = null;
let hostName = null;
document.addEventListener("readystatechange", ready);

function ready() {
    topic = window.location.href.substring(window.location.href.lastIndexOf("topic/")).split("/")[1];
    fetch(`https://prodota.ru/forum/topic/${topic}/page/${1}/?csrfKey=101021491f271df3647abfa6dbdf1a43`, {
        headers,
        "referrer": "https://prodota.ru/forum/topic/222924/page/266/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => {
        return response.text();
    }).then((data) => {
        let dom = stringToHTML(data);
        hostName = dom.querySelectorAll(".cPost")[0].getElementsByClassName("defrelNickTopic")[0].innerText.trim().split("\n")[3];
    });
}

window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    } if (event.which == "17") {
        getBolds();
    }
});

function stringToHTML(str) {
    var dom = document.createElement('div');
    dom.innerHTML = str;
    return dom;
};

async function getPageContent(url, pdPage, endPage) {
    fetch(url, {
        headers,
        "referrer": "https://prodota.ru/forum/topic/222924/page/266/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => {
        return response.text();
    }).then((data) => {
        let dom = stringToHTML(data);
        pages.push([dom.querySelectorAll(".cPost"), Number(dom.querySelector(".ipsPagination_pageJump").querySelector("a").innerText.split(" ")[1])]);
        console.log(pages)
        pdPage++;
        if (pdPage - 1 < endPage) {
            getPageContent(`https://prodota.ru/forum/topic/${topic}/page/${pdPage}/?csrfKey=101021491f271df3647abfa6dbdf1a43`, pdPage, endPage)
        } else {
            setBolds()
        }
    });
}

function getBolds() {
    pages = [];
    let pdPage = Number(window.location.href.substring(window.location.href.lastIndexOf("page/")).split("/")[1]);
    pdPage = pdPage == 0 ? 1 : pdPage;
    let endPage = Number(document.querySelector(".ipsPagination_pageJump").querySelector("a").innerText.split(" ")[3]);
    getPageContent(`https://prodota.ru/forum/topic/${topic}/page/${pdPage}/?csrfKey=101021491f271df3647abfa6dbdf1a43`, pdPage, endPage)
}


function setBolds() {
    let posts = [];
    pages.forEach((page) => {
        for (let i = 0; i < page[0].length; i++) {
            let post = page[0][i];
            let nickname = post.getElementsByClassName("defrelNickTopic")[0].innerText;
            let itemsInPost = post.getElementsByClassName("ipsContained")[0].childNodes;
            itemsInPost.forEach((item) => {
                if (item.nodeName == "P") {
                    if (item.querySelector("strong") && nickname.trim().split("\n")[3] !== hostName) {
                        console.log(itemsInPost, item)
                        posts.push(`${nickname.trim().split("\n")[3]}: ` + item.querySelector("strong").innerHTML.replace(/&nbsp;/g, '') + `(${page[1]})`);
                    }
                }
            })
        }
    });
    console.log(posts)
}