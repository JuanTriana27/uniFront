import api from "../../api/axiosConfig";

// Obtener todo
export const getTiposPropiedad = async () => {
    const res = await api.get("/tipo-propiedad/todos");
    return res.data;
};

// Metodo para buscar por id
export const getTipoPropiedadById = async (id) => {
    const res = await api.get(`/tipo-propiedad/buscar-por-id/${id}`);
    return res.data;
};

// Metodo para crear
export const createTipoPropiedad = async (data) => {
    const res = await api.post("/tipo-propiedad/guardar-nuevo", data);
    return res.data;
};

// Metodo para actualizar
export const updateTipoPropiedad = async(id, data) => {
    const res = await api.put(`/tipo-propiedad/update/${id}`, data);
    return res.data;
}

// Metodo para eliminar
export const deleteTipoPropiedad = async (id) => {
    const res = await api.delete(`/tipo-propiedad/delete/${id}`);
    return res.data;
}