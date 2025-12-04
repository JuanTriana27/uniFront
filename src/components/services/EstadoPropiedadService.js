import api from "../../api/axiosConfig";

// Obtener todo
export const getEstadosPropiedad = async () => {
    const res = await api.get("/estado-propiedad/todos");
    return res.data;
};

// Metodo para buscar por id
export const getEstadoPropiedadById = async (id) => {
    const res = await api.get(`/estado-propiedad/buscar-por-id/${id}`);
    return res.data;
};

// Metodo para crear
export const createEstadoPropiedad = async (data) => {
    const res = await api.post("/estado-propiedad/guardar-nuevo", data);
    return res.data;
};

// Metodo para actualizar
export const updateEstadoPropiedad = async (id, data) => {
    const res = await api.put(`/estado-propiedad/update/${id}`, data);
    return res.data;
}

// Metodo para eliminar
export const deleteEstadoPropiedad = async (id) => {
    const res = await api.delete(`/estado-propiedad/delete/${id}`);
    return res.data;
}