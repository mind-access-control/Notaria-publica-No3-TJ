"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Intentando login con:", formData); // Debug log

    // Simulate authentication
    setTimeout(() => {
      if (formData.username === "admin" && formData.password === "admin123") {
        console.log("Credenciales correctas, guardando sesión..."); // Debug log

        // Store admin session
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            username: formData.username,
            loginTime: new Date().toISOString(),
            role: "admin",
          })
        );

        console.log("Sesión guardada, redirigiendo..."); // Debug log

        // Use direct navigation instead of router
        setTimeout(() => {
          console.log("Redirigiendo a /admin...");
          window.location.href = "/admin";
        }, 100);
      } else {
        console.log("Credenciales incorrectas"); // Debug log
        setError(
          "Credenciales incorrectas. Usuario: admin, Contraseña: admin123"
        );
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Acceso Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">Credenciales de prueba:</p>
          <p>
            <strong>Usuario:</strong> admin
          </p>
          <p>
            <strong>Contraseña:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
}
