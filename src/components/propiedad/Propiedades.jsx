// Propiedades.jsx - CORREGIDO (sin variable no utilizada)
import { useState, useEffect } from "react";
import { getPersonas } from "../services/personaService";
import { getTiposPropiedad } from "../services/TipoPropiedadService";
import { getEstadosPropiedad } from "../services/EstadoPropiedadService";
import {
    getPropiedades,
    createPropiedad,
    updatePropiedad,
    deletePropiedad
} from "../services/PropiedadService";
import "./Propiedades.css";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaHome,
    FaMapMarkerAlt,
    FaCity,
    FaMapPin,
    FaRulerCombined,
    FaBed,
    FaBath,
    FaDollarSign,
    FaUser,
    FaUserTie,
    FaBuilding,
    FaClipboardCheck,
    FaExclamationTriangle,
    FaSave,
    FaTimes,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

export default function Propiedades() {
    const [propiedades, setPropiedades] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propiedadToEdit, setPropiedadToEdit] = useState(null);
    const [propiedadToDelete, setPropiedadToDelete] = useState(null);
    const [form, setForm] = useState({
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        metrosCuadrados: "",
        habitaciones: "",
        banos: "",
        precio: "",
        idPropietario: "",
        idAsesor: "",
        idTipoPropiedad: "",
        idEstadoPropiedad: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);
    // Eliminada la variable personas que no se usaba
    const [tiposPropiedad, setTiposPropiedad] = useState([]);
    const [estadosPropiedad, setEstadosPropiedad] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [asesores, setAsesores] = useState([]);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const [propiedadesData, personasData, tiposData, estadosData] = await Promise.all([
                getPropiedades(),
                getPersonas(),
                getTiposPropiedad(),
                getEstadosPropiedad()
            ]);

            //console.log("Personas cargadas:", personasData);
            //console.log("Tipos de propiedad:", tiposData);
            //console.log("Estados de propiedad:", estadosData);

            setPropiedades(propiedadesData);
            // No guardamos personas en el estado ya que no se usa directamente
            setTiposPropiedad(tiposData);
            setEstadosPropiedad(estadosData);

            // Filtrar propietarios y asesores - MÚLTIPLES FORMAS DE FILTRAR
            const propietariosFiltrados = personasData.filter(p => {
                // Diferentes formas en que podría venir el tipo de persona
                return p.tipoPersona === 'PROPIETARIO' ||
                    p.tipoPersona === 'Propietario' ||
                    p.tipoPersona === 'propietario' ||
                    p.tipoPersona?.toUpperCase() === 'PROPIETARIO' ||
                    p.rol === 'PROPIETARIO' ||
                    p.tipo === 'PROPIETARIO';
            });

            const asesoresFiltrados = personasData.filter(p => {
                return p.tipoPersona === 'ASESOR' ||
                    p.tipoPersona === 'Asesor' ||
                    p.tipoPersona === 'asesor' ||
                    p.tipoPersona?.toUpperCase() === 'ASESOR' ||
                    p.rol === 'ASESOR' ||
                    p.tipo === 'ASESOR';
            });

            // Si no encontramos con los filtros anteriores, mostramos todas las personas
            if (propietariosFiltrados.length === 0) {
                console.warn("No se encontraron propietarios con el filtro, mostrando todas las personas");
                setPropietarios(personasData);
            } else {
                setPropietarios(propietariosFiltrados);
            }

            if (asesoresFiltrados.length === 0) {
                console.warn("No se encontraron asesores con el filtro, mostrando todas las personas");
                setAsesores(personasData);
            } else {
                setAsesores(asesoresFiltrados);
            }

        } catch (err) {
            console.error("Error cargando datos:", err);
            setMsg("❌ Error cargando datos");

            // En caso de error, usar arrays vacíos para evitar errores
            setPropietarios([]);
            setAsesores([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (propiedad = null) => {
        if (propiedad) {
            setPropiedadToEdit(propiedad);
            setForm({
                direccion: propiedad.direccion || "",
                ciudad: propiedad.ciudad || "",
                codigoPostal: propiedad.codigoPostal || "",
                metrosCuadrados: propiedad.metrosCuadrados?.toString() || "",
                habitaciones: propiedad.habitaciones?.toString() || "",
                banos: propiedad.banos?.toString() || "",
                precio: propiedad.precio?.toString() || "",
                idPropietario: propiedad.propietario?.idPersona?.toString() ||
                    propiedad.idPropietario?.toString() || "",
                idAsesor: propiedad.asesor?.idPersona?.toString() ||
                    propiedad.idAsesor?.toString() || "",
                idTipoPropiedad: propiedad.tipoPropiedad?.idTipoPropiedad?.toString() ||
                    propiedad.idTipoPropiedad?.toString() || "",
                idEstadoPropiedad: propiedad.estadoPropiedad?.idEstadoPropiedad?.toString() ||
                    propiedad.idEstadoPropiedad?.toString() || "",
            });
        } else {
            setPropiedadToEdit(null);
            setForm({
                direccion: "",
                ciudad: "",
                codigoPostal: "",
                metrosCuadrados: "",
                habitaciones: "",
                banos: "",
                precio: "",
                idPropietario: "",
                idAsesor: "",
                idTipoPropiedad: "",
                idEstadoPropiedad: "",
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
            // Validar que todos los campos requeridos estén llenos
            if (!form.idPropietario || !form.idAsesor || !form.idTipoPropiedad || !form.idEstadoPropiedad) {
                setMsg("❌ Todos los campos son requeridos");
                setTimeout(() => setMsg(""), 3000);
                return;
            }

            const payload = {
                direccion: form.direccion,
                ciudad: form.ciudad,
                codigoPostal: form.codigoPostal,
                metrosCuadrados: Number(form.metrosCuadrados),
                habitaciones: Number(form.habitaciones),
                banos: Number(form.banos),
                precio: Number(form.precio),
                idPropietario: Number(form.idPropietario),
                idAsesor: Number(form.idAsesor),
                idTipoPropiedad: Number(form.idTipoPropiedad),
                idEstadoPropiedad: Number(form.idEstadoPropiedad),
            };

            console.log("Enviando payload:", payload);

            if (propiedadToEdit) {
                await updatePropiedad(propiedadToEdit.idPropiedad, payload);
                setMsg(
                    <span className="msg-success">
                        <FaCheckCircle style={{ marginRight: "5px" }} /> Propiedad actualizada correctamente
                    </span>
                );
            } else {
                await createPropiedad(payload);
                setMsg(
                    <span className="msg-success">
                        <FaCheckCircle style={{ marginRight: "5px" }} /> Propiedad creada correctamente
                    </span>
                );
            }

            setTimeout(() => setMsg(""), 3000);
            closeModal();
            loadData();
        } catch (err) {
            console.error("Error detallado:", err);
            setMsg(
                <span className="msg-error">
                    <FaTimesCircle style={{ marginRight: "5px" }} /> Error en la operación: {err.response?.data?.message || err.message}
                </span>
            );
        }
    };

    const confirmDelete = (propiedad) => {
        setPropiedadToDelete(propiedad);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!propiedadToDelete) return;
        try {
            await deletePropiedad(propiedadToDelete.idPropiedad);
            setMsg(
                <span className="msg-success">
                    <FaCheckCircle style={{ marginRight: "5px" }} /> Propiedad eliminada correctamente
                </span>
            );
            setTimeout(() => setMsg(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setMsg(
                <span className="msg-error">
                    <FaTimesCircle style={{ marginRight: "5px" }} /> Error eliminando propiedad
                </span>
            );
        } finally {
            closeDeleteModal();
        }
    };

    // Configuración de campos del formulario con iconos
    const formFields = [
        { name: "direccion", label: "Dirección", icon: <FaMapMarkerAlt />, type: "text" },
        { name: "ciudad", label: "Ciudad", icon: <FaCity />, type: "text" },
        { name: "codigoPostal", label: "Código Postal", icon: <FaMapPin />, type: "text" },
        { name: "metrosCuadrados", label: "Metros Cuadrados", icon: <FaRulerCombined />, type: "number" },
        { name: "habitaciones", label: "Habitaciones", icon: <FaBed />, type: "number" },
        { name: "banos", label: "Baños", icon: <FaBath />, type: "number" },
        { name: "precio", label: "Precio", icon: <FaDollarSign />, type: "number" },
    ];

    if (loading) {
        return (
            <div className="persona-section">
                <h2 className="section-header">Gestión de Propiedades</h2>
                <div className="loading">Cargando propiedades...</div>
            </div>
        );
    }

    return (
        <div className="persona-section">
            <h2 className="section-header">Gestión de Propiedades</h2>
            {msg && <div className="success-message">{msg}</div>}

            <button className="open-modal-btn" onClick={() => openModal()}>
                <FaPlus /> Agregar Propiedad
            </button>

            <div className="table-container">
                <table className="personas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>M²</th>
                            <th>Hab.</th>
                            <th>Baños</th>
                            <th>Precio</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propiedades.length ? (
                            propiedades.map((p) => (
                                <tr key={p.idPropiedad}>
                                    <td>{p.idPropiedad}</td>
                                    <td>{p.direccion}</td>
                                    <td>{p.ciudad}</td>
                                    <td>{p.metrosCuadrados}</td>
                                    <td>{p.habitaciones}</td>
                                    <td>{p.banos}</td>
                                    <td>${p.precio?.toLocaleString()}</td>
                                    <td>{p.tipoPropiedad?.descripcion}</td>
                                    <td>{p.estadoPropiedad?.descripcion}</td>
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
                                <td colSpan={10} style={{ textAlign: "center" }}>No hay propiedades registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear/Editar Propiedad */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {propiedadToEdit ? <FaEdit /> : <FaHome />}
                                {propiedadToEdit ? " Editar Propiedad" : " Crear Propiedad"}
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
                                            min={field.type === "number" ? "0" : undefined}
                                            step={field.name === "precio" ? "1000" : undefined}
                                        />
                                    </div>
                                ))}

                                {/* Select para Propietario - MEJORADO */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaUser />
                                        Propietario
                                    </label>
                                    <select
                                        name="idPropietario"
                                        value={form.idPropietario}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un propietario</option>
                                        {propietarios.length > 0 ? (
                                            propietarios.map(p => (
                                                <option key={p.idPersona} value={p.idPersona}>
                                                    {p.nombre} {p.apellido}
                                                    {p.tipoPersona && ` (${p.tipoPersona})`}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No hay propietarios disponibles</option>
                                        )}
                                    </select>
                                    {propietarios.length === 0 && (
                                        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                                            No se encontraron propietarios. Verifique que existan personas con tipo "PROPIETARIO".
                                        </div>
                                    )}
                                </div>

                                {/* Select para Asesor - MEJORADO */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaUserTie />
                                        Asesor
                                    </label>
                                    <select
                                        name="idAsesor"
                                        value={form.idAsesor}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un asesor</option>
                                        {asesores.length > 0 ? (
                                            asesores.map(a => (
                                                <option key={a.idPersona} value={a.idPersona}>
                                                    {a.nombre} {a.apellido}
                                                    {a.tipoPersona && ` (${a.tipoPersona})`}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No hay asesores disponibles</option>
                                        )}
                                    </select>
                                    {asesores.length === 0 && (
                                        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                                            No se encontraron asesores. Verifique que existan personas con tipo "ASESOR".
                                        </div>
                                    )}
                                </div>

                                {/* Select para Tipo de Propiedad */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaBuilding />
                                        Tipo de Propiedad
                                    </label>
                                    <select
                                        name="idTipoPropiedad"
                                        value={form.idTipoPropiedad}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un tipo</option>
                                        {tiposPropiedad.map(tipo => (
                                            <option key={tipo.idTipoPropiedad} value={tipo.idTipoPropiedad}>
                                                {tipo.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Select para Estado de Propiedad */}
                                <div className="form-group-compact">
                                    <label>
                                        <FaClipboardCheck />
                                        Estado
                                    </label>
                                    <select
                                        name="idEstadoPropiedad"
                                        value={form.idEstadoPropiedad}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un estado</option>
                                        {estadosPropiedad.map(estado => (
                                            <option key={estado.idEstadoPropiedad} value={estado.idEstadoPropiedad}>
                                                {estado.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions-compact">
                                <button type="submit" className="submit-btn-compact"
                                    disabled={propietarios.length === 0 || asesores.length === 0}>
                                    <FaSave />
                                    {propiedadToEdit ? " Guardar" : " Crear"}
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

            {/* Modal Eliminar Propiedad */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content delete-modal-compact" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3>Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro de que deseas eliminar la propiedad en
                            <strong> {propiedadToDelete?.direccion}</strong>?
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