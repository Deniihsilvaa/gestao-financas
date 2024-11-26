// 
import React from 'react';
import {RowExpansionTemplateProps} from "../types"
import {formatDate} from '../../../../utils/formatters'
const RowExpansionTemplate: React.FC<RowExpansionTemplateProps> = ({ data }) => {
    const { observacao, data_vencimento } = data;
    const dataVencimento = data_vencimento?formatDate(data_vencimento):"";
    return (
        <div className="row">
            <div className="col p-3 bg-info">
                <p>Observação: {observacao}</p> {/* Corrigido aqui */}
            </div>
            <div className="col p-3 bg-info">
                <p>Data Vencimento: {dataVencimento}</p>
            </div>
        </div>
    );
};

export default RowExpansionTemplate;
