// 
import React from 'react';
import {RowExpansionTemplateProps} from "./types"
import {formatDate} from '../../../utils/formatters';
const RowExpansionTemplate: React.FC<RowExpansionTemplateProps> = ({ data }) => {
    const { observacao, data_vencimento } = data;
    const dataVencimento = data_vencimento?formatDate(data_vencimento):"";
    return (
        <div className="row">
            <div className="p-3 col bg-info">
                <p>Observação: {observacao}</p> {/* Corrigido aqui */}
            </div>
            <div className="p-3 col bg-info">
                <p>Data Vencimento: {dataVencimento}</p>
            </div>
        </div>
    );
};

export default RowExpansionTemplate;
