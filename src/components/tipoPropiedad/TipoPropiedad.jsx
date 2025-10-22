// TipoPropiedad.jsx
import { useState, useEffect } from "react";
import { getTiposPropiedad } from "../services/TipoPropiedadService";
import "./TipoPropiedad.css";
import {
    FaExclamationTriangle,
    FaTimes,
    FaTrash
} from "react-icons/fa";

export default function TipoPropiedad() {
    const [tipos, setTipos] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tipoToDelete, setTipoToDelete] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getTiposPropiedad();
            setTipos(data);
        } catch (err) {
            console.error("Error cargando tipos de propiedad:", err);
            setMsg("❌ Error cargando tipos de propiedad");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const confirmDelete = (tipo) => {
        setTipoToDelete(tipo);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!tipoToDelete) return;
        try {
            // Aquí deberías tener un servicio deleteTipoPropiedad
            // await deleteTipoPropiedad(tipoToDelete.idTipoPropiedad);
            setMsg("✅ Tipo de propiedad eliminado correctamente");
            setTimeout(() => setMsg(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setMsg("❌ Error eliminando tipo de propiedad");
        } finally {
            closeDeleteModal();
        }
    };

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Tipos de Propiedad</h2>
                <div className="loading">Cargando tipos de propiedad...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Tipos de Propiedad</h2>
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
                        {tipos.length ? (
                            tipos.map((t) => (
                                <tr key={t.idTipoPropiedad}>
                                    <td>{t.idTipoPropiedad}</td>
                                    <td>{t.nombre || "––"}</td>
                                    <td>{t.descripcion || "––"}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn delete-btn" onClick={() => confirmDelete(t)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>
                                    No hay tipos de propiedad registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Eliminar Tipo Propiedad */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar el tipo de propiedad
                            <strong> {tipoToDelete?.nombre}</strong>?
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