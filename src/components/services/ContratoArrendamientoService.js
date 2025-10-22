import api from "../../api/axiosConfig";

export const getContratosArrendamiento = async () => {
    const res = await api.get("/contrato-arrendamiento/todos");
    return res.data;
};

export const getContratoArrendamientoById = async (id) => {
    const res = await api.get(`/contrato-arrendamiento/buscar-por-id/${id}`);
    return res.data;
};