import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Container, Navbar, Nav, Button, Table, Form } from "react-bootstrap";

/* 🔙 Botón para volver al inicio */
const BotonRegresar = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline-primary"
      className="back-button"
      onClick={() => navigate("/")}
    >
      ⬅️ Regresar al Menú Principal
    </Button>
  );
};

/* 🏠 INICIO */
const Inicio = () => (
  <Container className="text-center">
    <h2>🏥 Bienvenido al Sistema Hospitalario</h2>
    <p className="text-muted">
      Administra tus citas, médicos, reasignaciones y reportes desde un solo panel.
    </p>
    <div className="mt-4">
      <Link className="btn btn-primary me-3" to="/citas">
        Gestionar Citas
      </Link>
      <Link className="btn btn-primary me-3" to="/medicos">
        Gestionar Médicos
      </Link>
      <Link className="btn btn-primary me-3" to="/reasignaciones">
        Reasignaciones
      </Link>
      <Link className="btn btn-primary" to="/reportes">
        Ver Reportes
      </Link>
    </div>
  </Container>
);

/* 📅 CITAS */
const Citas = () => {
  const [citas, setCitas] = useState(() => {
    const guardadas = localStorage.getItem("citas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [nueva, setNueva] = useState({ paciente: "", medico: "", fecha: "" });

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  const agregarCita = (e) => {
    e.preventDefault();
    setCitas([...citas, { id: Date.now(), ...nueva }]);
    setNueva({ paciente: "", medico: "", fecha: "" });
  };

  return (
    <Container>
      <h2>📅 Gestión de Citas</h2>
      <Form onSubmit={agregarCita} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Paciente"
            value={nueva.paciente}
            onChange={(e) => setNueva({ ...nueva, paciente: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Médico"
            value={nueva.medico}
            onChange={(e) => setNueva({ ...nueva, medico: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="date"
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          ➕ Agregar Cita
        </Button>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.id}</td>
              <td>{cita.paciente}</td>
              <td>{cita.medico}</td>
              <td>{cita.fecha}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BotonRegresar />
    </Container>
  );
};

/* 🩺 MÉDICOS */
const Medicos = () => {
  const [medicos, setMedicos] = useState(() => {
    const guardados = localStorage.getItem("medicos");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [nuevo, setNuevo] = useState({ nombre: "", especialidad: "" });

  useEffect(() => {
    localStorage.setItem("medicos", JSON.stringify(medicos));
  }, [medicos]);

  const agregarMedico = (e) => {
    e.preventDefault();
    setMedicos([...medicos, { id: Date.now(), ...nuevo }]);
    setNuevo({ nombre: "", especialidad: "" });
  };

  return (
    <Container>
      <h2>👨‍⚕️ Gestión de Médicos</h2>
      <Form onSubmit={agregarMedico} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Nombre del médico"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Especialidad"
            value={nuevo.especialidad}
            onChange={(e) =>
              setNuevo({ ...nuevo, especialidad: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          ➕ Agregar Médico
        </Button>
      </Form>

      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.especialidad}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BotonRegresar />
    </Container>
  );
};

/* 🔄 REASIGNACIONES */
const Reasignaciones = () => {
  const [reasig, setReasig] = useState(() => {
    const guardadas = localStorage.getItem("reasignaciones");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [nueva, setNueva] = useState({
    paciente: "",
    medicoActual: "",
    nuevoMedico: "",
    fecha: "",
  });

  useEffect(() => {
    localStorage.setItem("reasignaciones", JSON.stringify(reasig));
  }, [reasig]);

  const agregarReasig = (e) => {
    e.preventDefault();
    setReasig([...reasig, { id: Date.now(), ...nueva }]);
    setNueva({ paciente: "", medicoActual: "", nuevoMedico: "", fecha: "" });
  };

  return (
    <Container>
      <h2>🔄 Reasignación de Turnos</h2>
      <Form onSubmit={agregarReasig} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Paciente"
            value={nueva.paciente}
            onChange={(e) => setNueva({ ...nueva, paciente: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Médico actual"
            value={nueva.medicoActual}
            onChange={(e) =>
              setNueva({ ...nueva, medicoActual: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Nuevo médico"
            value={nueva.nuevoMedico}
            onChange={(e) =>
              setNueva({ ...nueva, nuevoMedico: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="date"
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          ➕ Agregar Reasignación
        </Button>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico actual</th>
            <th>Nuevo médico</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reasig.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.paciente}</td>
              <td>{r.medicoActual}</td>
              <td>{r.nuevoMedico}</td>
              <td>{r.fecha}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BotonRegresar />
    </Container>
  );
};

/* 📊 REPORTES */
const Reportes = () => (
  <Container>
    <h2>📊 Reportes</h2>
    <p>Visualiza reportes de citas, médicos y reasignaciones.</p>
    <Table bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Reporte</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Citas por médico</td>
          <td>Resumen general de citas por profesional.</td>
        </tr>
        <tr>
          <td>Reasignaciones</td>
          <td>Historial de reasignaciones recientes.</td>
        </tr>
      </tbody>
    </Table>
    <BotonRegresar />
  </Container>
);

/* 🧠 APP PRINCIPAL */
function App() {
  return (
    <Router>
      <Navbar expand="lg" className="navbar-dark custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🏥 <span>Sistema Hospitalario</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
              <NavLink className="nav-link" to="/citas">
                Citas
              </NavLink>
              <NavLink className="nav-link" to="/medicos">
                Médicos
              </NavLink>
              <NavLink className="nav-link" to="/reasignaciones">
                Reasignaciones
              </NavLink>
              <NavLink className="nav-link" to="/reportes">
                Reportes
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🚑 Banner con logo actualizado */}
      <div className="header-banner">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
          alt="Ambulancia"
        />
        <div>
          <h1>Hospital UMG</h1>
          <p>Gestión digital de citas, médicos y reportes</p>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/reasignaciones" element={<Reasignaciones />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>

      <footer> Hospital UMG </footer>
    </Router>
  );
}

export default App;
