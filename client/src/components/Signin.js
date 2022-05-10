import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import { showLoading } from "../helpers/loading";
import { showErrorMsg } from "../helpers/message";
import { signin } from "../api/auth";
import { isAuthenticated, setAuthentication } from "../helpers/auth";

const Signin = () => {
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
    email: "kesavan@gmail.com",
    password: "12345",
    errorMsg: false,
    loading: false
  });
  const { email, password, errorMsg, loading, redirectToDashboard } = formData;

  const handleChange = evt => {
    const { name, value } = evt.target;

    setFormData(prevState => {
      return {
        ...prevState,
        [name]: value,
        errorMsg: ""
      };
    });
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if (isEmpty(password) || isEmpty(email)) {
      setFormData({
        ...formData,
        errorMsg: "All fields are required"
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        errorMsg: "Invalid email"
      });
    } else {
      const { email, password } = formData;
      const data = { email, password };
      setFormData({
        ...formData,
        loading: true
      });
      signin(data)
        .then(response => {
          setAuthentication(response.data.token, response.data.user);
          if (isAuthenticated() && isAuthenticated().role === 1) {
            console.log("Redirect to admin dashboard");
            history.push("/admin/dashboard");
          } else {
            console.log("Redirecting to user dashboard");
            history.push("/user/dashboard");
          }
        })
        .catch(err => {
          console.log("Signin api function error", err);
          setFormData({
            ...formData,
            loading: false,
            errorMsg: err.response.data.errorMessage
          });
        });
    }
  };

  return (
    <div className="signin-container">
      <div className="row px-3 vh-100">
        <div className="col-md-5 mx-auto align-self-center ">
          {errorMsg && showErrorMsg(errorMsg)}

          {loading &&
            <div className="text-center pb-4">
              {showLoading()}
            </div>}
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Signin
              </button>
            </div>
            <p className="text-center text-white">
              Don't have an account ? <Link to="/signup"> Register here </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
