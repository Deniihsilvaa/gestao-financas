import { supabase } from "../../services/supabaseClient";

export async function config() {
    const { data, error } = await supabase
        .from("type_categoria")
        .select("tipo, grupo, natureza, categoria_financeira,subcategoria");

    if (error) {
        console.error("Erro ao buscar configurações:", error.message);
        return null;
    }
    console.log("Verifique as configurações:", data);

    return {
        tipos: Array.from(new Set(data.map(item => item.tipo))).map(tipo => ({ label: tipo, value: tipo })),
        grupos: Array.from(new Set(data.map(item => item.grupo))).map(grupo => ({ label: grupo, value: grupo })),
        naturezas: Array.from(new Set(data.map(item => item.natureza))).map(natureza => ({ label: natureza, value: natureza })),
        financeiras: Array.from(new Set(data.map(item => item.categoria_financeira))).map(financeira => ({ label: financeira, value: financeira })),
        subCategorias: Array.from(new Set(data.map(item => item.subcategoria))).map(subcategoria => ({ label: subcategoria, value: subcategoria }))
    };
}

export async function buscarConfigAll() {
    const { data, error } = await supabase.from("type_categoria").select("*")

    if (error) {
        console.error("Erro ao buscar configurações:", error.message);
        return null;
    }

    return data;
}

export async function deleteConfig(id:number){
    const { error } = await supabase
      .from("type_categoria")
      .delete()
      .eq("id", id);
    return error;
}