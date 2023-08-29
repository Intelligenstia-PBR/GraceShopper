const { useState } = require("react");
const { Alert, Button, Form } = require("react-bootstrap");
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../api";

// This component logs in users
export const Login = ({
  token,
  setToken,
  username,
  setUsername,
  setAndStoreUsername,
}) => {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const login = async () => {
      try {
        const result = await userLogin(username, password);
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setAndStoreUsername(username);
        setUsername("");
        setPassword("");
        if (result.token) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    login();
  };

  return (
    <div className="text-center form">
      <h1 className="form-header">Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            placeholder="Enter your username"
            minLength="8"
            maxLength="20"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            placeholder="Enter your password"
            minLength="8"
            maxLength="20"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Log In
        </Button>
        <Link to="/register">Don't have an account? Sign up for FREE!!</Link>
      </Form>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      {success && <Alert variant="success">Successfully Logged in!</Alert>}
    </div>
  );
};