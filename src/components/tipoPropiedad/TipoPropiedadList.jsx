// src/components/tipoPropiedad/TipoPropiedadList.jsx
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./TipoPropiedad.css";

function TipoPropiedadList() {
    const [tipos, setTipos] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchTipos = async () => {
        try {
            const response = await api.get("/tipo-propiedad/todos");
            setTipos(response.data);
        } catch (error) {
            console.error("Error obteniendo tipos de propiedad", error);
            setErrorMsg("No se pudo cargar la lista de tipos de propiedad.");
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    return (
        <div className="tipo-propiedad-list">
            <h2 className="section-header">Listado de Tipos de Propiedad</h2>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="table-container">
                <table className="tipo-propiedad-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipos.map((t) => (
                            <tr key={t.idTipoPropiedad}>
                                <td>{t.idTipoPropiedad}</td>
                                <td>{t.nombre || "––"}</td>
                                <td>{t.descripcion || "––"}</td>
                            </tr>
                        ))}

                        {tipos.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    No hay tipos de propiedad registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TipoPropiedadList;
