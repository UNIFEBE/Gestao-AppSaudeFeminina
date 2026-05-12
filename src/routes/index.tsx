import { Routes, Route } from 'react-router-dom'

import Home from '../pages/home/home/homepage'
import DetalhesPessoa from '../pages/home/DetalhesPessoa/detalhespessoa'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

        <Route
        path="/paciente/:id"
        element={<DetalhesPessoa />}
      />
    </Routes>
  )
}