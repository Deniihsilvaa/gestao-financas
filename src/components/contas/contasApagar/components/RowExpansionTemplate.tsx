// 
import React from 'react';
import {RowExpansionTemplateProps} from "../types"

const RowExpansionTemplate: React.FC<RowExpansionTemplateProps> = ({ data }) => {

    return (
        <div className="row">
            <div className="col p-3 bg-info">
                <p>Observação: {data.observacao}</p> {/* Corrigido aqui */}
            </div>
            <div className="col p-3 bg-info">
                <p>Data Competência: {data.data_transacao}</p>
            </div>
        </div>
    );
};

export default RowExpansionTemplate;
