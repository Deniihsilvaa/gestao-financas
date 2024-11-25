import React from 'react';
import { supabase } from '../../../../services/supabaseClient';

interface RowExpansionTemplateProps {
    data: {
      id: number; // Adicionado o ID para exclusão
      observacao: string;
      data_transacao: string;
  };
  onDelete: (id: number) => void; // Função de callback para exclusão
  }
const RowExpansionTemplate: React.FC<RowExpansionTemplateProps> = ({ data, onDelete }) => {
    // Função de exclusão
    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('base_caixa') // Nome da tabela
                .delete()
                .eq('id', data.id); // Condição para deletar pelo ID

            if (error) {
                console.error('Erro ao excluir:', error.message);
                alert('Erro ao excluir');
                return alert('Erro ao excluir');
            }

            // Chama o callback para atualizar os dados no componente pai
           
            onDelete(data.id);
        } catch (err) {
            console.error('Erro desconhecido ao excluir:', err);
        }
    };

    return (
        <div className="row">
            <div className="col p-3 bg-info">
                <p>Observação: {data.observacao}</p> {/* Corrigido aqui */}
            </div>
            <div className="col p-3 bg-info">
                <p>Data Competência: {data.data_transacao}</p>
            </div>
            <div className="col p-3">
                <button
                    onClick={handleDelete}
                    className="btn btn-danger"
                    style={{ marginTop: '10px' }}
                >
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default RowExpansionTemplate;
