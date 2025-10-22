// Contratos.jsx
import { useState, useEffect } from "react";
import { getContratosArrendamiento, getContratoArrendamientoById } from "../services/ContratoArrendamientoService";
import "./Contratos.css";
import {
    FaEye,
    FaTimes,
    FaFileContract,
    FaCalendarAlt,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaHome,
    FaUser,
    FaDollarSign,
    FaExclamationTriangle
} from "react-icons/fa";

export default function Contratos() {
    const [contratos, setContratos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
    const [contratoToDelete, setContratoToDelete] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getContratosArrendamiento();
            setContratos(data);
        } catch (err) {
            console.error("Error cargando contratos:", err);
            setMsg("❌ Error cargando contratos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = async (contrato) => {
        try {
            // Cargar detalles completos del contrato
            const contratoDetalle = await getContratoArrendamientoById(contrato.idContratoArrendamiento);
            setContratoSeleccionado(contratoDetalle);
            setModalOpen(true);
        } catch (err) {
            console.error("Error cargando detalle del contrato:", err);
            setMsg("❌ Error cargando detalles del contrato");
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setContratoSeleccionado(null);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const confirmDelete = (contrato) => {
        setContratoToDelete(contrato);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!contratoToDelete) return;
        try {
            // Aquí deberías tener un servicio deleteContratoArrendamiento
            // await deleteContratoArrendamiento(contratoToDelete.idContratoArrendamiento);
            setMsg("✅ Contrato eliminado correctamente");
            setTimeout(() => setMsg(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setMsg("❌ Error eliminando contrato");
        } finally {
            closeDeleteModal();
        }
    };

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Contratos de Arrendamiento</h2>
                <div className="loading">Cargando contratos...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Contratos de Arrendamiento</h2>
            {msg && <div className="success-message">{msg}</div>}

            <div className="table-container">
                <table className="personas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Renta Mensual</th>
                            <th>Depósito</th>
                            <th>Propiedad</th>
                            <th>Arrendatario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contratos.length ? (
                            contratos.map((c) => (
                                <tr key={c.idContratoArrendamiento}>
                                    <td>{c.idContratoArrendamiento}</td>
                                    <td>
                                        {c.fechaInicio
                                            ? new Date(c.fechaInicio).toLocaleDateString()
                                            : "––"}
                                    </td>
                                    <td>
                                        {c.fechaFin
                                            ? new Date(c.fechaFin).toLocaleDateString()
                                            : "––"}
                                    </td>
                                    <td>
                                        {typeof c.rentaMensual === "number"
                                            ? `$${c.rentaMensual.toLocaleString()}`
                                            : "––"}
                                    </td>
                                    <td>
                                        {typeof c.deposito === "number"
                                            ? `$${c.deposito.toLocaleString()}`
                                            : "––"}
                                    </td>
                                    <td>{c.propiedad?.direccion ?? "––"}</td>
                                    <td>{c.arrendatario?.nombre ?? "––"}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn view-btn" onClick={() => openModal(c)}>
                                            <FaEye />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => confirmDelete(c)}>
                                            <FaTimes />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>No hay contratos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Ver Detalles del Contrato */}
            {modalOpen && contratoSeleccionado && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <FaFileContract />
                                Detalles del Contrato #{contratoSeleccionado.idContratoArrendamiento}
                            </h3>
                            <button className="close-btn" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="compact-form">
                            <div className="form-grid-compact">
                                {/* Información Básica */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaCalendarAlt />
                                        Fecha de Inicio
                                    </label>
                                    <div className="detail-value">
                                        {contratoSeleccionado.fechaInicio
                                            ? new Date(contratoSeleccionado.fechaInicio).toLocaleDateString()
                                            : "No especificada"}
                                    </div>
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaCalendarCheck />
                                        Fecha de Fin
                                    </label>
                                    <div className="detail-value">
                                        {contratoSeleccionado.fechaFin
                                            ? new Date(contratoSeleccionado.fechaFin).toLocaleDateString()
                                            : "No especificada"}
                                    </div>
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaMoneyBillWave />
                                        Renta Mensual
                                    </label>
                                    <div className="detail-value">
                                        {typeof contratoSeleccionado.rentaMensual === "number"
                                            ? `$${contratoSeleccionado.rentaMensual.toLocaleString()}`
                                            : "No especificada"}
                                    </div>
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaDollarSign />
                                        Depósito
                                    </label>
                                    <div className="detail-value">
                                        {typeof contratoSeleccionado.deposito === "number"
                                            ? `$${contratoSeleccionado.deposito.toLocaleString()}`
                                            : "No especificada"}
                                    </div>
                                </div>

                                {/* Información de Propiedad */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaHome />
                                        Propiedad
                                    </label>
                                    <div className="detail-value">
                                        {contratoSeleccionado.propiedad ? (
                                            <>
                                                <div><strong>ID:</strong> {contratoSeleccionado.propiedad.idPropiedad}</div>
                                                <div><strong>Dirección:</strong> {contratoSeleccionado.propiedad.direccion}</div>
                                                <div><strong>Ciudad:</strong> {contratoSeleccionado.propiedad.ciudad}</div>
                                            </>
                                        ) : "No especificada"}
                                    </div>
                                </div>

                                {/* Información del Arrendatario */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaUser />
                                        Arrendatario
                                    </label>
                                    <div className="detail-value">
                                        {contratoSeleccionado.arrendatario ? (
                                            <>
                                                <div><strong>ID:</strong> {contratoSeleccionado.arrendatario.idPersona}</div>
                                                <div><strong>Nombre:</strong> {contratoSeleccionado.arrendatario.nombre} {contratoSeleccionado.arrendatario.apellido}</div>
                                                <div><strong>Email:</strong> {contratoSeleccionado.arrendatario.email}</div>
                                                <div><strong>Teléfono:</strong> {contratoSeleccionado.arrendatario.telefono}</div>
                                            </>
                                        ) : "No especificado"}
                                    </div>
                                </div>

                                {/* Información del Propietario (si está disponible) */}
                                {contratoSeleccionado.propiedad?.propietario && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaUser />
                                            Propietario
                                        </label>
                                        <div className="detail-value">
                                            <div><strong>ID:</strong> {contratoSeleccionado.propiedad.propietario.idPersona}</div>
                                            <div><strong>Nombre:</strong> {contratoSeleccionado.propiedad.propietario.nombre} {contratoSeleccionado.propiedad.propietario.apellido}</div>
                                            <div><strong>Email:</strong> {contratoSeleccionado.propiedad.propietario.email}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Campos adicionales que puedan existir */}
                                {contratoSeleccionado.valor && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaDollarSign />
                                            Valor Total
                                        </label>
                                        <div className="detail-value">
                                            ${contratoSeleccionado.valor.toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {contratoSeleccionado.estadoContrato && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaFileContract />
                                            Estado del Contrato
                                        </label>
                                        <div className="detail-value">
                                            {contratoSeleccionado.estadoContrato.descripcion}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="form-actions-compact">
                                <button type="button" className="cancel-btn-compact" onClick={closeModal}>
                                    <FaTimes />
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Eliminar Contrato */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar el contrato
                            <strong> #{contratoToDelete?.idContratoArrendamiento}</strong>?
                        </p>
                        <p className="warning-text">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="form-actions-compact">
                            <button className="delete-confirm-btn" onClick={handleDelete}>
                                <FaTimes />
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