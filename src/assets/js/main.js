const num =1;

function GetBoard(boardId/*:number*/){
    fetch(`${main_sever}board/${boardId}`,{
        method:"GET",
    })
    .then(res=>{
        return res.json();
    })
    .then(data=>{
       
            let boardParent/*:HTMLElement*/= document.getElementById("boardParent");
            let childboard/*:HTMLElement*/= document.createElement("div");

            boardParent?.appendChild(childboard);
            childboard.innerHTML=`
            <div id="oneBoardName" style="background-color:${data.data.backgroundColor};">${data.data.name}
            </div> 
            <div class="one_board" id="oneBoard">
            </div>
            `
            for(let i=0; i<data.data.columns.length;i++){
                let columnParent=document.getElementById("oneBoard");
                let columnCild =document.createElement("div");
                columnParent.appendChild(columnCild);
                columnCild.innerHTML=`
                <div class="one_column" id="${i}Column">${data.data.columns[i].name}</div>
                `
                
                data.data.columns[i].cards.map((el)=>{
                    let cardParent=document.getElementById(`${i}Column`);
                    let cardCild=document.createElement("div");
                    cardParent.appendChild(cardCild);
                    cardCild.innerHTML=`
                    <div onclick="cardModal(${el.id})" class="one_card" id="${el.id}Card" >${el.name} <br> 댓글:${el.comments.length}개</div>
                    `
                })

                let cardParent =document.getElementById(`${i}Column`);
                let addCardButton=document.createElement("div");
                cardParent.appendChild(addCardButton);
                addCardButton.innerHTML=`
                <div class="add_card_button" id="oneAddCardButton" style="text-align: left">+카드추가하기<div>
                `
            }
            
        

    })
    .catch((e=>{
        console.log(e);
    }))

    
}

function cardModal(cardId){
    fetch(`${main_sever}column/1/cards/${cardId}`,{
        method:"GET",
    })
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        console.log(data);
        document.querySelector(".modal-overlay").style.visibility="visible";
        document.querySelector(".modal-window").style.backgroundColor=`${data.color}`
        document.getElementById("modal-title").innerHTML=`${data.name}`
        document.getElementById("modal-column-list").innerHTML=`in list ${data.status}`
        document.getElementById("modal-content").innerHTML=`${data.describe}`
        document.getElementById("modal-deadline").innerHTML=`완료일:${data.deadline}`
        document.getElementById("modal-assignedUser").innerHTML=`할당된 유저:${data.assignedUserName}`
    })
}

GetBoard(num);

