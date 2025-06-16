// src/components/estadoPropiedad/EstadoPropiedadForm.jsx
import { useState } from "react";
import api from "../../api/axiosConfig";
import "./EstadoPropiedad.css";

function EstadoPropiedadForm({ onCreated }) {
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
    });
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const payload = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
            };
            if (!payload.nombre) {
                setErrorMsg("El nombre es obligatorio.");
                return;
            }

            await api.post("/estado-propiedad/guardar-nuevo", payload);
            setSuccessMsg("Estado de propiedad creado con éxito");
            setForm({ nombre: "", descripcion: "" });
            onCreated();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.error("Error creando estado", error);
            setErrorMsg("Ocurrió un error al crear.");
        }
    };

    return (
        <div className="estado-propiedad-form">
            <h2 className="section-header">Agregar Estado de Propiedad</h2>

            {successMsg && <div className="success-message">{successMsg}</div>}
            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nombre del estado"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Descripción (opcional)"
                    />
                </div>

                <div className="form-group button-group" style={{ gridColumn: "1 / -1" }}>
                    <button type="submit" className="submit-btn guardar-btn">
                        Guardar Estado
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EstadoPropiedadForm;
