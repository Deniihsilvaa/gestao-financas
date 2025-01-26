import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

interface TipoCategoria {
  id: number;
  tipo: string;
  categoria: string;
  grupo: string;
  natureza: string;
  dre: string;
  subcategoria: string;
  categoria_financeira: string;
}

const tipos = [
  { label: "Entrada", value: "Entrada" },
  { label: "Saída", value: "Saída" },
];

const grupos = [
  { label: "Receita", value: "Receita" },
  { label: "Despesa", value: "Despesa" },
];

const naturezas = [
  { label: "Operacional", value: "Operacional" },
  { label: "Não Operacional", value: "Não Operacional" },
];

function ModalTipoCategorias({
  onClose,
  isOpen,
  title,
}: {
  onClose: () => void;
  isOpen: boolean;
  title: string;
}) {
  const [tipoCategorias, setTipoCategorias] = useState<TipoCategoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newCategoria, setNewCategoria] = useState<Partial<TipoCategoria>>({});
  const toast = React.useRef<Toast>(null);

  // Fetch data from Supabase
  const fetchTipoCategorias = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("type_categoria").select("*");
    if (error) {
      setError(error.message);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: error.message,
      });
    } else {
      setTipoCategorias(data || []);
    }
    setIsLoading(false);
  };

  // Create a new category
  const handleCreate = async () => {
    if (!newCategoria.categoria || !newCategoria.tipo || !newCategoria.grupo || !newCategoria.natureza) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("type_categoria")
      .insert([newCategoria]);
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

  // Delete a category
  const handleDelete = async (id: number) => {
    setIsLoading(true);
    //verificar antes de deletar
    if (!id) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Selecione um categoria para excluir.",
      });
      setIsLoading(false);
      return;
    }
    const { error } = await supabase.from("type_categoria").delete().eq("id", id);
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
        detail: "Categoria excluída!",
      });
      setTipoCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTipoCategorias();
  }, []);

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
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
              options={tipos}
              onChange={(e) =>
                setNewCategoria((prev) => ({ ...prev, tipo: e.value }))
              }
              placeholder="Selecione o Tipo"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Grupo</label>
            <Dropdown
              value={newCategoria.grupo || ""}
              options={grupos}
              onChange={(e) =>
                setNewCategoria((prev) => ({ ...prev, grupo: e.value }))
              }
              placeholder="Selecione o Grupo"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Natureza</label>
            <Dropdown
              value={newCategoria.natureza || ""}
              options={naturezas}
              onChange={(e) =>
                setNewCategoria((prev) => ({ ...prev, natureza: e.value }))
              }
              placeholder="Selecione a Natureza"
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Categoria</label>
            <InputText
              value={newCategoria.categoria || ""}
              onChange={(e) =>
                setNewCategoria((prev) => ({ ...prev, categoria: e.target.value }))
              }
              className="w-full"
            />
          </div>
          <Button
            label="Salvar"
            icon="pi pi-check"
            className="p-button-success w-full"
            onClick={handleCreate}
          />
        </div>
      </Dialog>

      <Button
        label="Fechar"
        className="p-button-secondary mt-4"
        onClick={onClose}
      />
    </div>
  );
}

export default ModalTipoCategorias;
