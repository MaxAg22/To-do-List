import { API_URL } from './apiConfig.js';

const errorMessage = document.getElementsByClassName("error")[0];
const notVerifiedOrRegisteredError = document.getElementsByClassName("notVerifiedOrRegisteredError")[0];
const incorrectPasswordError = document.getElementsByClassName("incorrectPasswordError")[0];
const missingFieldsError = document.getElementsByClassName("missingFieldsError")[0]

document.getElementById("login-form").addEventListener("submit",async (e)=>{
  e.preventDefault();
  
  // si no contiene hide, lo oculto!
  if(!errorMessage.classList.contains("hide")) errorMessage.classList.toggle("hide");
  if(!notVerifiedOrRegisteredError.classList.contains("hide")) notVerifiedOrRegisteredError.classList.toggle("hide");
  if(!incorrectPasswordError.classList.contains("hide")) incorrectPasswordError.classList.toggle("hide");
  if(!missingFieldsError.classList.contains("hide")) missingFieldsError.classList.toggle("hide");

  const user = e.target.children.user.value;
  const password = e.target.children.password.value;
  const res = await fetch(`${API_URL}/api/login`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      user,password
    })
  });

  const resJson = await res.json();
  if (resJson.status === 'error') {
    switch (resJson.errorType) {
      case 'USER_NOT_VERIFIED_OR_NOT_REGISTERED':
        notVerifiedOrRegisteredError.classList.toggle("hide", false);
        break;
      case 'INCORRECT_PASSWORD':
        incorrectPasswordError.classList.toggle("hide",false);
        break;
      case 'MISSING_FIELDS':
        missingFieldsError.classList.toggle("hide", false);
        break;
      default:
        return errorMessage.classList.toggle("hide",false);
    }
  }
  
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})
