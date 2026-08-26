import { Routes, Route } from 'react-router-dom'

import Home from '../pages/home/home/homepage'
import DetalhesPessoa from '../pages/home/DetalhesPessoa/detalhespessoa'
import Login from '../pages/home/Login/login'
import Cadastro from '../pages/home/Cadastro/cadastro'
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
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/espaco-saber"
          element={<EspacoSaber />}
        />

      <Route path="/login" element={<Login />} />
    </Routes>
  )
}