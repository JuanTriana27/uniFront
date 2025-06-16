// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";

import PropiedadList from "./components/propiedad/PropiedadList";
import PropiedadForm from "./components/propiedad/PropiedadForm";

import PersonaList from "./components/persona/PersonaList";
import PersonaForm from "./components/persona/PersonaForm";

import ContratoList from "./components/contratoArrendamiento/ContratoList";
import ContratoDetail from "./components/contratoArrendamiento/ContratoDetail";

import EstadoContratoList from "./components/estadoContrato/EstadoContratoList";
import TipoPropiedadList from "./components/tipoPropiedad/TipoPropiedadList";

import EstadoPropiedadList from "./components/estadoPropiedad/EstadoPropiedadList";
import EstadoPropiedadForm from "./components/estadoPropiedad/EstadoPropiedadForm";

import VentaPropiedadList from "./components/ventaPropiedad/VentaPropiedadList";

import "./App.css";

function App() {
  const [reloadProp, setReloadProp] = useState(false);
  const [reloadPers, setReloadPers] = useState(false);
  const [reloadEstadoProp, setReloadEstadoProp] = useState(false);

  const [activeSection, setActiveSection] = useState("Propiedad");

  const [propiedadToEdit, setPropiedadToEdit] = useState(null);
  const [personaToEdit, setPersonaToEdit] = useState(null);

  const [selectedContratoId, setSelectedContratoId] = useState(null);

  return (
    <div className="app-container">
      <Sidebar activeItem={activeSection} setActiveItem={setActiveSection} />

      <div className="main-content">
        {/* 1) Sección Propiedad */}
        {activeSection === "Propiedad" && (
          <div className="propiedad-section">
            <h1>Gestión de Propiedades</h1>
            <PropiedadForm
              onCreated={() => {
                setReloadProp((prev) => !prev);
                setPropiedadToEdit(null);
              }}
              propiedadToEdit={propiedadToEdit}
            />
            <PropiedadList
              key={reloadProp}
              onEditPropiedad={(p) => {
                setPropiedadToEdit(p);
                setActiveSection("Propiedad");
              }}
            />
          </div>
        )}

        {/* 2) Sección Persona */}
        {activeSection === "Persona" && (
          <div className="persona-section">
            <h1>Gestión de Personas</h1>
            <PersonaForm
              onCreated={() => {
                setReloadPers((prev) => !prev);
                setPersonaToEdit(null);
              }}
              personaToEdit={personaToEdit}
            />
            <PersonaList
              key={reloadPers}
              onEditPersona={(p) => {
                setPersonaToEdit(p);
                setActiveSection("Persona");
              }}
            />
          </div>
        )}

        {/* 3) Sección Contrato Arrendamiento */}
        {activeSection === "Contrato Arrendamiento" && (
          <div className="contratos-section">
            <h1>Gestión de Contratos de Arrendamiento</h1>
            <div className="contratos-container">
              <ContratoList onSelectContrato={setSelectedContratoId} />
              {selectedContratoId && (
                <ContratoDetail
                  contratoId={selectedContratoId}
                  onClose={() => setSelectedContratoId(null)}
                />
              )}
            </div>
          </div>
        )}

        {/* 4) Sección Estado Contrato */}
        {activeSection === "Estado Contrato" && (
          <div className="estado-contrato-section">
            <h1>Gestión de Estados de Contrato</h1>
            <EstadoContratoList />
          </div>
        )}

        {/* 5) Sección Tipo Propiedad */}
        {activeSection === "Tipo Propiedad" && (
          <div className="tipo-propiedad-section">
            <h1>Listado de Tipos de Propiedad</h1>
            <TipoPropiedadList />
          </div>
        )}

        {/* 6) Sección Estado Propiedad */}
        {activeSection === "Estado Propiedad" && (
          <div className="estado-propiedad-section">
            <h1>Gestión de Estados de Propiedad</h1>
            <EstadoPropiedadForm
              onCreated={() => setReloadEstadoProp((prev) => !prev)}
            />
            <EstadoPropiedadList key={reloadEstadoProp} />
          </div>
        )}

        {/* 7) Sección Venta Propiedad */}
        {activeSection === "Venta Propiedad" && (
          <div className="venta-propiedad-section">
            <h1>Listado de Ventas de Propiedad</h1>
            <VentaPropiedadList />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;