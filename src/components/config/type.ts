export interface ModalRegistroProps {
    onClose: () => void; // Função chamada ao fechar o modal
}
export interface FormData {
    email: string;
    password: string;
    name: string;
    role: string;
    access_level: string;
  }