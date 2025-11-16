// frontend/src/components/Reasignaciones/ReasignacionPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

const ReasignacionPage = () => {
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [nuevoMedico, setNuevoMedico] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  /* ---------------- Cargar datos iniciales ---------------- */
  useEffect(() => {
    cargarCitas();
    cargarMedicos();
  }, []);

  const cargarCitas = async () => {
    try {
      const res = await api.get("/citas");
      setCitas(res.data.data || []);
    } catch (err) {
      console.error("Error al cargar citas:", err);
    }
  };

  const cargarMedicos = async () => {
    try {
      const res = await api.get("/usuarios?rol=medico");
      setMedicos(res.data.data || []);
    } catch (err) {
      console.error("Error al cargar médicos:", err);
    }
  };

  /* ---------------- Abrir modal ---------------- */
  const abrirModal = (cita) => {
    setCitaSeleccionada(cita);
    setNuevoMedico("");
    setMotivo("");
    setMostrarModal(true);
  };

  /* ---------------- Confirmar reasignación ---------------- */
  const confirmarReasignacion = async () => {
    if (!nuevoMedico || !motivo) {
      setMensaje({
        tipo: "warning",
        texto: "Debes seleccionar un médico y escribir el motivo del cambio.",
      });
      return;
    }

    setCargando(true);
    try {
      const res = await api.post(`/citas/${citaSeleccionada.idCita}/reasignar`, {
        idMedicoNuevo: nuevoMedico,
        motivo,
        idUsuario: 1, // Usuario fijo de prueba
      });

      setMensaje({
        tipo: "success",
        texto: `Reasignación completada: ${res.data.message}`,
      });
      setMostrarModal(false);
      cargarCitas();
    } catch (err) {
      console.error(err);
      setMensaje({
        tipo: "danger",
        texto: "Error al reasignar el turno.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Reasignación de Turnos</h2>

      {mensaje && (
        <Alert
          variant={mensaje.tipo}
          onClose={() => setMensaje(null)}
          dismissible
        >
          {mensaje.texto}
        </Alert>
      )}

      {/* Tabla de citas */}
      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico actual</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay citas registradas.
              </td>
            </tr>
          ) : (
            citas.map((c) => (
              <tr key={c.idCita}>
                <td>{c.idCita}</td>
                <td>{c.pacienteNombre}</td>
                <td>{c.medicoNombre}</td>
                <td>{new Date(c.fechaHora).toLocaleString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => abrirModal(c)}
                  >
                    Reasignar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal de reasignación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reasignar turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citaSeleccionada && (
            <>
              <p>
                <strong>Paciente:</strong> {citaSeleccionada.pacienteNombre}
                <br />
                <strong>Médico actual:</strong>{" "}
                {citaSeleccionada.medicoNombre}
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Seleccionar nuevo médico</Form.Label>
                <Form.Select
                  value={nuevoMedico}
                  onChange={(e) => setNuevoMedico(e.target.value)}
                >
                  <option value="">-- Seleccionar médico --</option>
                  {medicos.map((m) => (
                    <option key={m.idUsuario} value={m.idUsuario}>
                      {m.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Motivo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ejemplo: Cambio de médico por disponibilidad"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={confirmarReasignacion}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <Spinner animation="border" size="sm" /> Guardando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReasignacionPage;
