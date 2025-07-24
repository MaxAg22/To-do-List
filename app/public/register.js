import { API_URL } from './apiConfig.js';
const errorMessage = document.getElementsByClassName("error")[0];
const existsErrorMessage = document.getElementsByClassName("existsError")[0];
const passwordError = document.getElementsByClassName("passwordError")[0];
const missingFieldsError = document.getElementsByClassName("missingFieldsError")[0]



document.getElementById("register-form").addEventListener("submit",async(e)=>{
  e.preventDefault();

  if(!errorMessage.classList.contains("hide")) errorMessage.classList.toggle("hide");
  if(!existsErrorMessage.classList.contains("hide")) existsErrorMessage.classList.toggle("hide");
  if(!passwordError.classList.contains("hide")) passwordError.classList.toggle("hide");
  if(!missingFieldsError.classList.contains("hide")) missingFieldsError.classList.toggle("hide");

  const res = await fetch(`${API_URL}/api/register`,{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target.children.user.value,
      email: e.target.children.email.value,
      password: e.target.children.password.value,
      repeat_password: e.target.children.repeat_password.value
    })
  });

  const resJson = await res.json();
  if (resJson.status === 'error') {
    switch (resJson.errorType) {
      case 'EXISTS_ERROR':
        existsErrorMessage.classList.toggle("hide", false);
        break;
      case 'PASSWORD_ERROR':
        passwordError.classList.toggle("hide",false);
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