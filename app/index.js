const TOKEN = "7259972759:AAHCMszHhRywqrCw6uGLzaaApmXUq_jB-Vw";
const CHAT_ID = "6163382681";
const SUBMIT_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
const ERROR_TIMEOUT = 1000;

const submit = document.getElementById("submit");
const formElement = document.getElementById("registration-form").elements;
const formBot = document.getElementById("registration-form");

const nameElement = document.getElementById("name");
const phoneElement = document.getElementById("phone");
const emailElement = document.getElementById("email");

const iti = window.intlTelInput(phoneElement, {
  utilsScript: "node_modules/intl-tel-input/build/js/utils.js",
  initialCountry: "ua",
  separateDialCode: true,
});

const COUNTRY_CODE = iti.getSelectedCountryData().dialCode;

submit.addEventListener("click", handleFormSubmit);
formBot.addEventListener("submit", sendData);

function showError(element) {
  element.classList.add("error");

  setTimeout(function () {
    element.classList.remove("error");
  }, ERROR_TIMEOUT);
}

function handleFormSubmit(e) {
  if (validate(e)) {
    sendData(e);

    formBot.reset();
    e.preventDefault();
  }
}

function validate(event) {
  event.preventDefault();

  const phoneCheck = /^\d+$/;
  const emailCheck = /.+@.+\..+/;
  const isPhoneValid = phoneElement.value.match(phoneCheck);
  const isEmaileValid = emailElement.value.match(emailCheck);
  let isValid = true;

  for (let element of formElement) {
    const isEmpty = !element.value;
    const isNotButton = element.type !== "button";
    const isNotSearch = !element.classList.contains("iti__search-input");

    if (isEmpty && isNotButton && isNotSearch) {
      showError(element);

      isValid = false;
    }
  }

  if (!isEmaileValid) {
    showError(emailElement);

    isValid = false;
  }

  if (!isPhoneValid) {
    showError(phoneElement);

    isValid = false;
  }

  return isValid;
}

function sendData(e) {
  e.preventDefault();

  const nameElement = document.getElementById("name").value;
  const emailElement = document.getElementById("email").value;
  const phoneElement = document.getElementById("phone").value;

  const TEXT = `Name: ${nameElement}\nEmail: ${emailElement}\nPhone: +${COUNTRY_CODE}${phoneElement}`;

  fetch(SUBMIT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: TEXT,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        alert("Message send successfully!");
      } else {
        alert("Error sending message!");
      }
    });
}
