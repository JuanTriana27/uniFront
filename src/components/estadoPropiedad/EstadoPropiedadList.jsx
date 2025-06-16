// src/components/estadoPropiedad/EstadoPropiedadList.jsx
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./EstadoPropiedad.css";

function EstadoPropiedadList() {
    const [estados, setEstados] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchEstados = async () => {
        try {
            const response = await api.get("/estado-propiedad/todos");
            setEstados(response.data);
        } catch (error) {
            console.error("Error obteniendo estados de propiedad", error);
            setErrorMsg("No se pudo cargar la lista de estados.");
        }
    };

    useEffect(() => {
        fetchEstados();
    }, []);

    return (
        <div className="estado-propiedad-list">
            <h2 className="section-header">Listado de Estados de Propiedad</h2>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="table-container">
                <table className="estado-propiedad-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estados.map((e) => (
                            <tr key={e.idEstadoPropiedad}>
                                <td>{e.idEstadoPropiedad}</td>
                                <td>{e.nombre || "––"}</td>
                                <td>{e.descripcion || "––"}</td>
                            </tr>
                        ))}

                        {estados.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    No hay estados registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EstadoPropiedadList;
