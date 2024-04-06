let handleMemberJoined=async(MemberId)=>{
    console.log("A new member has joined the room",MemberId)
    addMemberToDom(MemberId)
    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let addMemberToDom= async (MemberId)=>{

    let {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])
    let membersWrapper = document.getElementById("member__list")
    let memberItem =`<div class="member__wrapper" id="member__${MemberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name"${name}</p>
    </div>`
    membersWrapper.insertAdjacentHTML("beforeend",memberItem)
}

let updateMemberTotal =async(members)=>{
    let total = document.getElementById("members__count")
    total.innerText = members.length 
}

let handleMemberLeft = async(MemberId)=>{
    removeMemberFromDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDom = async(MemberId)=>{
    let memberWrapper=document.getElementById(`member__${MemberId}__wrapper`)
    memberWrapper.remove()
}

let getMembers = async()=>{
    let members = await channel.getMembers()
    updateMemberTotal(members)

    for(let i=0;members.length>i;i++){
        addMemberToDom(members[i])
    }
}
let handleChannelMessage = async(messageData,MemberId)=>{
    console.log("A new message")
    let data =JSON.parse(messageData.text)
    console.log("Message",data)
}
let sendMessage = async(e)=>{
    e.preventDefault()

    let message =e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat','message':message,'displayName':displayName})})
    addMemberToDom(displayName,message)
    e.target.reset()
}

let addMessageToDom =(name,message)=>{
    let messagesWrapper = document.getElementById("message")

    let newMessge=`<div class="message__body">
    <strong class="message__author">${name}</strong>
    <p class="message__text">${message}</div></div>`

    messagesWrapper.insertAdjacentHTML("beforeend",newMessge)
}
let leavechannel = async()=>{
    await channel.leave()
    await rtmClient.logout() 
}
window.addEventListener("beforeunload",leavechannel)

let messageForm = document.getElementById("message__form")
messageForm.addEventListener("submit",sendMessage) // submit the message