import { useState } from "react";
import './Home.css';

const Home = () => {
    const [showApi, setShowApi] = useState(false);
    const [data] = useState(null);

    const apiLinks = [
        { name: "Personas", url: "/persona/todos" },
        { name: "Propiedades", url: "/propiedad/todos" },
        { name: "Contratos Arrendamiento", url: "/contrato-arrendamiento/todos" },
        { name: "Estado Contrato", url: "/estado-contrato/todos" },
        { name: "Tipo Propiedad", url: "/tipo-propiedad/todos" },
        { name: "Estado Propiedad", url: "/estado-propiedad/todos" },
        { name: "Ventas Propiedad", url: "/venta-propiedad/todos" },
    ];

    return (
        <div className="home-container">
            <h1>Bienvenido a la Gestión Inmobiliaria</h1>
            <p>Este sistema integral permite gestionar personas, propiedades, contratos...</p>

            <div className="info-cards">
                <div className="info-card">
                    <h3>Gestión Completa</h3>
                    <p>Administra todos los aspectos de tu negocio inmobiliario en un solo lugar</p>
                </div>
                <div className="info-card">
                    <h3>API REST</h3>
                    <p>Acceso completo a través de endpoints RESTful para integraciones</p>
                </div>
                <div className="info-card">
                    <h3>Interfaz Intuitiva</h3>
                    <p>Diseño moderno y responsive para una mejor experiencia de usuario</p>
                </div>
            </div>

            <button className="api-button" onClick={() => setShowApi(!showApi)}>
                {showApi ? "Ocultar Endpoints API" : "Mostrar Endpoints API"}
            </button>

            {showApi && (
                <div>
                    <ul className="api-list">
                        {apiLinks.map((link) => (
                            <li key={link.name}>
                                <a href={`${process.env.REACT_APP_API_URL}${link.url}`} target="_blank" rel="noopener noreferrer">
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {data && (
                        <pre style={{ textAlign: "left", marginTop: "10px", background: "#f5f5f5", padding: "10px", borderRadius: "8px" }}>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
