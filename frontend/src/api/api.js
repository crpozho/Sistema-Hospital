// frontend/src/api/api.js
const API_URL = "https://sistema-hospital.onrender.com/api"; // ✅ URL del backend en Render

export async function getData(endpoint) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
}

export async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al enviar datos:", error);
    throw error;
  }
}
