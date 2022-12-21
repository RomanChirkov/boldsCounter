function init(day, playersCount) {
    const sheetId = '10qhSd8jdBXjbCd76ZXT-3GItrosg0dk2ce1hPKWe1MM';
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = 'user-data';
    const query = encodeURIComponent('Select *')
    const url = `${base}&sheet=${sheetName}&tq=${query}`
    const output = document.querySelector('.output')
    day = day * 2;
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(jsonData)
            let prevBolds = [];
            let finalBolds = [];
            let prevBoldsCount = {};
            let finalBoldsCount = {};
            let totalBoldsCount = [];
            output.innerHTML = null;
            for (let i = 0; i < jsonData.table.rows.length; i++) {
                console.log(jsonData.table.rows[i])
                prevBolds.push(jsonData.table.rows[i].c[day]?.v?.split("(")[0] || null)
                finalBolds.push(jsonData.table.rows[i].c[day + 1]?.v?.split("(")[0] || null)
            }
            for (let i = 0; i < prevBolds.length; i++) {
                const prev = prevBolds[i];
                const final = finalBolds[i]
                if(finalBolds[i] != null || prev !== null){
                    prevBoldsCount[prev] = 0;
                    finalBoldsCount[prev] = 0;
                }
            }
            for (let i = 0; i < prevBolds.length; i++) {
                const prev = prevBolds[i];
                const final = finalBolds[i]
                if(final == null && prev !== null){
                    prevBoldsCount[prev] += 1;
                }else if(final !== null && prev !== null){
                    finalBoldsCount[final] += 1;
                }
            }
            for (let prev in prevBoldsCount) {
                for(let final in finalBoldsCount){
                    if(final == prev){
                        if(prevBoldsCount[prev]+finalBoldsCount[final] > 0){
                            totalBoldsCount.push(`${prev}: ${finalBoldsCount[final]}+${prevBoldsCount[prev]}(${prevBoldsCount[prev]+finalBoldsCount[final]})`);
                        }
                    }
                }
            }
            totalBoldsCount.sort((a, b) => b.split("(")[1].split(")")[0] - a.split("(")[1].split(")")[0]) 
            for(let bold in totalBoldsCount){
               let tr = output.appendChild(document.createElement("tr"));
               let player = tr.appendChild(document.createElement("th"));
               player.innerText = totalBoldsCount[bold];
            }
            console.log(prevBolds, finalBolds)
            console.log(prevBoldsCount, finalBoldsCount)
            console.log(totalBoldsCount)

        })
}
 