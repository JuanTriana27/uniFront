import api from "../../api/axiosConfig";

// Obtener todo
export const getEstadosContrato = async () => {
    const res = await api.get("/estado-contrato/todos");
    return res.data;
};

// Metodo para buscar por id
export const getEstadoContratoById = async (id) => {
    const res = await api.get(`/estado-contrato/buscar-por-id/${id}`);
    return res.data;
};

// Metodo para crear
export const createEstadoContrato = async (data) => {
    const res = await api.post("/estado-contrato/guardar-nuevo", data);
    return res.data;
};

// Metodo para actualizar
export const updateEstadoContrato = async (id, data) => {
    const res = await api.put(`/estado-contrato/update/${id}`, data);
    return res.data;
}

// Metodo para eliminar
export const deleteEstadoContrato = async (id) => {
    const res = await api.delete(`/estado-contrato/delete/${id}`);
    return res.data;
}