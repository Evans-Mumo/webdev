/* =========================================================
   WebDev – Member Registration  |  script.js
   SPI 2201 – Web Application Development I
   Kirinyaga University (2026/2027)
   ========================================================= */

/* =========================================================
   STEP 2 – GRAB REFERENCES TO EVERY ELEMENT WE NEED
   ========================================================= */

// --- The form -------------------------------------------------
const form = document.getElementById('regform');

// --- Every input / select / textarea --------------------------
const nameInput     = document.getElementById('name');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput  = document.getElementById('confirm-password');
const genderInput   = document.getElementById('gender');
const dobInput      = document.getElementById('dob');
const countryInput  = document.getElementById('country');
const phoneInput    = document.getElementById('phone');
const bioInput      = document.getElementById('bio');

// --- Each field's .error <small> ------------------------------
const nameError     = document.getElementById('nameError');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError  = document.getElementById('confirmError');
const genderError   = document.getElementById('genderError');
const dobError      = document.getElementById('dobError');
const countryError  = document.getElementById('countryError');
const phoneError    = document.getElementById('phoneError');
const bioError      = document.getElementById('bioError');

// --- Success message box --------------------------------------
const successMsg = document.getElementById('successMsg');

// --- Member list + counter + empty note -----------------------
const memberList = document.getElementById('memberList');
const countEl    = document.getElementById('count');
const emptyNote  = document.getElementById('emptyNote');

// --- Dark Mode button -----------------------------------------
const themeBtn = document.getElementById('theme');

// Log everything so we can confirm nothing is missing
console.group('🔍 Element references');
console.log('form           :', form);
console.log('name           :', nameInput,      nameError);
console.log('email          :', emailInput,     emailError);
console.log('password       :', passwordInput,  passwordError);
console.log('confirm        :', confirmInput,   confirmError);
console.log('gender         :', genderInput,    genderError);
console.log('dob            :', dobInput,       dobError);
console.log('country        :', countryInput,   countryError);
console.log('phone          :', phoneInput,     phoneError);
console.log('bio            :', bioInput,       bioError);
console.log('successMsg     :', successMsg);
console.log('memberList     :', memberList);
console.log('countEl        :', countEl);
console.log('emptyNote      :', emptyNote);
console.log('themeBtn       :', themeBtn);
console.groupEnd();

/* =========================================================
   STEP 4 – VALIDATION RULES
   Each validator returns '' when the field is OK,
   or a human-readable error message when it is not.
   ========================================================= */

function validateName() {
  const value = nameInput.value.trim();
  if (!value) return 'Full name is required.';
  if (value.length < 3) return 'Name must be at least 3 characters long.';
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) {
    return 'Name can only contain letters, spaces, apostrophes and hyphens.';
  }
  return '';
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value)) {
    return 'Enter a valid email, e.g. mugo@students.kyu.ac.ke';
  }
  return '';
}

function validatePassword() {
  const value = passwordInput.value;
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must contain both letters and numbers.';
  }
  return '';
}

function validateConfirm() {
  if (!confirmInput.value) return 'Please confirm your password.';
  if (confirmInput.value !== passwordInput.value) {
    return 'Passwords do not match.';
  }
  return '';
}

function validateGender() {
  if (!genderInput.value) return 'Please select your gender.';
  return '';
}

function validateDob() {
  const value = dobInput.value;
  if (!value) return 'Date of birth is required.';

  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return 'Please enter a valid date.';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dob > today) return 'Date of birth cannot be in the future.';

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 13) return 'You must be at least 13 years old to register.';

  return '';
}

function validateCountry() {
  const value = countryInput.value.trim();
  if (!value) return 'Country is required.';
  if (value.length < 2) return 'Country name is too short.';
  return '';
}

function validatePhone() {
  const value = phoneInput.value.trim();
  if (!value) return 'Phone number is required.';
  if (!/^\+?[0-9][0-9\s-]{6,14}$/.test(value)) {
    return 'Enter a valid phone, e.g. +254 700 000 000';
  }
  return '';
}

function validateBio() {
  const value = bioInput.value.trim();
  if (value.length > 250) return 'Bio must be 250 characters or fewer.';
  return '';
}

