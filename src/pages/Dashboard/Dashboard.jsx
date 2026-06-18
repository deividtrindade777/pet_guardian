import { enviarEmail } from "../../services/emailService";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../components/Navbar/Navbar";

function Dashboard() {
  const [pets, setPets] = useState([]);
  const [petSelecionado, setPetSelecionado] = useState("todos");

  const [vacinas, setVacinas] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [banhoTosa, setBanhoTosa] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const petsSnap = await getDocs(
        query(collection(db, "pets"), where("userId", "==", user.uid))
      );

      setPets(petsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const vacinasSnap = await getDocs(
        query(collection(db, "vacinas"), where("userId", "==", user.uid))
      );

      const consultasSnap = await getDocs(
        query(collection(db, "consultas"), where("userId", "==", user.uid))
      );

      const medicamentosSnap = await getDocs(
        query(collection(db, "medicamentos"), where("userId", "==", user.uid))
      );

      const banhoTosaSnap = await getDocs(
        query(collection(db, "banhoTosa"), where("userId", "==", user.uid))
      );

      const notificacoesSnap = await getDocs(
        query(collection(db, "notificacoes"), where("userId", "==", user.uid))
      );

      setVacinas(vacinasSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setConsultas(consultasSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setMedicamentos(medicamentosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setBanhoTosa(banhoTosaSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setNotificacoes(notificacoesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  async function testarEmail() {
    try {
      await enviarEmail(
        "silvadeivi321@gmail.com",
        "Teste PetGuardian",
        "Se você recebeu este email, o EmailJS está funcionando."
      );

      alert("Email enviado!");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar email.");
    }
  }

  function buscarNomePet(petId) {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.nome : "Pet não encontrado";
  }

  function pertenceAoFiltro(item) {
    if (petSelecionado === "todos") {
      return pets.some((pet) => pet.id === item.petId);
    }

    return item.petId === petSelecionado;
  }

  function estaProximo(data) {
    if (!data) return false;

    const hoje = new Date();
    const dataItem = new Date(data);
    const limite = new Date();

    limite.setDate(hoje.getDate() + 30);

    return dataItem >= hoje && dataItem <= limite;
  }

  const vacinasProximas = vacinas.filter(
    (v) => pertenceAoFiltro(v) && estaProximo(v.dataProximaDose)
  );

  const consultasProximas = consultas.filter(
    (c) => pertenceAoFiltro(c) && estaProximo(c.dataConsulta)
  );

  const banhosProximos = banhoTosa.filter(
    (b) =>
      pertenceAoFiltro(b) &&
      (estaProximo(b.dataBanho) || estaProximo(b.dataTosa))
  );

  const medicamentosAtivos = medicamentos.filter((m) =>
    pertenceAoFiltro(m)
  );

  const notificacoesPendentes = notificacoes.filter((n) => !n.concluido);

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Dashboard</h1>

        <button
          onClick={testarEmail}
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Testar Email
        </button>

        <select
          value={petSelecionado}
          onChange={(e) => setPetSelecionado(e.target.value)}
          style={{
            marginTop: "20px",
            padding: "12px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <option value="todos">Todos os pets</option>

          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.nome}
            </option>
          ))}
        </select>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <Card titulo="🐾 Pets" valor={pets.length} />
          <Card titulo="💉 Vacinas próximas" valor={vacinasProximas.length} />
          <Card titulo="🩺 Consultas próximas" valor={consultasProximas.length} />
          <Card titulo="💊 Medicamentos" valor={medicamentosAtivos.length} />
          <Card titulo="✂️ Banho/Tosa" valor={banhosProximos.length} />
        </div>

        <Secao titulo="💉 Vacinas próximas">
          {vacinasProximas.length === 0 ? (
            <p>Nenhuma vacina próxima.</p>
          ) : (
            vacinasProximas.map((vacina) => (
              <Item key={vacina.id}>
                <strong>{vacina.nomeVacina}</strong>
                <p>Pet: {buscarNomePet(vacina.petId)}</p>
                <p>Próxima dose: {vacina.dataProximaDose}</p>
              </Item>
            ))
          )}
        </Secao>

        <Secao titulo="🩺 Próximas consultas">
          {consultasProximas.length === 0 ? (
            <p>Nenhuma consulta próxima.</p>
          ) : (
            consultasProximas.map((consulta) => (
              <Item key={consulta.id}>
                <strong>{buscarNomePet(consulta.petId)}</strong>
                <p>Data: {consulta.dataConsulta}</p>
                <p>Clínica: {consulta.nomeClinica}</p>
              </Item>
            ))
          )}
        </Secao>

        <Secao titulo="✂️ Próximos banhos e tosas">
          {banhosProximos.length === 0 ? (
            <p>Nenhum banho ou tosa próximo.</p>
          ) : (
            banhosProximos.map((registro) => (
              <Item key={registro.id}>
                <strong>{buscarNomePet(registro.petId)}</strong>
                <p>Banho: {registro.dataBanho}</p>
                <p>Tosa: {registro.dataTosa}</p>
              </Item>
            ))
          )}
        </Secao>

        <Secao titulo="🔔 Notificações">
          {notificacoesPendentes.length === 0 ? (
            <p>Nenhuma notificação pendente.</p>
          ) : (
            notificacoesPendentes.map((notificacao) => (
              <Item key={notificacao.id}>
                <strong>{notificacao.tipo}</strong>
                <p>Pet: {buscarNomePet(notificacao.petId)}</p>
                <p>Vencimento: {notificacao.dataEvento}</p>
                <p>{notificacao.mensagem}</p>
              </Item>
            ))
          )}
        </Secao>
      </div>
    </>
  );
}

function Card({ titulo, valor }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        width: "100%",
      }}
    >
      <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
        {titulo}
      </h3>

      <p
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#e53935",
        }}
      >
        {valor}
      </p>
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>{titulo}</h2>
      {children}
    </div>
  );
}

function Item({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "15px",
        marginTop: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </div>
  );
}

export default Dashboard;