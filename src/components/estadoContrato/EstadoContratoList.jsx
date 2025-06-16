import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./EstadoContrato.css";

function EstadoContratoList() {
    const [estados, setEstados] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchEstados = async () => {
        try {
            const response = await api.get("/estado-contrato/todos");
            setEstados(response.data);
        } catch (error) {
            console.error("Error obteniendo estados de contrato", error);
            setErrorMsg("No se pudo cargar la lista de estados de contrato.");
        }
    };

    useEffect(() => {
        fetchEstados();
    }, []);

    return (
        <div className="estado-contrato-list">
            <h2 className="section-header">Listado de Estados de Contrato</h2>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="table-container">
                <table className="estado-contrato-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estados.map((e) => (
                            <tr key={e.idEstadoContrato}>
                                <td>{e.idEstadoContrato}</td>
                                <td>{e.nombre || "––"}</td>
                                <td>{e.descripcion || "––"}</td>
                            </tr>
                        ))}

                        {estados.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    No hay estados de contrato registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EstadoContratoList;
