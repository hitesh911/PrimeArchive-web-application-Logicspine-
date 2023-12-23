
// custom alert, toast, nitofication
const notificationContainer = document.querySelector(".notification-container");
const notification = document.querySelector(".notification");
const notificationMsg = document.querySelector("#alert-msg");
const notificationCloseBtn = document.querySelector("#alert-close");

// utility function 
function ShowAlert(msg,type,autoClose=true){
    notificationMsg.innerText= msg;
    notification.classList.add(type);
    notificationContainer.dataset.open = "true";
    if(autoClose){
      setTimeout(() => {
        notificationContainer.dataset.open = "false";
      }, 5000);
    }
}

notificationContainer.addEventListener("click",()=>{
notificationContainer.dataset.open = "false";
})

export {ShowAlert};

// handle mobile navbar 

const openBtn = document.querySelector(".nav-open-btn");
const closeBtn = document.querySelector(".nav-close-btn");
const navDiv = document.querySelector(".nav-div");

openBtn.addEventListener("click",(element)=>{
  // opening navigation bar 
  navDiv.classList.add("nav-mobile-open");
  // swapping between icons 
  element.currentTarget.style.display = "none";
  closeBtn.style.display = "block"
})
closeBtn.addEventListener("click",(element)=>{
  // opening navigation bar 
  navDiv.classList.remove("nav-mobile-open");
  // swapping between icons 
  element.currentTarget.style.display = "none";
  openBtn.style.display = "block"
})