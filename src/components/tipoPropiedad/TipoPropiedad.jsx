import { useState, useEffect } from "react";
import { getTiposPropiedad, createTipoPropiedad, updateTipoPropiedad, deleteTipoPropiedad } from "../services/TipoPropiedadService";
import "./TipoPropiedad.css";
import {
    FaEdit, FaTrash, FaPlus, FaUser, FaUserAlt, FaMapPin, FaExclamationTriangle,
    FaSave, FaTimes, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

export default function TipoPropiedad() {
    // ===================== ESTADOS =====================
    const [tipos, setTipos] = useState([]); // Lista de tipos de propiedad
    const [modalOpen, setModalOpen] = useState(false);   // Control modal crear/editar
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Control del modal eliminar

    const [tipoToEdit, setTipoPrToEdit] = useState(null); // Tipo propiedad seleccionada para editar
    const [tipoToDelete, setTipoToDelete] = useState(null); // Tipo propiedad seleccionada para eliminar
    const [msg, setMsg] = useState(""); // Mensajes de feedback al usuario

    const [loading, setLoading] = useState(true); // Estado de carga de la pagina

    // Formulario de tipo propiedad - valores iniciales
    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: ""
    });

    // ========== CONFIGURACIONES ==========
    // Definicion de campos del formulario
    const camposFormulario = [
        { name: "nombre", label: "Nombre", icon: <FaUserAlt />, type: "text", placeholder: "Nombre del tipo de propiedad" },
        { name: "descripcion", label: "Descripción", icon: <FaMapPin />, type: "text", placeholder: "Descripción del tipo de propiedad" }
    ];

    // ================= EFECTOS (LIFECYCLE) =================
    // Cargar datos al iniciar el componente
    useEffect(() => {
        cargarTiposPropiedad();
    }, []);

    // ===================== FUNCIONES =====================
    // cargar lista de tipos de propiedad desde la api
    const cargarTiposPropiedad = async () => {
        try {
            setLoading(true); // inicia la carga
            const datos = await getTiposPropiedad();
            setTipos(datos);
        } catch (error) {
            console.error("Error cargando tipos de propiedad: ", error);
            mostrarMensaje("Error cargando datos", "error");
        } finally {
            setLoading(false);
        }
    };

    // ============ FUNCIONES DE MODALES ==============
    // Abrir modal para crear y editar tipo propiedad
    const abrirModal = (tipoPropiedad = null) => {
        if (tipoPropiedad) {
            // Modo edicion: Cargar datos de la propiedad seleccionada
            setTipoPrToEdit(tipoPropiedad);
            setFormulario({
                nombre: tipoPropiedad.nombre,
                descripcion: tipoPropiedad.descripcion,
            });
        } else {
            // Modo crear: limpiar form
            setTipoPrToEdit(null);
            setFormulario({
                nombre: "", descripcion: ""
            });
        }
        setModalOpen(true);
    }

    // Cerrar modal crear / editar
    const cerrarModal = () => setModalOpen(false);

    // Abrir Modal de confirmacion para eliminar
    const confirmarEliminacion = (tipoPropiedad) => {
        setTipoToDelete(tipoPropiedad);
        setDeleteModalOpen(true);
    }

    // Cerrar Modal eliminar
    const cerrarModalEliminar = () => setDeleteModalOpen(false);

    // ============== MANEJO DE FORMULARIO ================
    // Actualizar campo del formulario
    const   manejarCambio = (t) => {
        const { name, value } = t.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    // Enviar formulario (crear o actualizar)
    const manejarEnvio = async (t) => {
        t.preventDefault();
        try {
            // Preparar datos para la API
            const datosEnvio = {
                ...formulario
            };

            if (tipoToEdit) {
                // Actualizar tipo propiedad existente
                await updateTipoPropiedad(tipoToEdit.idTipoPropiedad, datosEnvio);
                mostrarMensaje("Persona actualizada correctamente", "exito");
            } else {
                // Crear nuevo tipo propiedad
                await createTipoPropiedad(datosEnvio);
                mostrarMensaje("Persona creada correctamente", "exito");
            }

            cerrarModal();
            cargarTiposPropiedad(); // Recargar lista

        } catch (error) {
            console.error("Error en operación: ", error);
            mostrarMensaje("Error en la operacion", "error");
        }
    };

    // ============== FUNCIONES DE ELIMINACIÓN ================
    // Ejecutar eliminacion de tipo propiedad
    const manejarEliminacion = async () => {
        if (!tipoToDelete) return;

        try {
            await deleteTipoPropiedad(tipoToDelete.idTipoPropiedad);
            mostrarMensaje("Tipo propiedad eliminado correctamente", "exito");
            cargarTiposPropiedad();
        } catch (error) {
            console.error("Error eliminando: ", error);
            mostrarMensaje("Error eliminando tipo propiedad", "error");
        } finally {
            cerrarModalEliminar();
        }
    };

    // ============== FUNCIONES AUXILIARES =================
    // Mostrar mensajes temporales al usuario
    const mostrarMensaje = (texto, tipo = "exito") => {
        const icono = tipo === "exito"
            ? <FaCheckCircle style={{ color: "#27ae60", marginRight: "6px" }} />
            : <FaTimesCircle style={{ color: "#e74c3c", marginRight: "6px" }} />;

        setMsg(<>{icono}{texto}</>);
        setTimeout(() => setMsg(""), 3000);
    };

    // ======== Carga antes de mostrar los datos ==============
    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Tipos de Propiedad</h2>
                <div className="loading">Cargando tipos de propiedad...</div>
            </div>
        );
    }

    // ===================== RENDERIZADO PRINCIPAL =====================
    return (
        <div className="persona-section">
            {/* HEADER Y BOTÓN PRINCIPAL */}
            <h2 className="section-header">Gestión de Tipos de Propiedad</h2>
            {msg && <div className="success-message">{msg}</div>}

            <button className="open-modal-btn" onClick={() => abrirModal()}>
                <FaPlus /> Agregar Tipo Propiedad
            </button>

            {/* TABLA DE TIPOS DE PROPIEDAD */}
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
                                        <button className="action-btn edit-btn"
                                            onClick={() => abrirModal(t)}
                                            title="Editar Tipo Propiedad">
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => confirmarEliminacion(t)}>
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

            {/* MODAL: CREAR/EDITAR PERSONA */}
            {modalOpen && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {tipoToEdit ? <FaEdit /> : <FaUser />}
                                {tipoToEdit ? " Editar Tipo Propiedad" : " Crear Tipo Propiedad"}
                            </h3>
                            <button className="close-btn" onClick={cerrarModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form className="compact-form" onSubmit={manejarEnvio}>
                            <div className="form-grid-compact">
                                {camposFormulario.map((campo) => (
                                    <div className="form-group-compact" key={campo.name}>
                                        <label>
                                            {campo.icon}
                                            {campo.label}
                                        </label>
                                        <input
                                            name={campo.name}
                                            type={campo.type}
                                            value={formulario[campo.name]}
                                            onChange={manejarCambio}
                                            required
                                            placeholder={`Ingrese ${campo.label.toLowerCase()}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="form-actions-compact">
                                <button type="submit" className="submit-btn-compact">
                                    <FaSave />
                                    {tipoToEdit ? " Guardar" : " Crear"}
                                </button>
                                <button type="button" className="cancel-btn-compact" onClick={cerrarModal}>
                                    <FaTimes />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Eliminar Tipo Propiedad */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={cerrarModalEliminar}>
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
                            <button className="delete-confirm-btn" onClick={manejarEliminacion}>
                                <FaTrash />
                                Eliminar
                            </button>
                            <button className="cancel-btn-compact" onClick={cerrarModalEliminar}>
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