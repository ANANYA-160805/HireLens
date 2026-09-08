import React from "react";
import{ useNavigate,Link } from "react-router";
import "../auth.form.scss";
import { useAuth} from "../hooks/useAuth";

const Login = () => {

  const { loading , handleLogin} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit =  async (e) => {
    e.preventDefault();
    setError("");

    try {
      await handleLogin({email, password});
      navigate("/");
    } catch (loginError) {
      setError(
        loginError.response?.data?.message ||
        "Unable to connect to the server. Start the backend and try again."
      );
    }
  }

  if(loading){
    return (
      <main className="loading-screen" aria-busy="true" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
            onChange = {(e) => setEmail(e.target.value)}
            type="email" id="email" name="email" placeholder="Enter your email" />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
            onChange = {(e) => setPassword(e.target.value)}
           type="password" id="password" name="password" placeholder="Enter your password" />
          </div>

          <button className="button primary-button">Login</button>
        </form>

         <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  );
};

export default Login;