// document.addEventListener("readystatechange", getBolds());
window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }if(event.which == "17"){
        getBolds();
    }
  });


function getBolds(){
    // pdPage = window.location.href.substring(window.location.href.lastIndexOf("page/")).split("/")[1];
    // let topic = window.location.href.substring(window.location.href.lastIndexOf("topic/")).split("/")[1];
    let pages = [];
    // let newPage = null;
    let posts = {};
    // newPage = `https://prodota.ru/forum/topic/${topic}/page/${page}/`;
    // window.location.href = newPage;
    // for (let i = page; i < startPage; i++) {
        pages.push(document.getElementsByClassName("cPost"));
        // newPage = `https://prodota.ru/forum/topic/${topic}/page/${page}/`;
        // window.location.href = newPage;
    // }
    pages.forEach((page) => {
        for (let i = 0; i < page.length; i++) {
            let post = page[i];
            let nickname = post.getElementsByClassName("defrelNickTopic")[0].innerText;
            let itemsInPost = post.getElementsByClassName("ipsContained")[0].childNodes;
            itemsInPost.forEach((item) => {
                if(item.nodeName == "P"){
                    if(item.querySelector("strong")){
                        posts[nickname] = item.querySelector("strong").innerHTML + `(${window.location.href.substring(window.location.href.lastIndexOf("page/")).split("/")[1]})`;
                    }
                }
            })
        }
    });
    console.log(`pd_parser: page:${window.location.href.substring(window.location.href.lastIndexOf("page/")).split("/")[1]}`,posts)
}
