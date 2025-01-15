// src/hooks/rota.js
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute"; // Importando o ProtectedRoute
import Login from "../components/login/Login";
import LoginRedefinirSenha from "../components/login/redefinir-senha";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Config from "../components/config/config";
import CaixaBancos from "../components/contas/caixabancos/caixaBancos";
import ContasApagar from "../components/contas/contasApagar/conta-apagar";
import Contas from "../components/contas/contas";
import ContasResceber from "../components/contas/contasReceber/contasAReceber";
import UploadAndTable from "../components/importDadosExterno/UploadAndTable";
import AnaliseMovimentacao from "../components/contas/AnaliseMovimentacao/AnaliseMovimentacao";

import HomeProduto from "../components/Produto/HomeProduto";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const Rota = () => {
  return (
    <Router>
      <AnimatePresence>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><Home /></motion.div>}
            />
            <Route
              path="home"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><Home /></motion.div>}
            />
            <Route
              path="redefinir-senha"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><LoginRedefinirSenha /></motion.div>}
            />
            <Route
              path="about"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><About /></motion.div>}
            />
            <Route
              path="contact"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><Contact /></motion.div>}
            />
            <Route
              path="config"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><Config /></motion.div>}
            />
            <Route
              path="caixabancos"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><CaixaBancos /></motion.div>}
            />
            <Route
              path="contas"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><Contas /></motion.div>}
            />
            <Route
              path="contasapagar"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><ContasApagar /></motion.div>}
            />
            <Route
              path="contasresceber"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><ContasResceber /></motion.div>}
            />
            <Route
              path="uploadandtable"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><UploadAndTable /></motion.div>}
            />
            <Route
              path="produto"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><HomeProduto /></motion.div>}
            />
            <Route
              path="analisemovimentacao"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><AnaliseMovimentacao /></motion.div>}
            />
            <Route
              path="*"
              element={<motion.div variants={variants} initial="hidden" animate="visible" exit="exit"><Home /></motion.div>}
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default Rota;
