import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import './Propiedades.css';

function PropiedadList({ onEditPropiedad }) {
    const [propiedades, setPropiedades] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    const fetchPropiedades = async () => {
        try {
            const response = await api.get("/propiedad/todos");
            setPropiedades(response.data);
        } catch (error) {
            console.error("Error obteniendo propiedades", error);
        }
    };

    const handleDelete = async (id) => {
        // 1️⃣ Optimismo: elimino enseguida del state
        setPropiedades(prev => prev.filter(p => p.idPropiedad !== id));

        try {
            // 2️⃣ Luego llamo al backend (puede fallar, pero la UI ya quitó la fila)
            await api.delete(`/propiedad/delete/${id}`);

            // 3️⃣ Mensaje de éxito
            setSuccessMsg("Propiedad eliminada exitosamente");
        } catch (error) {
            console.error("Error eliminando propiedad", error);

            // 4️⃣ Opcional: si quieres avisar al usuario del fallo
            alert("No se pudo completar el borrado en el servidor:\n" +
                (error.response?.data?.mensaje || error.message));

            // 5️⃣ (Opcional) Si prefieres revertir la eliminación en caso de error:
            // fetchPropiedades();
        } finally {
            // 6️⃣ Limpio mensaje después de un rato
            setTimeout(() => setSuccessMsg(""), 3000);
        }
    };

    useEffect(() => {
        fetchPropiedades();
    }, []);

    return (
        <div className="propiedad-list">
            <h2 className="section-header">Listado de Propiedades</h2>

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
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Código Postal</th>
                            <th>Metros²</th>
                            <th>Habitaciones</th>
                            <th>Baños</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propiedades.map((p) => (
                            <tr key={p.idPropiedad}>
                                <td>{p.idPropiedad}</td>
                                <td>{p.direccion}</td>
                                <td>{p.ciudad}</td>
                                <td>{p.codigoPostal}</td>
                                <td>{p.metrosCuadrados}</td>
                                <td>{p.habitaciones}</td>
                                <td>{p.banos}</td>
                                <td>${p.precio.toLocaleString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => onEditPropiedad(p)}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDelete(p.idPropiedad)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PropiedadList;
