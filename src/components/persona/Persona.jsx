import { useState, useEffect } from "react";
import { getPersonas, createPersona, updatePersona, deletePersona } from "../services/personaService";
import "./Personas.css";
import {
    FaEdit, FaTrash, FaPlus, FaUser, FaUserAlt, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaCity, FaMapPin, FaExclamationTriangle,
    FaSave, FaTimes, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

export default function Personas() {
    // ===================== ESTADOS PRINCIPALES =====================
    const [personas, setPersonas] = useState([]);        // Lista de personas
    const [modalOpen, setModalOpen] = useState(false);   // Control modal crear/editar
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Control modal eliminar

    const [personaToEdit, setPersonaToEdit] = useState(null);      // Persona seleccionada para editar
    const [personaToDelete, setPersonaToDelete] = useState(null);  // Persona seleccionada para eliminar
    const [mensaje, setMensaje] = useState("");          // Mensajes de feedback al usuario

    const [loading, setLoading] = useState(true); // Estado de carga de la pagina

    // Formulario de persona - valores iniciales
    const [formulario, setFormulario] = useState({
        nombre: "", apellido: "", telefono: "", email: "",
        direccion: "", ciudad: "", codigoPostal: ""
    });

    // ===================== CONFIGURACIONES =====================
    // Definición de campos del formulario (reutilizable)
    const camposFormulario = [
        { name: "nombre", label: "Nombre", icon: <FaUser />, type: "text" },
        { name: "apellido", label: "Apellido", icon: <FaUserAlt />, type: "text" },
        { name: "telefono", label: "Teléfono", icon: <FaPhone />, type: "tel" },
        { name: "email", label: "Email", icon: <FaEnvelope />, type: "email" },
        { name: "direccion", label: "Dirección", icon: <FaMapMarkerAlt />, type: "text" },
        { name: "ciudad", label: "Ciudad", icon: <FaCity />, type: "text" },
        { name: "codigoPostal", label: "Código Postal", icon: <FaMapPin />, type: "number" },
    ];

    // ===================== EFECTOS (LIFECYCLE) =====================
    // Cargar datos al iniciar el componente
    useEffect(() => {
        cargarPersonas();
    }, []);

    // ===================== FUNCIONES DE DATOS =====================
    // Cargar lista de personas desde la API
    const cargarPersonas = async () => {
        try {
            setLoading(true); // inicia carga
            const datos = await getPersonas();
            setPersonas(datos);
        } catch (error) {
            console.error("Error cargando personas:", error);
            mostrarMensaje("Error cargando datos", "error");
        } finally {
            setLoading(false);
        }
    };

    // ===================== FUNCIONES DE MODALES =====================
    // Abrir modal para crear o editar persona
    const abrirModal = (persona = null) => {
        if (persona) {
            // Modo edición: Cargar datos de la persona seleccionada
            setPersonaToEdit(persona);
            setFormulario({
                nombre: persona.nombre,
                apellido: persona.apellido,
                telefono: persona.telefono,
                email: persona.email,
                direccion: persona.direccion,
                ciudad: persona.ciudad,
                codigoPostal: persona.codigo_postal,
            });
        } else {
            // Modo creación: limpiar formulario
            setPersonaToEdit(null);
            setFormulario({
                nombre: "", apellido: "", telefono: "", email: "",
                direccion: "", ciudad: "", codigoPostal: ""
            });
        }
        setModalOpen(true);
    };

    // Cerrar modal de crear/editar
    const cerrarModal = () => setModalOpen(false);

    // Abrir modal de confirmación para eliminar
    const confirmarEliminacion = (persona) => {
        setPersonaToDelete(persona);
        setDeleteModalOpen(true);
    };

    // Cerrar modal de eliminar
    const cerrarModalEliminar = () => setDeleteModalOpen(false);

    // ===================== MANEJO DE FORMULARIO =====================
    // Actualizar campo del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    // Enviar formulario (crear o actualizar)
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            // Preparar datos para la API (ajustar nombres de campos si es necesario)
            const datosEnvio = {
                ...formulario,
                codigo_postal: Number(formulario.codigoPostal)
            };

            if (personaToEdit) {
                // Actualizar persona existente
                await updatePersona(personaToEdit.idPersona, datosEnvio);
                mostrarMensaje("Persona actualizada correctamente", "exito");
            } else {
                // Crear nueva persona
                await createPersona(datosEnvio);
                mostrarMensaje("Persona creada correctamente", "exito");
            }

            cerrarModal();
            cargarPersonas(); // Recargar lista actualizada

        } catch (error) {
            console.error("Error en operación:", error);
            mostrarMensaje("Error en la operación", "error");
        }
    };

    // ===================== FUNCIONES DE ELIMINACIÓN =====================
    // Ejecutar eliminación de persona
    const manejarEliminacion = async () => {
        if (!personaToDelete) return;

        try {
            await deletePersona(personaToDelete.idPersona);
            mostrarMensaje("Persona eliminada correctamente", "exito");
            cargarPersonas(); // Recargar lista actualizada
        } catch (error) {
            console.error("Error eliminando:", error);
            mostrarMensaje("Error eliminando persona", "error");
        } finally {
            cerrarModalEliminar();
        }
    };

    // ===================== FUNCIONES AUXILIARES =====================
    // Mostrar mensajes temporales al usuario
    const mostrarMensaje = (texto, tipo = "exito") => {
        const icono = tipo === "exito"
            ? <FaCheckCircle style={{ color: "#27ae60", marginRight: "6px" }} />
            : <FaTimesCircle style={{ color: "#e74c3c", marginRight: "6px" }} />;

        setMensaje(<>{icono} {texto}</>);
        setTimeout(() => setMensaje(""), 3000);
    };

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Personas</h2>
                <div className="loading">Cargando Personas...</div>
            </div>
        );
    }

    // ===================== RENDERIZADO PRINCIPAL =====================
    return (
        <div className="persona-section">
            {/* HEADER Y BOTÓN PRINCIPAL */}
            <h2 className="section-header">Gestión de Personas</h2>
            {mensaje && <div className="success-message">{mensaje}</div>}

            <button className="open-modal-btn" onClick={() => abrirModal()}>
                <FaPlus /> Agregar Persona
            </button>

            {/* TABLA DE PERSONAS */}
            <div className="table-container">
                <table className="personas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Ciudad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.length ? (
                            personas.map((persona) => (
                                <tr key={persona.idPersona}>
                                    <td>{persona.idPersona}</td>
                                    <td>{persona.nombre}</td>
                                    <td>{persona.apellido}</td>
                                    <td>{persona.telefono}</td>
                                    <td>{persona.email}</td>
                                    <td>{persona.ciudad}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn edit-btn"
                                            onClick={() => abrirModal(persona)}
                                            title="Editar persona">
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete-btn"
                                            onClick={() => confirmarEliminacion(persona)}
                                            title="Eliminar persona">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center" }}>
                                    No hay personas registradas.
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
                                {personaToEdit ? <FaEdit /> : <FaUser />}
                                {personaToEdit ? " Editar Persona" : " Crear Persona"}
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
                                    {personaToEdit ? " Guardar" : " Crear"}
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

            {/* MODAL: CONFIRMAR ELIMINACIÓN */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={cerrarModalEliminar}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de eliminar a{" "}
                            <strong>{personaToDelete?.nombre} {personaToDelete?.apellido}</strong>?
                        </p>
                        <p className="warning-text">
                            ⚠️ Esta acción no se puede deshacer.
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