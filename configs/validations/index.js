/**
 * Validates user credentials
 * @param { * } email password and phoneNumber
 * @returns { Boolean }
 */

const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(email);
};

const validatePassword = (password) => {
  const validate = {};
  const minLength = 6;
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const validPassword = regex.test(password);

  if (password.length < minLength) {
    validate.success = false;
    validate.msg = "Password is less than 6 chars.";
    return validate;
  }

  if (!validPassword) {
    validate.success = false;
    validate.msg =
      "Password should contain atleast one number and one special character";
    return validate;
  }

  validate.success = true;
  validate.msg = "Password is valid";
  return validate;
};

const validatePhoneNumber = (number) => {
  const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return regex.test(number);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
};
