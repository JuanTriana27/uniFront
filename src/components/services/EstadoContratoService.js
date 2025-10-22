import api from "../../api/axiosConfig";

export const getEstadosContrato = async () => {
    const res = await api.get("/estado-contrato/todos");
    return res.data;
};

export const getEstadoContratoById = async (id) => {
    const res = await api.get(`/estado-contrato/buscar-por-id/${id}`);
    return res.data;
};