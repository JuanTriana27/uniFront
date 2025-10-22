// Personas.jsx (sin animaciones)
import { useState, useEffect } from "react";
import { getPersonas, createPersona, updatePersona, deletePersona } from "../services/personaService";
import "./Personas.css";
import "@fortawesome/fontawesome-free"
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
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

export default function Personas() {
    const [personas, setPersonas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [personaToEdit, setPersonaToEdit] = useState(null);
    const [personaToDelete, setPersonaToDelete] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
    });
    const [msg, setMsg] = useState("");

    const loadPersonas = async () => {
        try {
            const data = await getPersonas();
            setPersonas(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPersonas();
    }, []);

    const openModal = (persona = null) => {
        if (persona) {
            setPersonaToEdit(persona);
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
            setPersonaToEdit(null);
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
    const closeDeleteModal = () => setDeleteModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, codigo_postal: Number(form.codigoPostal) };
            if (personaToEdit) {
                await updatePersona(personaToEdit.idPersona, payload);
                setMsg(<><FaCheckCircle style={{ color: "#27ae60", marginRight: "6px" }} /> Persona actualizada correctamente</>);
            } else {
                await createPersona(payload);
                setMsg(<><FaCheckCircle style={{ color: "#27ae60", marginRight: "6px" }} /> Persona creada correctamente</>);
            }
            setTimeout(() => setMsg(""), 3000);
            closeModal();
            loadPersonas();
        } catch (err) {
            console.error(err);
            setMsg(<><FaTimesCircle style={{ color: "#e74c3c", marginRight: "6px" }} /> Error en la operación</>);
        }
    };


    const confirmDelete = (persona) => {
        setPersonaToDelete(persona);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!personaToDelete) return;
        try {
            await deletePersona(personaToDelete.idPersona);
            setMsg("✅ Persona eliminada correctamente");
            setTimeout(() => setMsg(""), 3000);
            loadPersonas();
        } catch (err) {
            console.error(err);
        } finally {
            closeDeleteModal();
        }
    };

    // Configuración de campos del formulario con iconos
    const formFields = [
        { name: "nombre", label: "Nombre", icon: <FaUser />, type: "text" },
        { name: "apellido", label: "Apellido", icon: <FaUserAlt />, type: "text" },
        { name: "telefono", label: "Teléfono", icon: <FaPhone />, type: "tel" },
        { name: "email", label: "Email", icon: <FaEnvelope />, type: "email" },
        { name: "direccion", label: "Dirección", icon: <FaMapMarkerAlt />, type: "text" },
        { name: "ciudad", label: "Ciudad", icon: <FaCity />, type: "text" },
        { name: "codigoPostal", label: "Código Postal", icon: <FaMapPin />, type: "number" },
    ];

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Personas</h2>
            {msg && <div className="success-message">{msg}</div>}

            <button className="open-modal-btn" onClick={() => openModal()}>
                <FaPlus /> Agregar Persona
            </button>

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
                            personas.map((p) => (
                                <tr key={p.idPersona}>
                                    <td>{p.idPersona}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.apellido}</td>
                                    <td>{p.telefono}</td>
                                    <td>{p.email}</td>
                                    <td>{p.ciudad}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn edit-btn" onClick={() => openModal(p)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => confirmDelete(p)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center" }}>No hay personas registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {personaToEdit ? <FaEdit /> : <FaUser />}
                                {personaToEdit ? " Editar Persona" : " Crear Persona"}
                            </h3>
                            <button className="close-btn" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form className="compact-form" onSubmit={handleSubmit}>
                            <div className="form-grid-compact">
                                {formFields.map((field) => (
                                    <div className="form-group-compact" key={field.name}>
                                        <label>
                                            {field.icon}
                                            {field.label}
                                        </label>
                                        <input
                                            name={field.name}
                                            type={field.type}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            required
                                            placeholder={`Ingrese ${field.label.toLowerCase()}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="form-actions-compact">
                                <button type="submit" className="submit-btn-compact">
                                    <FaSave />
                                    {personaToEdit ? " Guardar" : " Crear"}
                                </button>
                                <button type="button" className="cancel-btn-compact" onClick={closeModal}>
                                    <FaTimes />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar a
                            <strong> {personaToDelete?.nombre} {personaToDelete?.apellido}</strong>?
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