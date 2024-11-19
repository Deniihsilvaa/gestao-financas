import React from "react";
import { useFormik } from "formik";
import { supabase } from "../../../services/supabaseClient";

const Formulario = () => {
    const formik = useFormik({
        initialValues: {
            dateofrecords: "", // Data do registro
            name: "", // Nome
            enterprise: "", // empresa
            email: "",
        },
        onSubmit: async (values) => {
            // Preparando os dados para envio
            const payload = {
                dateofrecords: values.dateofrecords || new Date().toISOString(), // Data atual como padrão
                name: values.name,
                enterprise: values.enterprise,
                email: values.email,
            };

            try {
                const { data, error } = await supabase.from("general_data").insert([payload]);

                if (error) {
                    console.error("Erro ao registrar:", error);
                    alert(`Erro ao registrar: ${error.message}`);
                } else {
                    alert("Dados registrados com sucesso!");
                    console.log("Dados registrados:", data);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
                alert("Ocorreu um erro ao registrar. Verifique o console.");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} id="formRegister">
            <div className="row">
                <div className="col-6 mt-2">
                    <div className="input-group">
                        <span className="input-group-text w-100">ID</span>
                        <div className="form-floating w-100">
                            <input
                                type="text"
                                className="form-control"
                                id="id"
                                name="id"
                                onChange={formik.handleChange}
                                value={formik.values.id}
                                placeholder="ID"
                            />
                            <label htmlFor="id">ID (Opcional)</label>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="input-group">
                        <span className="input-group-text w-100">Data do Registro</span>
                        <div className="form-floating w-100">
                            <input
                                type="date"
                                className="form-control"
                                id="dateofrecords"
                                name="dateofrecords"
                                onChange={formik.handleChange}
                                value={formik.values.dateofrecords}
                                placeholder="Data"
                            />
                            <label htmlFor="dateofrecords">Data do Registro</label>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="input-group">
                        <span className="input-group-text w-100">Nome</span>
                        <div className="form-floating w-100">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                placeholder="Nome"
                            />
                            <label htmlFor="name">Nome</label>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="input-group">
                        <span className="input-group-text w-100">Empresa</span>
                        <div className="form-floating w-100">
                            <input
                                type="text"
                                className="form-control"
                                id="enterprise"
                                name="enterprise"
                                onChange={formik.handleChange}
                                value={formik.values.enterprise}
                                placeholder="enterprise"
                            />
                            <label htmlFor="enterprise">Empresa</label>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="input-group">
                        <span className="input-group-text w-100">Email</span>
                        <div className="form-floating w-100">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                placeholder="seuemail@provedor.com"
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                </div>

            </div>
            <div className="row mt-3 w-100">
                <div className="col-6 flex flex-column">
                    <button
                        type="submit"
                        className="bttRegister"
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        Registrar
                    </button>
                </div>
                <div className="col-6 flex flex-column">
                    <button
                        type="reset"
                        className="bttclear"
                        onClick={formik.handleReset}
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Formulario;