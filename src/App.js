// src/App.jsx - CORREGIDO
import { useState } from "react";
import Sidebar from './components/sidebar/Sidebar';
import Home from "./components/home/Home";
import Persona from "./components/persona/Persona";
import Propiedad from "./components/propiedad/Propiedades";
import ContratoArrendamiento from "./components/contratoArrendamiento/ContratoArrendamiento";
import EstadoContrato from "./components/estadoContrato/EstadoContrato";
import TipoPropiedad from "./components/tipoPropiedad/TipoPropiedad";
import EstadoPropiedad from "./components/estadoPropiedad/EstadoPropiedad";
import VentaPropiedad from "./components/ventaPropiedad/VentaPropiedad";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("Home");

  return (
    <div className="app-container">
      <Sidebar activeItem={activeSection} setActiveItem={setActiveSection} />

      <div className="main-content">
        {/* Home */}
        {activeSection === "Home" && <Home />}

        {/* 1) Sección Propiedad */}
        {activeSection === "Propiedad" && (
          <div className="propiedad-section">
            <Propiedad />
          </div>
        )}

        {/* 2) Sección Persona */}
        {activeSection === "Persona" && (
          <div className="persona-section">
            <Persona />
          </div>
        )}

        {/* 3) Sección Contrato Arrendamiento */}
        {activeSection === "Contrato Arrendamiento" && (
          <div className="contratos-section">
            <div className="contratos-container">
              <ContratoArrendamiento />
            </div>
          </div>
        )}

        {/* 4) Sección Estado Contrato */}
        {activeSection === "Estado Contrato" && (
          <div className="estado-contrato-section">
            <EstadoContrato />
          </div>
        )}

        {/* 5) Sección Tipo Propiedad */}
        {activeSection === "Tipo Propiedad" && (
          <div className="tipo-propiedad-section">
            <TipoPropiedad />
          </div>
        )}

        {/* 6) Sección Estado Propiedad */}
        {activeSection === "Estado Propiedad" && (
          <div className="estado-propiedad-section">
            <EstadoPropiedad />
          </div>
        )}

        {/* 7) Sección Venta Propiedad */}
        {activeSection === "Venta Propiedad" && (
          <div className="venta-propiedad-section">
            <VentaPropiedad />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;