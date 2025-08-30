// src/components/Login.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "../services/loginService.js";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(username, password);
      if (response.token) {
        localStorage.setItem("jwtToken", response.token); // <-- usa la misma clave que en App.jsx
        onLogin(username); // notifica al parent que el usuario hizo login
      }
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col gap-6 w-full max-w-sm border px-6 py-8 rounded-md shadow-md bg-background">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <Label>Usuario</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full mt-2">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
