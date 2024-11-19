// src/hooks/rota.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute'; // Importando o ProtectedRoute
import Login from '../components/login/Login';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Config from '../components/config/config';
import CaixaBancos from '../components/caixabancos/caixa-bancos';
import ContasApagar from '../components/contas/contasApagar/conta-apagar';
import Contas from '../components/contas/contas';
import ContasResceber from '../components/contas/contasReceber/contas-receber';

const Rota = () => {    
    return (
        <Router>
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
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} /> 
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="config" element={<Config />} />
                    <Route path="caixabancos" element={<CaixaBancos/>} />
                    <Route path="contas" element={<Contas/>} />
                    <Route path="contasapagar" element={<ContasApagar/>} />
                    <Route path="contasresceber" element={<ContasResceber/>} />
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>
        </Router>
    );
  };
  
  export default Rota;