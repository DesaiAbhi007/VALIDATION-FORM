let nameId = document.getElementById("nameId");
let emailId = document.getElementById("emailId");
let passwordId = document.getElementById("passwordId");
let maleId = document.getElementById("maleId");
let femaleId = document.getElementById("femaleId");
let saveId = document.getElementById("save");
let travelId = document.getElementById("travelId");
let sleepId = document.getElementById("sleepId");
let sportsId = document.getElementById("sportsId");
let formInnerId = document.getElementById("formInner");
let selectBuddy = document.getElementById("selectId");
let hobbyCheckBox = document.querySelectorAll('input[type="checkbox"][class="form-check-input checkBox"]');

// FOR ERROR
let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let radioError = document.getElementById("radioError");
let checkboxError = document.getElementById("checkboxError");
let selectError = document.getElementById("selectError");

// DATA
let personDataArray = JSON.parse(localStorage.getItem("userData")) || [];

const empty = (value, valErr, valErrMsg) => {
  if (value == "") {
    valErr.innerHTML = valErrMsg;
  } else {
    valErr.innerHTML = "";
  }
  return valErr;
};
const nameValidation = () => {
  let nameInputValue = nameId.value.trim(); 
  empty(nameInputValue, nameError, "Name should not be empty");
};
const emailValidation = () => {
  let emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/g;
  let emailInputValue = emailId.value.trim();
  if (emailInputValue === "") {
    emailError.innerHTML = "Email should not be empty";
  } else if (!emailRegex.test(emailInputValue)) {
    emailError.innerHTML = "Please enter a valid email";
  } else {
    emailError.innerHTML = "";
  }
};

const passwordValidation = () => {
  let passwordInputValue = passwordId.value.trim();
  empty(passwordInputValue, passwordError, "Password should not be empty");
};

const radioValidation = () => {
  let genderRadio = document.querySelectorAll('input[type="radio"][name="genderRadios"]:checked');
  let markedRadios = "";
  radioError.innerHTML = "";
  genderRadio.forEach((radio_gender) => {
    markedRadios = radio_gender.value;
  });
  if (markedRadios.length === 0) {
    radioError.innerHTML = "Please check your gender";
    return;
  }
  return markedRadios;
};

const checkBoxValidation = () => {
  let markedCheckboxes = [];
  checkboxError.innerHTML = "";
  hobbyCheckBox.forEach((check_box) => {
    if (check_box.checked) {
      markedCheckboxes.push(check_box.value);
    }
  });

  if (markedCheckboxes.length === 0) {
    checkboxError.innerHTML = "Please select at least one hobby";
    return;
  }
  return markedCheckboxes;
};

const selectValidation = (e) => {  
  if (selectBuddy.value === "" || selectBuddy.options[selectBuddy.selectedIndex] == 0) {
      selectError.innerHTML = "Please select your buddy";
  } else {
    selectError.innerHTML = "";
  }
}

const saveData = (radioVal, checkBoxVal,selectVal) => {
  let personData = {};
  personData.id = Date.now();
  personData.name = nameId.value;
  personData.email = emailId.value;
  personData.password = passwordId.value;
  personData.gender = radioVal;
  personData.hobbies = checkBoxVal;
  personData.buddy = selectVal;

  personDataArray.push(personData);
  localStorage.setItem("userData", JSON.stringify(personDataArray));
};

function errCheckEmpty() {
  const errors = {
    name: nameError.innerHTML,
    email: emailError.innerHTML,
    pass: passwordError.innerHTML,
    radio: radioError.innerHTML,
    check: checkboxError.innerHTML,
    select: selectError.innerHTML,
  }; 

  const allInputErr = Object.values(errors)
    .map((err) => {
      return err !== "";
    })
    .every((errInnerVal) => {
      return errInnerVal === false;
    });

  return { errors, allInputErr };
}

function handleSubmit(e) {
  if (e) {
    e.preventDefault();
  }
  nameValidation();
  emailValidation();
  passwordValidation();
  const radioVal = radioValidation(e);
  const checkBoxVal = checkBoxValidation(e);
  selectValidation(e);
  
  const { _, allInputErr } = errCheckEmpty();
  if (allInputErr) {
    saveData(radioVal, checkBoxVal, selectBuddy.value);
    handleReset();
    formInnerId.classList.add('addAnimation')
  }
  tableDataDisplay();
}

function handleReset() {
  const valueEmptyField = [nameId, emailId, passwordId, selectBuddy];
  const checkEmptyField = [maleId, femaleId, travelId, sleepId, sportsId];
  const errorEmptyField = [nameError, emailError, passwordError, radioError, checkboxError];
  function aaa(arrayVal, val) {
    arrayVal.map((field) => {
      field[val] = "";
    });
  }
  selectBuddy.value = "";
  aaa(valueEmptyField, "value");
  aaa(checkEmptyField, "checked");
  aaa(errorEmptyField, "innerHTML");
  formInnerId.classList.remove("addAnimation")
}

// DISPLAY THE DATA IN TABLE

function tableDataDisplay() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  userData?.forEach((item) => {
    let tr = document.createElement("tr");
    tr.id = item.id;   
    tr.innerHTML = `
    <td>${item.name}</td>
    <td>${item.email}</td>
    <td>${item.password}</td>
    <td>${item.gender}</td>
    <td>${item.hobbies}</td>
    <td>${item.buddy}</td>
    <td>
      <div class="d-flex gap-2">
        <div onclick="deleteData(${item.id})"><button class="btn btn-danger">Delete</button></div>
        <div onclick="editData(${item.id})"><button class="btn btn-info">Edit</button></div>
      </div>
    </td>`;
    tbody.appendChild(tr);
  });
}
tableDataDisplay();

const deleteData = (id) => {
  const index = personDataArray.findIndex((item) => item.id === id);
  if (index !== -1) {
    personDataArray.splice(index, 1);
    localStorage.setItem("userData", JSON.stringify(personDataArray));
    let elementToRemove = document.getElementById(id);
    if (elementToRemove) {
      elementToRemove.remove();
    }
  }
  handleReset();
  saveId.innerText = "Submit";
  saveId.setAttribute("onclick", `handleSubmit(event)`);
};

const editData = (id) => {
  handleReset()
  const dataObj = personDataArray.find((item) => item.id === id);
  saveId.innerText = "Update";
  saveId.setAttribute("onclick", `handleUpdate(event, ${id})`);

  nameId.value = dataObj.name;  
  emailId.value = dataObj.email;
  passwordId.value = dataObj.password;
  
  const genderRadio = dataObj.gender === "female" ? femaleId : maleId;
  genderRadio.checked = true;
  
  travelId.checked = dataObj.hobbies.includes("Traveling");
  sleepId.checked = dataObj.hobbies.includes("Sleeping");
  sportsId = dataObj.hobbies.includes("Sports");
  
  selectBuddy.value = dataObj.buddy;
  
};

function handleUpdate(e, id) {
  e.preventDefault();
  const userRecord = personDataArray.find((el) => el.id === id);
  userRecord.name = nameId.value;
  userRecord.email = emailId.value;
  userRecord.password = passwordId.value;
  userRecord.gender = maleId?.checked ? "male" : "female";
  userRecord.hobbies = checkBoxValidation();
  userRecord.buddy = selectBuddy.value;

  const updatedData = [...new Set([...personDataArray, userRecord])];
  localStorage.setItem("userData", JSON.stringify(updatedData));
  
  saveId.innerText = "Submit";
  saveId.setAttribute("onclick", `handleSubmit(event)`);
  handleReset();
  tableDataDisplay();
}
