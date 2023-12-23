import { ShowAlert } from "./common.js";
class Login{
    constructor(userName, userId, passoword, captcha){
        this.userName = userName;
        this.userId = userId;
        this.passoword = passoword;
        this.captcha = captcha;
    }
    Register(fname,sname,decription){
        const apiUrl = "https://api.zerotwo.in/createac";
        const postData = {
            username: this.userName,
            password: this.passoword,
            captcha: this.captcha,
            userid: this.userId,
            fname: fname,
            sname: sname,
            description: decription
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        }
        fetch(apiUrl, options)
        .then(response => {
                return response.json();
        })
        .then(data => {
            if(!data.status){
                throw new Error(data.msg);
            }else{
                if(!data.verify){
                    alert("Click ok to open verification link on new tab");
                    window.open(data.url,"_blank");
                }
                ShowAlert(data.msg,"success",false);

            }
        })
        .catch(error => {
        ShowAlert(error,"danger");
        });
    }
}
export {Login};