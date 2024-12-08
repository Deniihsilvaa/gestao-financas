import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../utils/formatters";

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
      <Column field="descricao" header="Descrição" sortable />
      <Column field="familia" header="Tipo" />
      <Column
        field="quantidade"
        header="Quantidade"
        body={(rowData) =>
          !isNaN(rowData.quantidade) && rowData.quantidade !== null
            ? rowData.quantidade === 0
              ? "Sem estoque"
              : rowData.quantidade
            : "Quantidade não definida"
        }
      />
      <Column
        field="price"
        header="Preço"
        body={(rowData) =>
          !isNaN(rowData.price) && rowData.price !== null
            ? formatCurrency(rowData.price)
            : "Preço não definido"
        }
      />
      <Column
        field="costPrice"
        header="Custo de Produto"
        body={(rowData) =>
          !isNaN(rowData.costPrice) && rowData.costPrice !== null
            ? formatCurrency(rowData.costPrice)
            : "Custo não definido"
        }
      />
      <Column
        field="categoria"
        header="Categoria"
        style={{
          maxWidth: "10rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      />
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
      costPrice: PropTypes.number.isRequired,
      familia: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TabelaProdutos;
