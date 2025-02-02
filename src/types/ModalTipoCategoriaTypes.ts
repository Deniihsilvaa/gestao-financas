export interface TipoCategoria {
    id: number;
    tipo: string;
    categoria: string;
    grupo: string;
    natureza: string;
    dre: string;
    subcategoria: string;
    categoria_financeira: string;
  }

  export interface ModalRegistroProps {
    onClose: () => void;
    isOpen: boolean;
    title: string;
  }