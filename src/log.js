import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = { username, password };
      const response = await axios.post("/api/login", user);
      const token = response.data.token;
      // Speichern Sie den Token in Ihrem Client (z. B. im Local Storage) für die spätere Verwendung

      // Weiterleitung zur Startseite
      navigate("/");
    } catch (error) {
      setError("Ungültige Anmeldeinformationen");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Anmeldung</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Benutzername"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
      />
      <button onClick={handleLogin}>Anmelden</button>
    </div>
  );
}

export default Login;
