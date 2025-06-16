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

    useEffect(() => {
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
            setIsEditing(false);
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
        }
    }, [propiedadToEdit]);

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

            // Limpiar y notificar
            setTimeout(() => setSuccessMsg(""), 3000);
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
            onCreated();
        } catch (error) {
            console.error("Error en la operación", error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
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
    };

    return (
        <div className="propiedad-form">
            <h2 className="section-header">
                {isEditing ? "Editar Propiedad" : "Crear Nueva Propiedad"}
            </h2>

            {successMsg && (
                <div className="success-message">
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

                <div className="form-group">
                    <input
                        name="idPropietario"
                        type="number"
                        placeholder="ID Propietario"
                        onChange={handleChange}
                        value={form.idPropietario}
                        className="form-input"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="idAsesor"
                        type="number"
                        placeholder="ID Asesor"
                        onChange={handleChange}
                        value={form.idAsesor}
                        className="form-input"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="idTipoPropiedad"
                        type="number"
                        placeholder="ID Tipo Propiedad"
                        onChange={handleChange}
                        value={form.idTipoPropiedad}
                        className="form-input"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="idEstadoPropiedad"
                        type="number"
                        placeholder="ID Estado Propiedad"
                        onChange={handleChange}
                        value={form.idEstadoPropiedad}
                        className="form-input"
                        min="1"
                        required
                    />
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