import api from "../../api/axiosConfig";

export const getPropiedades = async () => {
    const res = await api.get("/propiedad/todos");
    return res.data;
};

export const getPropiedadById = async (id) => {
    const res = await api.get(`/propiedad/buscar-por-id/${id}`);
    return res.data;
};

export const createPropiedad = async (data) => {
    const res = await api.post("/propiedad/guardar-nuevo", data);
    return res.data;
};

export const updatePropiedad = async (id, data) => {
    const res = await api.put(`/propiedad/update/${id}`, data);
    return res.data;
};

export const deletePropiedad = async (id) => {
    const res = await api.delete(`/propiedad/delete/${id}`);
    return res.data;
};