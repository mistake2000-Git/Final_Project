import './login.css';
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/login", { username, password });
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
      };

    return (
        <div className="login">
          <form onSubmit={handleSubmit}>
            <span className="formTitle">Dashboard Login</span>
            <input
              type="text"
              placeholder="User Name"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submitButton">
              Login
            </button>
          </form>
        </div>
    )
}
