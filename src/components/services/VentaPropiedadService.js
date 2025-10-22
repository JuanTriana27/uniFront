import api from "../../api/axiosConfig";

export const getVentasPropiedad = async () => {
    const res = await api.get("/venta-propiedad/todos");
    return res.data;
};

export const getVentaPropiedadById = async (id) => {
    const res = await api.get(`/venta-propiedad/buscar-por-id/${id}`);
    return res.data;
};