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

function Medicamentos() {
  const [pets, setPets] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  const [petId, setPetId] = useState("");
  const [nome, setNome] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [medicamentoEditando, setMedicamentoEditando] =
    useState(null);

  useEffect(() => {
    carregarPets();
    carregarMedicamentos();
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

  async function carregarMedicamentos() {
    const snapshot = await getDocs(
      collection(db, "medicamentos")
    );

    const lista = [];

    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setMedicamentos(lista);
  }

  function buscarNomePet(petId) {
    const pet = pets.find(
      (pet) => pet.id === petId
    );

    return pet ? pet.nome : "Pet não encontrado";
  }

  async function cadastrarMedicamento(e) {
    e.preventDefault();

    try {
      if (medicamentoEditando) {
        await updateDoc(
          doc(
            db,
            "medicamentos",
            medicamentoEditando.id
          ),
          {
            petId,
            nome,
            dosagem,
            frequencia,
            dataInicio,
            dataFim,
          }
        );

        alert("Medicamento atualizado!");
      } else {
        await addDoc(
          collection(db, "medicamentos"),
          {
            petId,
            nome,
            dosagem,
            frequencia,
            dataInicio,
            dataFim,
          }
        );

        alert("Medicamento cadastrado!");
      }

      setMedicamentoEditando(null);

      setPetId("");
      setNome("");
      setDosagem("");
      setFrequencia("");
      setDataInicio("");
      setDataFim("");

      await carregarMedicamentos();
    } catch (error) {
      console.error(error);
    }
  }

  function editarMedicamento(medicamento) {
    setMedicamentoEditando(medicamento);

    setPetId(medicamento.petId);
    setNome(medicamento.nome);
    setDosagem(medicamento.dosagem);
    setFrequencia(medicamento.frequencia);
    setDataInicio(medicamento.dataInicio);
    setDataFim(medicamento.dataFim);
  }

  async function excluirMedicamento(id) {
    if (
      !window.confirm(
        "Deseja excluir este medicamento?"
      )
    ) {
      return;
    }

    await deleteDoc(
      doc(db, "medicamentos", id)
    );

    alert("Medicamento removido com sucesso!");

    await carregarMedicamentos();
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Medicamentos</h1>

        <form
          onSubmit={cadastrarMedicamento}
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
            type="text"
            placeholder="Nome do medicamento"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Dosagem"
            value={dosagem}
            onChange={(e) =>
              setDosagem(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Frequência"
            value={frequencia}
            onChange={(e) =>
              setFrequencia(e.target.value)
            }
            required
          />

          <input
            type="date"
            value={dataInicio}
            onChange={(e) =>
              setDataInicio(e.target.value)
            }
            required
          />

          <input
            type="date"
            value={dataFim}
            onChange={(e) =>
              setDataFim(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="btn-primary"
          >
            {medicamentoEditando
              ? "Atualizar Medicamento"
              : "Salvar Medicamento"}
          </button>
        </form>

        <hr />

        <h2>Medicamentos cadastrados</h2>

        {medicamentos.length === 0 ? (
          <p>Nenhum medicamento cadastrado.</p>
        ) : (
          medicamentos.map((medicamento) => (
            <div
              key={medicamento.id}
              style={{
                background: "#fff",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>💊 {medicamento.nome}</h3>

              <p>
                <strong>Pet:</strong>{" "}
                {buscarNomePet(
                  medicamento.petId
                )}
              </p>

              <p>
                <strong>Dosagem:</strong>{" "}
                {medicamento.dosagem}
              </p>

              <p>
                <strong>Frequência:</strong>{" "}
                {medicamento.frequencia}
              </p>

              <p>
                <strong>Início:</strong>{" "}
                {medicamento.dataInicio}
              </p>

              <p>
                <strong>Fim:</strong>{" "}
                {medicamento.dataFim}
              </p>

              <button
                className="btn-primary"
                onClick={() =>
                  editarMedicamento(
                    medicamento
                  )
                }
                style={{ marginRight: "10px" }}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                onClick={() =>
                  excluirMedicamento(
                    medicamento.id
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

export default Medicamentos;