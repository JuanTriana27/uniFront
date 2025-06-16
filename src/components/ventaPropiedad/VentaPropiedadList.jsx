// src/components/ventaPropiedad/VentaPropiedadList.jsx
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import "./VentaPropiedad.css";

function VentaPropiedadList() {
    const [ventas, setVentas] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchVentas = async () => {
        try {
            const response = await api.get("/venta-propiedad/todos");
            setVentas(response.data);
        } catch (error) {
            console.error("Error obteniendo ventas de propiedad", error);
            setErrorMsg("No se pudo cargar la lista de ventas.");
        }
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    return (
        <div className="venta-propiedad-list">
            <h2 className="section-header">Listado de Ventas de Propiedad</h2>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="table-container">
                <table className="venta-propiedad-table">
                    <thead>
                        <tr>
                            <th>ID Venta</th>
                            <th>Fecha Venta</th>
                            <th>Precio Venta</th>
                            <th>Comisión Asesor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.length > 0 ? (
                            ventas.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>
                                    <td>
                                        {v.fechaVenta
                                            ? new Date(v.fechaVenta).toLocaleDateString()
                                            : "––"}
                                    </td>
                                    <td>
                                        {typeof v.precioVenta === "number"
                                            ? `$${v.precioVenta.toLocaleString()}`
                                            : "––"}
                                    </td>
                                    <td>
                                        {typeof v.comisionAsesor === "number"
                                            ? `$${v.comisionAsesor.toLocaleString()}`
                                            : "––"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>
                                    No hay ventas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VentaPropiedadList;
