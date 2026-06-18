import { criarNotificacao } from "../../services/notificacoesService";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import Navbar from "../../components/Navbar/Navbar";

function BanhoTosa() {
  const [pets, setPets] = useState([]);
  const [registros, setRegistros] = useState([]);

  const [petId, setPetId] = useState("");
  const [dataBanho, setDataBanho] = useState("");
  const [dataTosa, setDataTosa] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [registroEditando, setRegistroEditando] =
    useState(null);

  useEffect(() => {
    carregarPets();
    carregarRegistros();
  }, []);

  async function carregarPets() {
    const snapshot = await getDocs(collection(db, "pets"));

    const lista = [];

    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setPets(lista);
  }

  async function carregarRegistros() {
    const snapshot = await getDocs(
      collection(db, "banhoTosa")
    );

    const lista = [];

    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setRegistros(lista);
  }

  function buscarNomePet(petId) {
    const pet = pets.find(
      (pet) => pet.id === petId
    );

    return pet ? pet.nome : "Pet não encontrado";
  }

  async function cadastrarRegistro(e) {
    e.preventDefault();

    try {
      if (registroEditando) {
        await updateDoc(
          doc(db, "banhoTosa", registroEditando.id),
          {
            petId,
            dataBanho,
            dataTosa,
            observacoes,
          }
        );

        alert("Registro atualizado!");
      } else {
        await addDoc(collection(db, "banhoTosa"), {
          petId,
          dataBanho,
          dataTosa,
          observacoes,
          concluido: false,
        });

        await criarNotificacao({
          petId,
          tipo: "Banho",
          mensagem: "Seu pet precisa tomar banho",
          dataEvento: dataBanho,
        });

        await criarNotificacao({
          petId,
          tipo: "Tosa",
          mensagem: "Seu pet precisa fazer tosa",
          dataEvento: dataTosa,
        });

        alert("Registro salvo!");
      }

      setRegistroEditando(null);

      setPetId("");
      setDataBanho("");
      setDataTosa("");
      setObservacoes("");

      await carregarRegistros();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function editarRegistro(registro) {
    setRegistroEditando(registro);

    setPetId(registro.petId);
    setDataBanho(registro.dataBanho);
    setDataTosa(registro.dataTosa);
    setObservacoes(registro.observacoes);
  }

  async function excluirRegistro(id) {
    if (
      !window.confirm(
        "Deseja excluir este registro?"
      )
    ) {
      return;
    }

    try {
      const registro = registros.find(
        (r) => r.id === id
      );

      const notificacoesSnapshot = await getDocs(
        query(
          collection(db, "notificacoes"),
          where("petId", "==", registro.petId)
        )
      );

      for (const documento of notificacoesSnapshot.docs) {
        const notificacao = documento.data();

        if (
          (notificacao.tipo === "Banho" &&
            notificacao.dataEvento === registro.dataBanho) ||
          (notificacao.tipo === "Tosa" &&
            notificacao.dataEvento === registro.dataTosa)
        ) {
          await deleteDoc(
            doc(db, "notificacoes", documento.id)
          );
        }
      }

      await deleteDoc(
        doc(db, "banhoTosa", id)
      );

      alert("Registro removido com sucesso!");

      await carregarRegistros();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir registro.");
    }
  }

  async function concluirRegistro(id) {
    try {
      const registro = registros.find(
        (r) => r.id === id
      );

      await updateDoc(
        doc(db, "banhoTosa", id),
        {
          concluido: true,
        }
      );

      const notificacoesSnapshot = await getDocs(
        query(
          collection(db, "notificacoes"),
          where("petId", "==", registro.petId)
        )
      );

      for (const documento of notificacoesSnapshot.docs) {
        const notificacao = documento.data();

        if (
          (notificacao.tipo === "Banho" &&
            notificacao.dataEvento === registro.dataBanho) ||
          (notificacao.tipo === "Tosa" &&
            notificacao.dataEvento === registro.dataTosa)
        ) {
          await deleteDoc(
            doc(db, "notificacoes", documento.id)
          );
        }
      }

      alert("Registro marcado como concluído!");

      await carregarRegistros();
    } catch (error) {
      console.error(error);
      alert("Erro ao concluir registro.");
    }
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Banho e Tosa</h1>

        <form
          onSubmit={cadastrarRegistro}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "500px",
          }}
        >
          <select
            value={petId}
            onChange={(e) =>
              setPetId(e.target.value)
            }
            required
          >
            <option value="">
              Selecione um pet
            </option>

            {pets.map((pet) => (
              <option
                key={pet.id}
                value={pet.id}
              >
                {pet.nome}
              </option>
            ))}
          </select>

          <label>Data do Banho</label>

          <input
            type="date"
            value={dataBanho}
            onChange={(e) =>
              setDataBanho(e.target.value)
            }
            required
          />

          <label>Data da Tosa</label>

          <input
            type="date"
            value={dataTosa}
            onChange={(e) =>
              setDataTosa(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Observações"
            value={observacoes}
            onChange={(e) =>
              setObservacoes(e.target.value)
            }
          />

          <button
            type="submit"
            className="btn-primary"
          >
            {registroEditando
              ? "Atualizar Registro"
              : "Salvar Registro"}
          </button>
        </form>

        <hr style={{ margin: "30px 0" }} />

        <h2>Histórico</h2>

        {registros.length === 0 ? (
          <p>Nenhum registro encontrado.</p>
        ) : (
          registros.map((registro) => (
            <div
              key={registro.id}
              style={{
                background: "#fff",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                ✂️ {buscarNomePet(registro.petId)}
              </h3>

              <p>
                <strong>Banho:</strong>{" "}
                {registro.dataBanho}
              </p>

              <p>
                <strong>Tosa:</strong>{" "}
                {registro.dataTosa}
              </p>

              <p>
                <strong>Observações:</strong>{" "}
                {registro.observacoes}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {registro.concluido
                  ? "✅ Concluído"
                  : "⏳ Pendente"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                <button
                  className="btn-primary"
                  onClick={() =>
                    editarRegistro(registro)
                  }
                >
                  Editar
                </button>

                <button
                  className="btn-danger"
                  onClick={() =>
                    excluirRegistro(
                      registro.id
                    )
                  }
                >
                  Excluir
                </button>

                {!registro.concluido && (
                  <button
                    onClick={() =>
                      concluirRegistro(
                        registro.id
                      )
                    }
                    style={{
                      background: "#2e7d32",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Concluir
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default BanhoTosa;