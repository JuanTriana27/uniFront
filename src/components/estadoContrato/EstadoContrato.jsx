import { useState, useEffect } from "react";
import { createEstadoContrato, deleteEstadoContrato, getEstadosContrato, updateEstadoContrato } from "../services/EstadoContratoService";
import "./EstadoContrato.css";
import {
    FaEdit, FaTrash, FaPlus, FaUser, FaUserAlt, FaMapPin, FaExclamationTriangle,
    FaSave, FaTimes, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

export default function EstadoContrato() {
    // =============== ESTADOS ===============
    const [estados, setEstados] = useState([]); // Lista de estados de contrato
    const [modalOpen, setModalOpen] = useState(false);   // Control modal crear/editar
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);// Control del modal eliminar

    const [estadoContratoToEdit, setEstadoContratoToEdit] = useState(null); // Estado Contrato seleccionada para editar
    const [estadoToDelete, setEstadoToDelete] = useState(null); // Estado contrato seleccionado para eliminar
    const [msg, setMsg] = useState(""); // Mensajes de feedback al usuario

    const [loading, setLoading] = useState(true); // Estado de carga de la pagina

    // Formulario de estado contrato - valores iniciales
    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: ""
    });

    // ========== CONFIGURACIONES ==========
    // Definicion de campos del formulario
    const camposFormulario = [
        { name: "nombre", label: "Nombre", icon: <FaUserAlt />, type: "text", placeholder: "Nombre del estado de contrato" },
        { name: "descripcion", label: "Descripción", icon: <FaMapPin />, type: "text", placeholder: "Descripción del estado de contrato" }
    ];

    // ================= EFECTOS (LIFECYCLE) =================
    // Cargar datos al iniciar el componente
    useEffect(() => {
        cargarEstadosContrato();
    }, []);

    // ===================== FUNCIONES =====================
    // cargar estado de contrato desde la api
    const cargarEstadosContrato = async () => {
        try {
            setLoading(true);
            const data = await getEstadosContrato();
            setEstados(data);
        } catch (err) {
            console.error("Error cargando estados de contrato:", err);
            setMsg("Error cargando estados de contrato");
        } finally {
            setLoading(false);
        }
    };

    // ============ FUNCIONES DE MODALES ==============
    // Abrir modal para crear y editar estado contrato
    const abrirModal = (estadoContrato = null) => {
        if (estadoContrato) {
            // Modo edicion: Cargar datos del estado contrato
            setEstadoContratoToEdit(estadoContrato);
            setFormulario({
                nombre: estadoContrato.nombre,
                descripcion: estadoContrato.descripcion,
            });
        } else {
            // Modo crear: limpiar form
            setEstadoContratoToEdit(null);
            setFormulario({
                nombre: "", descripcion: ""
            });
        }
        setModalOpen(true);
    }

    // Cerrar modal crear / editar
    const cerrarModal = () => setModalOpen(false);

    // Abrir Modal de confirmacion para eliminar
    const confirmarEliminacion = (estadoContrato) => {
        setEstadoToDelete(estadoContrato);
        setDeleteModalOpen(true);
    }

    // Cerrar Modal eliminar
    const cerrarModalEliminar = () => setDeleteModalOpen(false);

    // ============== MANEJO DE FORMULARIO ================
    // Actualizar campo del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    // Enviar formulario (crear o actualizar)
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            // Preparar datos para la API
            const datosEnvio = {
                ...formulario
            };

            if (estadoContratoToEdit) {
                // Actualizar tipo contrato existente
                await updateEstadoContrato(estadoContratoToEdit.idEstadoContrato, datosEnvio);
                mostrarMensaje("Estado Contrato actualizado correctamente", "exito");
            } else {
                // Crear nuevo tipo contrato
                await createEstadoContrato(datosEnvio);
                mostrarMensaje("Estado Contrato creado correctamente", "exito");
            }

            cerrarModal();
            cargarEstadosContrato(); // Recargar lista

        } catch (error) {
            console.error("Error en operación: ", error);
            mostrarMensaje("Error en la operacion", "error");
        }
    };

    // ============== FUNCIONES DE ELIMINACIÓN ================
    // Ejecutar eliminacion de estado contrato
    const manejarEliminacion = async () => {
        if (!estadoToDelete) return;

        try {
            await deleteEstadoContrato(estadoToDelete.idEstadoContrato);
            mostrarMensaje("Estado Contrato eliminado correctamente", "exito");
            cargarEstadosContrato();
        } catch (error) {
            console.error("Error eliminando: ", error);
            mostrarMensaje("Error eliminando Estado Contrato", "error");
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
                <h2 className="section-header">Gestión de Estados de Contrato</h2>
                <div className="loading">Cargando estados de contrato...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Estados de Contrato</h2>
            {msg && <div className="success-message">{msg}</div>}

            <button className="open-modal-btn" onClick={() => abrirModal()}>
                <FaPlus /> Agregar Estado Contrato
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
                                <tr key={e.idEstadoContrato}>
                                    <td>{e.idEstadoContrato}</td>
                                    <td>{e.nombre || "––"}</td>
                                    <td>{e.descripcion || "––"}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn edit-btn"
                                            onClick={() => abrirModal(e)}
                                            title="Editar Estado Contrato">
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => confirmarEliminacion(e)}>
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

            {/* MODAL: CREAR/EDITAR PERSONA */}
            {modalOpen && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {estadoContratoToEdit ? <FaEdit /> : <FaUser />}
                                {estadoContratoToEdit ? " Editar Estado Contrato" : " Crear Estado Contrato"}
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
                                    {estadoContratoToEdit ? " Guardar" : " Crear"}
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

            {/* Modal Eliminar Estado Contrato */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={cerrarModalEliminar}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar el estado contrato
                            <strong> {estadoToDelete?.nombre}</strong>?
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