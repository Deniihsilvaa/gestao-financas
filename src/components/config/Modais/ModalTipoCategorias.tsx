import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { TipoCategoria, ModalRegistroProps } from "../../../types/ModalTipoCategoriaTypes";
import { config,buscarConfigAll,deleteConfig } from "../../../Api/ApiConfig";

function ModalTipoCategorias({ onClose, isOpen, title }: ModalRegistroProps) {
  const [tipoCategorias, setTipoCategorias] = useState<TipoCategoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newCategoria, setNewCategoria] = useState<Partial<TipoCategoria>>({});
  const [configData, setConfigData] = useState<any>(null);
  
  const toast = useRef<Toast>(null);

  // Carregar configurações dinâmicas
  const fetchConfig = useCallback(async () => {
    const data = await config();
    setConfigData(data);
  }, []);

  // Fetch data from Supabase
  const fetchTipoCategorias = useCallback(async () => {
    setIsLoading(true);
    const data = await buscarConfigAll();
    if (!data) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao buscar Dados.",
      });
    } else {
      setTipoCategorias(data || []);
    }
    setIsLoading(false);
  }, []);

  // Criar nova categoria
  const handleCreate = async () => {
    if (!newCategoria.categoria || !newCategoria.tipo || !newCategoria.grupo || !newCategoria.natureza) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Preencha todos os campos obrigatórios.",
      });
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase.from("type_categoria").insert([newCategoria]);
    if (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: error.message,
      });
    } else {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Categoria criada!",
      });
      setTipoCategorias((prev) => [...prev, ...(data || [])]);
      setNewCategoria({});
      setShowDialog(false);
    }
    setIsLoading(false);
  };

  // Deletar uma categoria
  const handleDelete = async (id: number) => {
    setIsLoading(true);
    //verificar confirmacao
    const confirm = window.confirm("Tem certeza que deseja excluir esta categoria?");
    if (!confirm) {
      setIsLoading(false);
      return;
    }
    if (!id) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Selecione uma categoria para excluir.",
      });
      setIsLoading(false);
      return;
    }
    const result = await deleteConfig(id);
    if (result) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: result.message,
      });
    } else {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Categoria excluída!",
      });
      setTipoCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTipoCategorias();
    fetchConfig();
  }, [fetchTipoCategorias, fetchConfig]);

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-4">
        <Button
          label="Adicionar Categoria"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => setShowDialog(true)}
        />
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : (
        <DataTable value={tipoCategorias} paginator rows={5} responsiveLayout="scroll">

          <Column field="id" header="ID" style={{ width: "5%" }} />
          <Column field="tipo" header="Tipo" />
          <Column field="categoria" header="Categoria" />
          <Column field="grupo" header="Grupo" />
          <Column field="natureza" header="Natureza" />
          <Column field="dre" header="DRE" />
          <Column field="subcategoria" header="Subcategoria" />
          <Column field="categoria_financeira" header="Categoria Financeira" />
          <Column
            header="Ações"
            body={(rowData: TipoCategoria) => (
              <div className="flex gap-2">
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger"
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      )}

      <Dialog
        header="Adicionar Categoria"
        visible={showDialog}
        style={{ width: "40vw" }}
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-2">Tipo</label>
            <Dropdown
              value={newCategoria.tipo || ""}
              options={configData?.tipos || []}
              onChange={(e) => setNewCategoria((prev) => ({ ...prev, tipo: e.value }))}
              placeholder="Selecione o Tipo"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Grupo</label>
            <Dropdown
              value={newCategoria.grupo || ""}
              options={configData?.grupos || []}
              onChange={(e) => setNewCategoria((prev) => ({ ...prev, grupo: e.value }))}
              placeholder="Selecione o Grupo"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Natureza</label>
            <Dropdown
              value={newCategoria.natureza || ""}
              options={configData?.naturezas || []}
              onChange={(e) => setNewCategoria((prev) => ({ ...prev, natureza: e.value }))}
              placeholder="Selecione a Natureza"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Categoria Financeira</label>
            <Dropdown
              value={newCategoria.categoria_financeira || ""}
              options={configData?.financeiras || []}
              onChange={(e) => setNewCategoria((prev) => ({ ...prev, categoria_financeira: e.value }))}
              placeholder="Selecione a Categoria Financeira"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Subcategoria</label>
            <Dropdown
              value={newCategoria.subcategoria || ""}
              options={configData?.subCategorias || []}
              onChange={(e) => setNewCategoria((prev) => ({ ...prev, subcategoria: e.value }))}
              placeholder="Selecione a Subcategoria"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Categoria</label>
            <InputText
              value={newCategoria.categoria || ""}
              onChange={(e) => setNewCategoria((prev) => ({ ...prev, categoria: e.target.value }))}
              className="w-full"
            />
          </div>
          <Button label="Salvar" icon="pi pi-check" className="p-button-success w-full" onClick={handleCreate} />
        </div>
      </Dialog>

      <Button label="Fechar" className="p-button-secondary mt-4" onClick={onClose} />
    </div>
  );
}

export default ModalTipoCategorias;
