import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/register", {
        username,
        password,
      });

      // Erfolgreiche Registrierung, können den Benutzer zur Anmeldeseite weiterleiten

      // Zurücksetzen des Formulars und des Fehlerstatus
      setUsername("");
      setPassword("");
      setError("");
    } catch (error) {
      setError("Fehler bei der Registrierung");
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignup}>
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
        <button type="submit">Registrieren</button>
      </form>
    </div>
  );
}

export default Signup;
