// EstadoContrato.jsx
import { useState, useEffect } from "react";
import { getEstadosContrato } from "../services/EstadoContratoService";
import "./EstadoContrato.css";
import {
    FaExclamationTriangle,
    FaTimes,
    FaTrash
} from "react-icons/fa";

export default function EstadoContrato() {
    const [estados, setEstados] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [estadoToDelete, setEstadoToDelete] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getEstadosContrato();
            setEstados(data);
        } catch (err) {
            console.error("Error cargando estados de contrato:", err);
            setMsg("❌ Error cargando estados de contrato");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const confirmDelete = (estado) => {
        setEstadoToDelete(estado);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!estadoToDelete) return;
        try {
            // Aquí deberías tener un servicio deleteEstadoContrato
            // await deleteEstadoContrato(estadoToDelete.idEstadoContrato);
            setMsg("✅ Estado de contrato eliminado correctamente");
            setTimeout(() => setMsg(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setMsg("❌ Error eliminando estado de contrato");
        } finally {
            closeDeleteModal();
        }
    };

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Estados de Contrato</h2>
                <div className="loading">Cargando estados de contrato...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Estados de Contrato</h2>
            {msg && <div className="success-message">{msg}</div>}

            <div className="table-container">
                <table className="personas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estados.length ? (
                            estados.map((e) => (
                                <tr key={e.idEstadoContrato}>
                                    <td>{e.idEstadoContrato}</td>
                                    <td>{e.nombre || "––"}</td>
                                    <td>{e.descripcion || "––"}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn delete-btn" onClick={() => confirmDelete(e)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>
                                    No hay estados de contrato registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Eliminar Estado Contrato */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar el estado de contrato
                            <strong> {estadoToDelete?.nombre}</strong>?
                        </p>
                        <p className="warning-text">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="form-actions-compact">
                            <button className="delete-confirm-btn" onClick={handleDelete}>
                                <FaTrash />
                                Eliminar
                            </button>
                            <button className="cancel-btn-compact" onClick={closeDeleteModal}>
                                <FaTimes />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}