// EstadoPropiedad.jsx
import { useState, useEffect } from "react";
import {
    getEstadosPropiedad,
    createEstadoPropiedad,
    updateEstadoPropiedad,
    deleteEstadoPropiedad
} from "../services/EstadoPropiedadService";
import "./EstadoPropiedad.css";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaUser,
    FaUserAlt,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCity,
    FaMapPin,
    FaExclamationTriangle,
    FaSave,
    FaTimes,
    FaClipboardCheck,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

export default function EstadoPropiedad() {
    const [estados, setEstados] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [estadoToEdit, setEstadoToEdit] = useState(null);
    const [estadoToDelete, setEstadoToDelete] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getEstadosPropiedad();
            setEstados(data);
        } catch (err) {
            console.error("Error cargando estados de propiedad:", err);
            setMsg("Error cargando estados de propiedad");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (persona = null) => {
        if (persona) {
            setEstadoToEdit(persona);
            setForm({
                nombre: persona.nombre,
                apellido: persona.apellido,
                telefono: persona.telefono,
                email: persona.email,
                direccion: persona.direccion,
                ciudad: persona.ciudad,
                codigoPostal: persona.codigo_postal,
            });
        } else {
            setEstadoToEdit(null);
            setForm({
                nombre: "",
                apellido: "",
                telefono: "",
                email: "",
                direccion: "",
                ciudad: "",
                codigoPostal: "",
            });
        }
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const openFormModal = (estado = null) => {
        if (estado) {
            setEstadoToEdit(estado);
            setForm({
                nombre: estado.nombre || "",
                descripcion: estado.descripcion || "",
            });
        } else {
            setEstadoToEdit(null);
            setForm({
                nombre: "",
                descripcion: "",
            });
        }
        setFormModalOpen(true);
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
        setEstadoToEdit(null);
        setForm({ nombre: "", descripcion: "" });
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
            };

            if (!payload.nombre) {
                setMsg("El nombre es obligatorio");
                setTimeout(() => setMsg(""), 3000);
                return;
            }

            if (estadoToEdit) {
                // EDITAR
                await updateEstadoPropiedad(estadoToEdit.idEstadoPropiedad, payload);
                setMsg("Estado de propiedad actualizado correctamente");
            } else {
                // CREAR
                await createEstadoPropiedad(payload);
                setMsg("Estado de propiedad creado correctamente");
            }

            setTimeout(() => setMsg(""), 3000);
            closeFormModal();
            loadData();

        } catch (err) {
            console.error(err);
            setMsg("Error procesando la solicitud");
        }
    };


    const confirmDelete = (estado) => {
        setEstadoToDelete(estado);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!estadoToDelete) return;
        try {
            await deleteEstadoPropiedad(estadoToDelete.idEstadoPropiedad);
            setMsg("Estado de propiedad eliminado correctamente");
            setTimeout(() => setMsg(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setMsg("❌ Error eliminando estado de propiedad");
        } finally {
            closeDeleteModal();
        }
    };

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Estados de Propiedad</h2>
                <div className="loading">Cargando estados de propiedad...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Estados de Propiedad</h2>
            {msg && <div className="success-message">{msg}</div>}

            <button className="open-modal-btn" onClick={() => openFormModal()}>
                <FaPlus /> Agregar Estado de Propiedad
            </button>

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
                                <tr key={e.idEstadoPropiedad}>
                                    <td>{e.idEstadoPropiedad}</td>
                                    <td>{e.nombre || "––"}</td>
                                    <td>{e.descripcion || "––"}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn edit-btn" onClick={() => openFormModal(e)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => confirmDelete(e)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>
                                    No hay estados de propiedad registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear/Editar Estado de Propiedad */}
            {formModalOpen && (
                <div className="modal-overlay" onClick={closeFormModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <FaClipboardCheck />
                                {estadoToEdit ? " Editar Estado" : " Crear Estado de Propiedad"}
                            </h3>
                            <button className="close-btn" onClick={closeFormModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form className="compact-form" onSubmit={handleSubmit}>
                            <div className="form-grid-compact">
                                <div className="form-group-compact">
                                    <label>
                                        <FaClipboardCheck />
                                        Nombre
                                    </label>
                                    <input
                                        name="nombre"
                                        type="text"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese el nombre del estado"
                                    />
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaClipboardCheck />
                                        Descripción
                                    </label>
                                    <input
                                        name="descripcion"
                                        type="text"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        placeholder="Ingrese la descripción (opcional)"
                                    />
                                </div>
                            </div>
                            <div className="form-actions-compact">
                                <button type="submit" className="submit-btn-compact">
                                    <FaSave />
                                    {estadoToEdit ? " Guardar" : " Crear"}
                                </button>
                                <button type="button" className="cancel-btn-compact" onClick={closeFormModal}>
                                    <FaTimes />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {estadoToEdit ? <FaEdit /> : <FaUser />}
                                {estadoToEdit ? " Editar Persona" : " Crear Persona"}
                            </h3>
                            <button className="close-btn" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form className="compact-form" onSubmit={handleSubmit}>
                            <div className="form-grid-compact">
                                <div className="form-group-compact">
                                    <label>
                                        <FaClipboardCheck />
                                        Nombre
                                    </label>
                                    <input
                                        name="nombre"
                                        type="text"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese el nombre del estado"
                                    />
                                </div>

                                <div className="form-group-compact">
                                    <label>
                                        <FaClipboardCheck />
                                        Descripción
                                    </label>
                                    <input
                                        name="descripcion"
                                        type="text"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        placeholder="Ingrese la descripción (opcional)"
                                    />
                                </div>
                            </div>
                            <div className="form-actions-compact">
                                <button type="submit" className="submit-btn-compact">
                                    <FaSave />
                                    {estadoToEdit ? " Guardar" : " Crear"}
                                </button>
                                <button type="button" className="cancel-btn-compact" onClick={closeFormModal}>
                                    <FaTimes />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Eliminar Estado de Propiedad */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar el estado de propiedad
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