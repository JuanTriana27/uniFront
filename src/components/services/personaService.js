import api from "../../api/axiosConfig";

export const getPersonas = async () => {
    const res = await api.get("/persona/todos");
    return res.data;
};

export const getPersonaById = async (id) => {
    const res = await api.get(`/persona/buscar-por-id/${id}`);
    return res.data;
};

export const createPersona = async (data) => {
    const res = await api.post("/persona/guardar-nuevo", data);
    return res.data;
};

export const updatePersona = async (id, data) => {
    const res = await api.put(`/persona/update/${id}`, data);
    return res.data;
};

export const deletePersona = async (id) => {
    const res = await api.delete(`/persona/delete/${id}`);
    return res.data;
};
