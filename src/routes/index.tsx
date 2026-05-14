import { Routes, Route } from 'react-router-dom'

import Home from '../pages/home/home/homepage'
import DetalhesPessoa from '../pages/home/DetalhesPessoa/detalhespessoa'
import Login from '../pages/home/Login/login'
import RedefinirSenha from '../pages/home/RedefinirSenha/redefinirsenha'
import EspacoSaber from '../pages/home/EspacoSaber/espacosaber'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

        <Route
        path="/paciente/:id"
        element={<DetalhesPessoa />}
        />

        <Route
          path="/redefinir-senha"
          element={<RedefinirSenha />}
        />

        <Route
          path="/espaco-saber"
          element={<EspacoSaber />}
        />

      <Route path="/login" element={<Login />} />
    </Routes>
  )
}