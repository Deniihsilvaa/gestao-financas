import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Dialog } from "primereact/dialog";

export interface AlertDialogRef {
  showAlert: (message: string) => void;
}

const AlertDialog = forwardRef<AlertDialogRef>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showAlert = (message: string) => {
    setMessage(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000); // Oculta após 3 segundos
  };

  useImperativeHandle(ref, () => ({
    showAlert,
  }));

  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      showHeader={false}
      closable
      className="alert-dialog rounded-lg"
      style={{
        backgroundColor: "#f8d7da", // Cor de fundo
        borderRadius: "12px", // Bordas arredondadas
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", padding: "20px" }}>
        <button
          onClick={() => setVisible(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#721c24", // Cor do botão fechar
          }}
        >
          &times;
        </button>
        <p style={{ color: "#721c24", padding: "20px", margin: 0 }}>
          {message}
        </p>
      </div>
    </Dialog>
  );
});

export default AlertDialog;
