import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./Contratos.css";

function ContratoDetail({ contratoId, onClose }) {
    const [contrato, setContrato] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!contratoId) return;

        const fetchContrato = async () => {
            try {
                const response = await api.get(
                    `/contrato-arrendamiento/buscar-por-id/${contratoId}`
                );
                setContrato(response.data);
            } catch (error) {
                console.error("Error obteniendo detalle de contrato", error);
                setErrorMsg("No se pudo obtener el detalle del contrato.");
            }
        };

        fetchContrato();
    }, [contratoId]);

    if (!contratoId) {
        return <div className="empty-detail">Selecciona un contrato para ver.</div>;
    }

    return (
        <div className="contrato-detail">
            <button className="close-btn" onClick={onClose}>
                ✕ Cerrar
            </button>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            {contrato && (
                <div>
                    <h3>Contrato #{contrato.idContratoArrendamiento}</h3>
                    <p>
                        <strong>Propiedad:</strong>{" "}
                        {contrato.propiedad?.idPropiedad || "––"}
                    </p>
                    <p>
                        <strong>Arrendatario:</strong>{" "}
                        {contrato.arrendatario?.idPersona || "––"}
                    </p>
                    <p>
                        <strong>Fecha de Inicio:</strong>{" "}
                        {new Date(contrato.fechaInicio).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Fecha de Fin:</strong>{" "}
                        {new Date(contrato.fechaFin).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Valor:</strong> ${contrato.valor.toLocaleString()}
                    </p>
                    {/* Si hay más campos en el DTO, agrégalos aquí */}
                </div>
            )}
        </div>
    );
}

export default ContratoDetail;
