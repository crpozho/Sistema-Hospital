// frontend/src/api/api.js
// ========================================================
// Archivo central para manejar la conexión del frontend con el backend
// Compatible tanto con entorno local como con producción en Render
// ========================================================

// Detecta si la app está en modo desarrollo o producción
const isLocal = window.location.hostname === "localhost";

// URL base del backend:
// ⚠️ En producción (Render), usa la API pública del backend desplegado.
// ⚙️ En local, apunta al backend que corre en tu máquina.
const API_URL = isLocal
  ? "http://localhost:4000"  // 🧩 Localhost (para desarrollo)
  : "https://sistema-hospital.onrender.com"; // 🌐 Backend Render (producción)

// Exporta la URL base para usar en otros módulos
export default API_URL;

// ========================================================
// Ejemplo de cómo hacer peticiones usando fetch:
// ========================================================
//
// import API_URL from "./api";
//
// export async function obtenerPacientes() {
//   try {
//     const respuesta = await fetch(`${API_URL}/api/pacientes`);
//     if (!respuesta.ok) throw new Error("Error al obtener pacientes");
//     const data = await respuesta.json();
//     return data;
//   } catch (error) {
//     console.error("Error:", error);
//     return [];
//   }
// }
//
// ========================================================
// Usa `API_URL` en todos los servicios de React para conectar con tu backend
// ========================================================
