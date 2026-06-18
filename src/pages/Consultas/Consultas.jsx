import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import Navbar from "../../components/Navbar/Navbar";

function Consultas() {
  const [pets, setPets] = useState([]);
  const [consultas, setConsultas] = useState([]);

  const [petId, setPetId] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [nomeClinica, setNomeClinica] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [consultaEditando, setConsultaEditando] =
    useState(null);

  useEffect(() => {
    carregarPets();
    carregarConsultas();
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

  async function carregarConsultas() {
    const snapshot = await getDocs(
      collection(db, "consultas")
    );

    const lista = [];

    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setConsultas(lista);
  }

  function buscarNomePet(petId) {
    const pet = pets.find(
      (pet) => pet.id === petId
    );

    return pet ? pet.nome : "Pet não encontrado";
  }

  async function cadastrarConsulta(e) {
    e.preventDefault();

    if (consultaEditando) {
      await updateDoc(
        doc(db, "consultas", consultaEditando.id),
        {
          petId,
          dataConsulta,
          nomeClinica,
          observacoes,
        }
      );

      alert("Consulta atualizada!");
    } else {
      await addDoc(collection(db, "consultas"), {
        petId,
        dataConsulta,
        nomeClinica,
        observacoes,
      });

      alert("Consulta cadastrada!");
    }

    setConsultaEditando(null);

    setPetId("");
    setDataConsulta("");
    setNomeClinica("");
    setObservacoes("");

    carregarConsultas();
  }

  async function excluirConsulta(id) {
    if (
      !window.confirm(
        "Deseja excluir esta consulta?"
      )
    ) {
      return;
    }

    await deleteDoc(
      doc(db, "consultas", id)
    );

    carregarConsultas();
  }

  function editarConsulta(consulta) {
    setConsultaEditando(consulta);

    setPetId(consulta.petId);
    setDataConsulta(consulta.dataConsulta);
    setNomeClinica(consulta.nomeClinica);
    setObservacoes(consulta.observacoes);
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Consultas Veterinárias</h1>

        <form
          onSubmit={cadastrarConsulta}
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

          <input
            type="date"
            value={dataConsulta}
            onChange={(e) =>
              setDataConsulta(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Nome da clínica"
            value={nomeClinica}
            onChange={(e) =>
              setNomeClinica(e.target.value)
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
            {consultaEditando
              ? "Atualizar Consulta"
              : "Salvar Consulta"}
          </button>
        </form>

        <hr />

        <h2>Consultas cadastradas</h2>

        {consultas.length === 0 ? (
          <p>Nenhuma consulta cadastrada.</p>
        ) : (
          consultas.map((consulta) => (
            <div
              key={consulta.id}
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
                🩺 {buscarNomePet(consulta.petId)}
              </h3>

              <p>
                <strong>Data:</strong>{" "}
                {consulta.dataConsulta}
              </p>

              <p>
                <strong>Clínica:</strong>{" "}
                {consulta.nomeClinica}
              </p>

              <p>
                <strong>Observações:</strong>{" "}
                {consulta.observacoes}
              </p>

              <button
                className="btn-primary"
                onClick={() =>
                  editarConsulta(consulta)
                }
                style={{ marginRight: "10px" }}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                onClick={() =>
                  excluirConsulta(
                    consulta.id
                  )
                }
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Consultas;