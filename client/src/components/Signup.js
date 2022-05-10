import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import equals from "validator/lib/equals";
import { showErrorMsg, showSuccessMsg } from "../helpers/message";
import { showLoading } from "../helpers/loading";
import { signup } from "../api/auth";
import { isAuthenticated, setAuthentication } from "../helpers/auth";

const Signup = () => {
  let history = useHistory();
  useEffect(
    () => {
      if (isAuthenticated() && isAuthenticated().role === 1) {
        history.push("/admin/dashboard");
      } else if (isAuthenticated() && isAuthenticated().role === 0) {
        history.push("/user/dashboard");
      }
    },
    [history]
  );

  const [formData, setFormData] = useState({
    username: "Kesavan",
    email: "kesavan@gmail.com",
    password: "12345",
    password2: "12345",
    successMsg: false,
    errorMsg: false,
    loading: false
  });

  const {
    username,
    email,
    password,
    password2,
    successMsg,
    errorMsg,
    loading
  } = formData;

  const handleChange = evt => {
    const { name, value } = evt.target;

    setFormData(prevState => {
      return {
        ...prevState,
        [name]: value,
        successMsg: "",
        errorMsg: ""
      };
    });
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if (
      isEmpty(username) ||
      isEmpty(password) ||
      isEmpty(email) ||
      isEmpty(password2)
    ) {
      setFormData({
        ...formData,
        errorMsg: "All fields are required"
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        errorMsg: "Invalid email"
      });
    } else if (!equals(password, password2)) {
      setFormData({
        ...formData,
        errorMsg: "Password do not match"
      });
    } else {
      const { username, email, password } = formData;
      const data = { username, email, password };
      setFormData({
        ...formData,
        loading: true
      });
      signup(data)
        .then(response => {
          console.log("Axios signup success", response);
          setFormData({
            username: "",
            email: "",
            password: "",
            password2: "",
            loading: false,
            successMsg: response.data.successMessage
          });
        })
        .catch(err => {
          console.log("Axios signup error", err);
          setFormData({
            ...formData,
            loading: false,
            errorMsg: err.response.data.errorMessage
          });
        });
    }
  };

  return (
    <div className="signup-container">
      <div className="row px-3 vh-100">
        <div className="col-md-5 mx-auto align-self-center ">
          {errorMsg && showErrorMsg(errorMsg)}
          {successMsg && showSuccessMsg(successMsg)}

          {loading &&
            <div className="text-center pb-4">
              {showLoading()}
            </div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa fa-user" />
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa fa-envelope" />
                </span>
              </div>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa fa-lock" />
                </span>
              </div>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Create password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa fa-lock" />
                </span>
              </div>
              <input
                name="password2"
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={password2}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Signup
              </button>
            </div>
            <p className="text-center text-white">
              Have an account ? <Link to="/signin"> Log In </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
