import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./Contratos.css";

function ContratoList({ onSelectContrato }) {
    const [contratos, setContratos] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchContratos = async () => {
        try {
            const response = await api.get("/contrato-arrendamiento/todos");
            setContratos(response.data);
        } catch (error) {
            console.error("Error obteniendo contratos", error);
            setErrorMsg("No se pudo cargar la lista de contratos.");
        }
    };

    useEffect(() => {
        fetchContratos();
    }, []);

    return (
        <div className="contrato-list">
            <h2 className="section-header">Listado de Contratos</h2>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="table-container">
                <table className="contratos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Renta Mensual</th>
                            <th>Depósito</th>
                            <th>Propiedad</th>
                            <th>Arrendatario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contratos.map((c) => (
                            <tr
                                key={c.idContratoArrendamiento}
                                onClick={() => onSelectContrato(c.idContratoArrendamiento)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{c.idContratoArrendamiento}</td>

                                {/* Fecha Inicio (si existe) */}
                                <td>
                                    {c.fechaInicio
                                        ? new Date(c.fechaInicio).toLocaleDateString()
                                        : "––"}
                                </td>

                                {/* Fecha Fin (si existe) */}
                                <td>
                                    {c.fechaFin
                                        ? new Date(c.fechaFin).toLocaleDateString()
                                        : "––"}
                                </td>

                                {/* Renta Mensual (si existe) */}
                                <td>
                                    {typeof c.rentaMensual === "number"
                                        ? `$${c.rentaMensual.toLocaleString()}`
                                        : "––"}
                                </td>

                                {/* Depósito (si existe) */}
                                <td>
                                    {typeof c.deposito === "number"
                                        ? `$${c.deposito.toLocaleString()}`
                                        : "––"}
                                </td>

                                {/* ID de Propiedad relacionada (si existe) */}
                                <td>{c.propiedad?.idPropiedad ?? "––"}</td>

                                {/* ID de Arrendatario (Persona) relacionada (si existe) */}
                                <td>{c.arrendatario?.idPersona ?? "––"}</td>
                            </tr>
                        ))}

                        {contratos.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center" }}>
                                    No hay contratos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ContratoList;
