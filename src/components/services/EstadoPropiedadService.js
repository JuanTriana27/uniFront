// services/estadoPropiedadService.js
import api from "../../api/axiosConfig";

export const getEstadosPropiedad = async () => {
    const res = await api.get("/estado-propiedad/todos");
    return res.data;
};

export const getEstadoPropiedadById = async (id) => {
    const res = await api.get(`/estado-propiedad/buscar-por-id/${id}`);
    return res.data;
};

export const createEstadoPropiedad = async (data) => {
    const res = await api.post("/estado-propiedad/guardar-nuevo", data);
    return res.data;
};