// Bundle each field with its error element and its validator
const fieldRules = [
  { input: nameInput,     error: nameError,     validate: validateName },
  { input: emailInput,    error: emailError,    validate: validateEmail },
  { input: passwordInput, error: passwordError, validate: validatePassword },
  { input: confirmInput,  error: confirmError,  validate: validateConfirm },
  { input: genderInput,   error: genderError,   validate: validateGender },
  { input: dobInput,      error: dobError,      validate: validateDob },
  { input: countryInput,  error: countryError,  validate: validateCountry },
  { input: phoneInput,    error: phoneError,    validate: validatePhone },
  { input: bioInput,      error: bioError,      validate: validateBio }
];

/* ---------- Helper: paint / clear a single field's error ---------- */
function showError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle('invalid', Boolean(message));
}

/* ---------- Helper: validate every field ---------- */
function validateForm() {
  let firstInvalid = null;

  fieldRules.forEach((rule) => {
    const message = rule.validate();
    showError(rule.input, rule.error, message);
    if (message && !firstInvalid) firstInvalid = rule.input;
  });

  return firstInvalid;
}

/* =========================================================
   STEP 5 – CLEAR ERRORS AS THE USER FIXES THEM
   ========================================================= */
fieldRules.forEach((rule) => {
  const clear = () => showError(rule.input, rule.error, '');
  rule.input.addEventListener('input', clear);
  rule.input.addEventListener('change', clear);
});

// Retyping the password also clears the "confirm" error
passwordInput.addEventListener('input', () => {
  if (confirmInput.value) {
    showError(confirmInput, confirmError, validateConfirm());
  }
});

/* =========================================================
   STEP 6 / 7 / 8 – HELPERS FOR CREATING, COUNTING, MESSAGING
   ========================================================= */

/* ---------- STEP 7: update the member counter ---------- */
function updateCount() {
  const total = memberList.querySelectorAll('.member-item').length;
  countEl.textContent = total;
  emptyNote.classList.toggle('hidden', total > 0);
}

/* ---------- STEP 6: build a member row with the DOM ---------- */
function addMember(member) {
  const li = document.createElement('li');
  li.className = 'member-item';

  const info = document.createElement('div');
  info.className = 'info';

  const nameEl = document.createElement('strong');
  nameEl.textContent = member.name;

  const metaEl = document.createElement('span');
  metaEl.textContent = `${member.email} • ${member.country}`;

  info.append(nameEl, metaEl);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove';
  removeBtn.textContent = 'Remove';
  removeBtn.setAttribute('aria-label', `Remove ${member.name}`);

  li.append(info, removeBtn);
  memberList.appendChild(li);
}

/* ---------- STEP 8: success message ---------- */
let successTimer = null;

function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.remove('hidden');

  clearTimeout(successTimer);
  successTimer = setTimeout(hideSuccess, 4000);
}

function hideSuccess() {
  successMsg.classList.add('hidden');
  successMsg.textContent = '';
}

/* =========================================================
   STEP 3 – CAPTURE THE FORM SUBMISSION
   ========================================================= */
form.addEventListener('submit', function (event) {
  event.preventDefault();

  hideSuccess();

  const firstInvalid = validateForm();

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const member = {
    name:    nameInput.value.trim(),
    email:   emailInput.value.trim(),
    gender:  genderInput.value,
    dob:     dobInput.value,
    country: countryInput.value.trim(),
    phone:   phoneInput.value.trim(),
    bio:     bioInput.value.trim()
  };

  addMember(member);
  updateCount();
  showSuccess(`🎉 ${member.name} has been registered successfully!`);

  form.reset();

  fieldRules.forEach((rule) => showError(rule.input, rule.error, ''));

  nameInput.focus();
});

/* =========================================================
   STEP 9 – REMOVE A MEMBER (event delegation)
   ========================================================= */
memberList.addEventListener('click', function (event) {
  const removeBtn = event.target.closest('.remove');
  if (!removeBtn) return;

  const item = removeBtn.closest('.member-item');
  if (!item) return;

  item.remove();
  updateCount();
});

/* =========================================================
   STEP 10 – DARK MODE TOGGLE
   ========================================================= */
themeBtn.addEventListener('click', function () {
  const isDark = document.body.classList.toggle('dark');

  themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  themeBtn.setAttribute('aria-pressed', String(isDark));
});

/* =========================================================
   INITIALISE
   ========================================================= */
updateCount();