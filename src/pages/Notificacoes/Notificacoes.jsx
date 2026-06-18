import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../services/firebase";
import Navbar from "../../components/Navbar/Navbar";

function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    carregarPets();
    carregarNotificacoes();
  }, []);

  async function carregarPets() {
    const snapshot = await getDocs(
      collection(db, "pets")
    );

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPets(lista);
  }

  async function carregarNotificacoes() {
    const snapshot = await getDocs(
      collection(db, "notificacoes")
    );

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNotificacoes(lista);
  }

  function buscarNomePet(petId) {
    const pet = pets.find(
      (pet) => pet.id === petId
    );

    return pet
      ? pet.nome
      : "Pet não encontrado";
  }

  async function concluirNotificacao(id) {
    try {
      await updateDoc(
        doc(db, "notificacoes", id),
        {
          concluido: true,
        }
      );

      await carregarNotificacoes();

      alert("Notificação concluída!");
    } catch (error) {
      console.error(error);
    }
  }

  function formatarData(data) {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  const notificacoesPendentes =
    notificacoes.filter(
      (n) => !n.concluido
    );

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Notificações</h1>

        {notificacoesPendentes.length === 0 ? (
          <p>
            Nenhuma notificação pendente.
          </p>
        ) : (
          notificacoesPendentes.map(
            (notificacao) => (
              <div
                key={notificacao.id}
                style={{
                  background: "#fff",
                  padding: "15px",
                  marginTop: "15px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <h3>
                  🔔 {notificacao.tipo}
                </h3>

                <p>
                  <strong>Pet:</strong>{" "}
                  {buscarNomePet(
                    notificacao.petId
                  )}
                </p>

                <p>
                  <strong>
                    Data do evento:
                  </strong>{" "}
                  {formatarData(notificacao.dataEvento)}
                </p>

                <p>
                  {notificacao.mensagem}
                </p>

                <button
                  onClick={() =>
                    concluirNotificacao(
                      notificacao.id
                    )
                  }
                  style={{
                    background: "#2e7d32",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Marcar como concluído
                </button>
              </div>
            )
          )
        )}
      </div>
    </>
  );
}

export default Notificacoes;