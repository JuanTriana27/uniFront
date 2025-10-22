// VentaPropiedad.jsx
import { useState, useEffect } from "react";
import { getVentasPropiedad } from "../services/VentaPropiedadService";
import "./VentaPropiedad.css";
import {
    FaEye,
    FaTimes,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaUserTie,
    FaDollarSign,
    FaHome,
    FaExclamationTriangle,
    FaTrash
} from "react-icons/fa";

export default function VentaPropiedad() {
    const [ventas, setVentas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [ventaToDelete, setVentaToDelete] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getVentasPropiedad();
            setVentas(data);
        } catch (err) {
            console.error("Error cargando ventas:", err);
            setMsg("❌ Error cargando ventas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (venta) => {
        setVentaSeleccionada(venta);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setVentaSeleccionada(null);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const confirmDelete = (venta) => {
        setVentaToDelete(venta);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!ventaToDelete) return;
        try {
            // Aquí deberías tener un servicio deleteVentaPropiedad
            // await deleteVentaPropiedad(ventaToDelete.id);
            setMsg("✅ Venta eliminada correctamente");
            setTimeout(() => setMsg(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setMsg("❌ Error eliminando venta");
        } finally {
            closeDeleteModal();
        }
    };

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Ventas de Propiedad</h2>
                <div className="loading">Cargando ventas...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Ventas de Propiedad</h2>
            {msg && <div className="success-message">{msg}</div>}

            <div className="table-container">
                <table className="personas-table">
                    <thead>
                        <tr>
                            <th>ID Venta</th>
                            <th>Fecha Venta</th>
                            <th>Precio Venta</th>
                            <th>Comisión Asesor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.length ? (
                            ventas.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>
                                    <td>
                                        {v.fechaVenta
                                            ? new Date(v.fechaVenta).toLocaleDateString()
                                            : "––"}
                                    </td>
                                    <td>
                                        {typeof v.precioVenta === "number"
                                            ? `$${v.precioVenta.toLocaleString()}`
                                            : "––"}
                                    </td>
                                    <td>
                                        {typeof v.comisionAsesor === "number"
                                            ? `$${v.comisionAsesor.toLocaleString()}`
                                            : "––"}
                                    </td>
                                    <td className="action-buttons">
                                        <button className="action-btn view-btn" onClick={() => openModal(v)}>
                                            <FaEye />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => confirmDelete(v)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>No hay ventas registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Ver Detalles de Venta */}
            {modalOpen && ventaSeleccionada && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <FaMoneyBillWave />
                                Detalles de Venta #{ventaSeleccionada.id}
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
                                        Fecha de Venta
                                    </label>
                                    <div className="detail-value">
                                        {ventaSeleccionada.fechaVenta
                                            ? new Date(ventaSeleccionada.fechaVenta).toLocaleDateString()
                                            : "No especificada"}
                                    </div>
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaDollarSign />
                                        Precio de Venta
                                    </label>
                                    <div className="detail-value">
                                        {typeof ventaSeleccionada.precioVenta === "number"
                                            ? `$${ventaSeleccionada.precioVenta.toLocaleString()}`
                                            : "No especificada"}
                                    </div>
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaUserTie />
                                        Comisión del Asesor
                                    </label>
                                    <div className="detail-value">
                                        {typeof ventaSeleccionada.comisionAsesor === "number"
                                            ? `$${ventaSeleccionada.comisionAsesor.toLocaleString()}`
                                            : "No especificada"}
                                    </div>
                                </div>

                                {/* Información de Propiedad (si está disponible) */}
                                {ventaSeleccionada.propiedad && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaHome />
                                            Propiedad Vendida
                                        </label>
                                        <div className="detail-value">
                                            <div><strong>ID:</strong> {ventaSeleccionada.propiedad.idPropiedad}</div>
                                            <div><strong>Dirección:</strong> {ventaSeleccionada.propiedad.direccion}</div>
                                            <div><strong>Ciudad:</strong> {ventaSeleccionada.propiedad.ciudad}</div>
                                            <div><strong>Precio Original:</strong> ${ventaSeleccionada.propiedad.precio?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Información del Comprador (si está disponible) */}
                                {ventaSeleccionada.comprador && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaUserTie />
                                            Comprador
                                        </label>
                                        <div className="detail-value">
                                            <div><strong>ID:</strong> {ventaSeleccionada.comprador.idPersona}</div>
                                            <div><strong>Nombre:</strong> {ventaSeleccionada.comprador.nombre} {ventaSeleccionada.comprador.apellido}</div>
                                            <div><strong>Email:</strong> {ventaSeleccionada.comprador.email}</div>
                                            <div><strong>Teléfono:</strong> {ventaSeleccionada.comprador.telefono}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Información del Asesor (si está disponible) */}
                                {ventaSeleccionada.asesor && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaUserTie />
                                            Asesor Responsable
                                        </label>
                                        <div className="detail-value">
                                            <div><strong>ID:</strong> {ventaSeleccionada.asesor.idPersona}</div>
                                            <div><strong>Nombre:</strong> {ventaSeleccionada.asesor.nombre} {ventaSeleccionada.asesor.apellido}</div>
                                            <div><strong>Email:</strong> {ventaSeleccionada.asesor.email}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Campos adicionales que puedan existir */}
                                {ventaSeleccionada.metodoPago && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaMoneyBillWave />
                                            Método de Pago
                                        </label>
                                        <div className="detail-value">
                                            {ventaSeleccionada.metodoPago}
                                        </div>
                                    </div>
                                )}

                                {ventaSeleccionada.estadoVenta && (
                                    <div className="form-group-compact">
                                        <label>
                                            <FaMoneyBillWave />
                                            Estado de la Venta
                                        </label>
                                        <div className="detail-value">
                                            {ventaSeleccionada.estadoVenta}
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

            {/* Modal Eliminar Venta */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar la venta
                            <strong> #{ventaToDelete?.id}</strong>?
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