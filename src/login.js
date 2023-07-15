import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", { username, password });
      const token = response.data.token;

      // Speichern Sie den Token in localStorage oder in einem State, um den Benutzer eingeloggt zu halten

      // Zurücksetzen des Formulars und des Fehlerstatus
      setUsername("");
      setPassword("");
      setError("");
    } catch (error) {
      setError("Fehler bei der Anmeldung");
    }
  };

  return (
    <div>
      <h2>Anmelden</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
}

export default Login;
