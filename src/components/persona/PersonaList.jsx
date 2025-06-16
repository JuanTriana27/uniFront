import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import './Personas.css';

function PersonaList({ onEditPersona }) {
    const [personas, setPersonas] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    const fetchPersonas = async () => {
        try {
            const response = await api.get("/persona/todos");
            setPersonas(response.data);
        } catch (error) {
            console.error("Error obteniendo personas", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/persona/delete/${id}`);
            setSuccessMsg("Persona eliminada exitosamente");
            fetchPersonas();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.error("Error eliminando persona", error);
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    return (
        <div className="persona-list">
            <h2 className="section-header">Listado de Personas</h2>

            {successMsg && (
                <div className="success-message">
                    {successMsg}
                </div>
            )}

            <div className="table-container">
                <table className="propiedades-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Código Postal</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.map((p) => (
                            <tr key={p.idPersona}>
                                <td>{p.idPersona}</td>
                                <td>{p.nombre}</td>
                                <td>{p.apellido}</td>
                                <td>{p.telefono}</td>
                                <td>{p.email}</td>
                                <td>{p.direccion}</td>
                                <td>{p.ciudad}</td>
                                <td>{p.codigo_postal}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => onEditPersona(p)}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDelete(p.idPersona)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {personas.length === 0 && (
                            <tr>
                                <td colSpan={9} style={{ textAlign: "center" }}>
                                    No hay personas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PersonaList;