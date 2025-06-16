import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import './Personas.css';

function PersonaForm({ onCreated, personaToEdit }) {
    const [form, setForm] = useState({
        idPersona: "",
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        if (personaToEdit) {
            const safe = (v) => (v != null ? v.toString() : "");
            setForm({
                idPersona: safe(personaToEdit.idPersona),
                nombre: personaToEdit.nombre || "",
                apellido: personaToEdit.apellido || "",
                telefono: personaToEdit.telefono || "",
                email: personaToEdit.email || "",
                direccion: personaToEdit.direccion || "",
                ciudad: personaToEdit.ciudad || "",
                codigoPostal: safe(personaToEdit.codigo_postal),
            });
            setIsEditing(true);
        } else {
            setIsEditing(false);
            setForm({
                idPersona: "",
                nombre: "",
                apellido: "",
                telefono: "",
                email: "",
                direccion: "",
                ciudad: "",
                codigoPostal: "",
            });
        }
    }, [personaToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: form.nombre,
                apellido: form.apellido,
                telefono: form.telefono,
                email: form.email,
                direccion: form.direccion,
                ciudad: form.ciudad,
                codigo_postal: Number(form.codigoPostal),
            };

            if (isEditing && form.idPersona) {
                await api.put(`/persona/update/${form.idPersona}`, payload);
                setSuccessMsg("Persona modificada con éxito");
            } else {
                await api.post("/persona/guardar-nuevo", payload);
                setSuccessMsg("Persona creada con éxito");
            }

            setTimeout(() => setSuccessMsg(""), 3000);
            setForm({
                idPersona: "",
                nombre: "",
                apellido: "",
                telefono: "",
                email: "",
                direccion: "",
                ciudad: "",
                codigoPostal: "",
            });
            setIsEditing(false);
            onCreated();
        } catch (error) {
            console.error("Error en la operación de Persona", error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setForm({
            idPersona: "",
            nombre: "",
            apellido: "",
            telefono: "",
            email: "",
            direccion: "",
            ciudad: "",
            codigoPostal: "",
        });
    };

    return (
        <div className="persona-form">
            <h2 className="section-header">
                {isEditing ? "Editar Persona" : "Crear Nueva Persona"}
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
                            name="idPersona"
                            placeholder="ID Persona"
                            value={form.idPersona}
                            readOnly
                            className="form-input"
                        />
                    </div>
                )}

                <div className="form-group">
                    <input
                        name="nombre"
                        placeholder="Nombre"
                        onChange={handleChange}
                        value={form.nombre}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="apellido"
                        placeholder="Apellido"
                        onChange={handleChange}
                        value={form.apellido}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="telefono"
                        placeholder="Teléfono"
                        onChange={handleChange}
                        value={form.telefono}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={form.email}
                        className="form-input"
                        required
                    />
                </div>

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
                        type="number"
                        placeholder="Código Postal"
                        onChange={handleChange}
                        value={form.codigoPostal}
                        className="form-input"
                        min="0"
                        required
                    />
                </div>

                <div
                    className="form-group"
                    style={{ gridColumn: "1 / -1", display: "flex", gap: "15px" }}
                >
                    <button type="submit" className="submit-btn">
                        {isEditing ? "Guardar cambios" : "Crear Persona"}
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

export default PersonaForm;