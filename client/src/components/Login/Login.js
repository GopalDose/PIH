import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="container">
      <div className="LoginPage">
        <form className="Loginform">
          <div className="formheader">Login</div>
          <div className="field-group">
            <div className="form-control">
              <label htmlFor="email">Email: </label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password: </label>
              <input type="password" name="password" id="password" />
            </div>
            <a href="#" className="forgetlink">
              Forgot your password?
            </a>
            <div className="form-control">
              <input
                type="submit"
                name="submit"
                value="Submit"
                className="submitbutton"
              />
            </div>
            <div className="orTag">
              <hr />
              OR
              <hr />
            </div>
            <div className="form-control">
              <a href="#" className="social">
                <ion-icon name="logo-google"></ion-icon>
                <span>Login with Google</span>
              </a>
              <a href="#" className="social">
              <ion-icon name="logo-facebook"></ion-icon>
                <span>Login with Facebook</span>
              </a>
            </div>
            <div className="form-control">
              <a href="#" className="forgetlink">
              Don't have an account?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
