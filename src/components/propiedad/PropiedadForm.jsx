import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import './Propiedades.css';

function PropiedadForm({ onCreated, propiedadToEdit }) {
    const [form, setForm] = useState({
        idPropiedad: "",
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

    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Estados para las opciones de los selects
    const [propietarios, setPropietarios] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [tiposPropiedad, setTiposPropiedad] = useState([]);
    const [estadosPropiedad, setEstadosPropiedad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar opciones y datos iniciales
    useEffect(() => {
        const cargarOpciones = async () => {
            try {
                setLoading(true);
                setError(null);
                setLoading(true);

                // Cargar todas las personas
                const personasRes = await api.get("/persona/todos");
                const todasPersonas = personasRes.data;  // Declaración aquí

                // Filtrar propietarios (usando tipoPersona)
                const propietariosFiltrados = todasPersonas.filter(
                    persona => persona.tipoPersona === 'PROPIETARIO'
                );

                // Filtrar asesores (usando tipoPersona)
                const asesoresFiltrados = todasPersonas.filter(
                    persona => persona.tipoPersona === 'ASESOR'
                );

                setPropietarios(todasPersonas);
                setAsesores(todasPersonas);

                // Cargar tipos y estados de propiedad
                const [tiposRes, estadosRes] = await Promise.all([
                    api.get("/tipo-propiedad/todos"),
                    api.get("/estado-propiedad/todos")
                ]);

                setTiposPropiedad(tiposRes.data);
                setEstadosPropiedad(estadosRes.data);

                setLoading(false);

                // CONSOLE LOG PARA VERIFICAR DATOS
                console.log("Personas cargadas:", todasPersonas);
                console.log("Propietarios:", propietariosFiltrados);
                console.log("Asesores:", asesoresFiltrados);
            } catch (error) {
                console.error("Error cargando opciones", error);
                setError("Error cargando datos. Por favor recarga la página.");
                setLoading(false);
            }
        };

        cargarOpciones();

        // Manejar propiedad a editar
        if (propiedadToEdit) {
            const safeToString = (v) => (v != null ? v.toString() : "");
            setForm({
                idPropiedad: safeToString(propiedadToEdit.idPropiedad),
                direccion: propiedadToEdit.direccion || "",
                ciudad: propiedadToEdit.ciudad || "",
                codigoPostal: propiedadToEdit.codigoPostal || "",
                metrosCuadrados: safeToString(propiedadToEdit.metrosCuadrados),
                habitaciones: safeToString(propiedadToEdit.habitaciones),
                banos: safeToString(propiedadToEdit.banos),
                precio: safeToString(propiedadToEdit.precio),
                idPropietario: safeToString(propiedadToEdit.propietario?.idPersona),
                idAsesor: safeToString(propiedadToEdit.asesor?.idPersona),
                idTipoPropiedad: safeToString(propiedadToEdit.tipoPropiedad?.idTipoPropiedad),
                idEstadoPropiedad: safeToString(propiedadToEdit.estadoPropiedad?.idEstadoPropiedad),
            });
            setIsEditing(true);
        } else {
            resetForm();
        }
    }, [propiedadToEdit]);

    const resetForm = () => {
        setForm({
            idPropiedad: "",
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
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
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

            if (isEditing && form.idPropiedad) {
                await api.put(`/propiedad/update/${form.idPropiedad}`, payload);
                setSuccessMsg("Propiedad modificada con éxito");
            } else {
                await api.post("/propiedad/guardar-nuevo", payload);
                setSuccessMsg("Propiedad creada con éxito");
            }

            setTimeout(() => setSuccessMsg(""), 3000);
            resetForm();
            onCreated();
        } catch (error) {
            console.error("Error en la operación", error);
            setSuccessMsg("Error al guardar: " + (error.response?.data?.message || error.message));
            setTimeout(() => setSuccessMsg(""), 5000);
        }
    };

    const handleCancelEdit = () => {
        resetForm();
        if (typeof onCreated === 'function') {
            onCreated();
        }
    };

    if (loading) {
        return <div className="loading">Cargando opciones...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="propiedad-form">
            <h2 className="section-header">
                {isEditing ? "Editar Propiedad" : "Crear Nueva Propiedad"}
            </h2>

            {successMsg && (
                <div className={successMsg.includes("Error") ? "error-message" : "success-message"}>
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
                {isEditing && (
                    <div className="form-group">
                        <input
                            name="idPropiedad"
                            placeholder="ID Propiedad"
                            value={form.idPropiedad}
                            readOnly
                            className="form-input"
                        />
                    </div>
                )}

                <div className="form-group">
                    <input
                        name="direccion"
                        placeholder="Dirección"
                        onChange={handleChange}
                        value={form.direccion}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="ciudad"
                        placeholder="Ciudad"
                        onChange={handleChange}
                        value={form.ciudad}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="codigoPostal"
                        placeholder="Código Postal"
                        onChange={handleChange}
                        value={form.codigoPostal}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="metrosCuadrados"
                        type="number"
                        placeholder="Metros Cuadrados"
                        onChange={handleChange}
                        value={form.metrosCuadrados}
                        className="form-input"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="habitaciones"
                        type="number"
                        placeholder="Habitaciones"
                        onChange={handleChange}
                        value={form.habitaciones}
                        className="form-input"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="banos"
                        type="number"
                        placeholder="Baños"
                        onChange={handleChange}
                        value={form.banos}
                        className="form-input"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="precio"
                        type="number"
                        placeholder="Precio"
                        onChange={handleChange}
                        value={form.precio}
                        className="form-input"
                        min="0"
                        step="1000"
                        required
                    />
                </div>

                {/* Select para Propietarios - Asegúrate que prop tenga nombre y apellido */}
                <div className="form-group">
                    <select
                        name="idPropietario"
                        onChange={handleChange}
                        value={form.idPropietario}
                        className="form-input"
                        required
                    >
                        <option value="">Seleccione un propietario</option>
                        {propietarios.map(p => (
                            <option key={p.idPersona} value={p.idPersona}>
                                {p.nombre} {p.apellido}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select para Asesores - CORREGIDO: name="idAsesor" */}
                <div className="form-group">
                    <select
                        name="idAsesor"
                        onChange={handleChange}
                        value={form.idAsesor}
                        className="form-input"
                        required
                    >
                        <option value="">Seleccione un asesor</option>
                        {asesores.map(p => (
                            <option key={p.idPersona} value={p.idPersona}>
                                {p.nombre} {p.apellido}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select para Tipos de Propiedad */}
                <div className="form-group">
                    <select
                        name="idTipoPropiedad"
                        onChange={handleChange}
                        value={form.idTipoPropiedad}
                        className="form-input"
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

                {/* Select para Estados de Propiedad */}
                <div className="form-group">
                    <select
                        name="idEstadoPropiedad"
                        onChange={handleChange}
                        value={form.idEstadoPropiedad}
                        className="form-input"
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

                <div
                    className="form-group"
                    style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px' }}
                >
                    <button type="submit" className="submit-btn">
                        {isEditing ? "Guardar cambios" : "Crear Propiedad"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default PropiedadForm;