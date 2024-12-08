import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PropTypes from "prop-types";
import {formatCurrency} from "../../../utils/formatters";

const TabelaProdutos = ({ produtos }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <DataTable
      value={produtos}
      paginator
      rowsPerPageOptions={[5, 10, 25, 50]}
      size="small"
      selectionMode="single"
      selection={selectedProduct} // Agora usa selectedProduct
      onSelectionChange={(e) => setSelectedProduct(e.value)}
      rows={10}
      responsiveLayout="scroll"
      tableStyle={{ minWidth: "50rem" }}
    >
      <Column field="descricao" header="Descrição" sortable  />
      <Column field="familia" header="Tipo" />
      <Column field="quantidade" header="Quantidade" />
      <Column field="price" header="Preço" body={(rowData) => formatCurrency(rowData.price)} />
      <Column field="costPrice" header="Custo de Produto" body={(rowData) => formatCurrency(rowData.costPrice)} />

    </DataTable>
  );
};

// Validação das props com PropTypes
TabelaProdutos.propTypes = {
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
      descricao: PropTypes.string.isRequired,
      quantidade: PropTypes.number.isRequired,
      preco: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TabelaProdutos;
