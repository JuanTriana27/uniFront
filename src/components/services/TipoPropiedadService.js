import api from "../../api/axiosConfig";

export const getTiposPropiedad = async () => {
    const res = await api.get("/tipo-propiedad/todos");
    return res.data;
};

export const getTipoPropiedadById = async (id) => {
    const res = await api.get(`/tipo-propiedad/buscar-por-id/${id}`);
    return res.data;
};

export const createTipoPropiedad = async (data) => {
    const res = await api.post("/tipo-propiedad/guardar-nuevo", data);
    return res.data;
};