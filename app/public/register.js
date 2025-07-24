import { API_URL } from './apiConfig.js';
const errorMessage = document.getElementsByClassName("error")[0];
const existsErrorMessage = document.getElementsByClassName("existsError")[0];

document.getElementById("register-form").addEventListener("submit",async(e)=>{
  e.preventDefault();
  console.log(e.target.children.user.value)
  const res = await fetch(`${API_URL}/api/register`,{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target.children.user.value,
      email: e.target.children.email.value,
      password: e.target.children.password.value
    })
  });
  if(!res.ok) { 
    if(res.status === 400) return existsErrorMessage.classList.toggle("escondido",false);
    return errorMessage.classList.toggle("escondido",false);
  }
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})