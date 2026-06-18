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
import { auth, db } from "../../services/firebase";
import Navbar from "../../components/Navbar/Navbar";
import { criarNotificacao } from "../../services/notificacoesService";

function Vacinas() {
  const [pets, setPets] = useState([]);
  const [vacinas, setVacinas] = useState([]);

  const [petId, setPetId] = useState("");
  const [nomeVacina, setNomeVacina] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [dataProximaDose, setDataProximaDose] = useState("");

  const [vacinaEditando, setVacinaEditando] =
    useState(null);

  useEffect(() => {
    carregarPets();
    carregarVacinas();
  }, []);

  async function carregarPets() {
    try {
      const q = query(
        collection(db, "pets"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPets(lista);
    } catch (error) {
      console.error(error);
    }
  }

  async function carregarVacinas() {
    try {
      const q = query(
        collection(db, "vacinas"),
        where(
          "userId",
          "==",
          auth.currentUser.uid
        )
      );

      const snapshot = await getDocs(q);

      const lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setVacinas(lista);
    } catch (error) {
      console.error(error);
    }
  }

  function buscarNomePet(petId) {
    const pet = pets.find(
      (pet) => pet.id === petId
    );

    return pet
      ? pet.nome
      : "Pet não encontrado";
  }

  function editarVacina(vacina) {
    setVacinaEditando(vacina);

    setPetId(vacina.petId);
    setNomeVacina(vacina.nomeVacina);
    setDataAplicacao(vacina.dataAplicacao);
    setDataProximaDose(
      vacina.dataProximaDose
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function cadastrarVacina(e) {
    e.preventDefault();

    try {
      if (vacinaEditando) {
        await updateDoc(
          doc(
            db,
            "vacinas",
            vacinaEditando.id
          ),
          {
            petId,
            nomeVacina,
            dataAplicacao,
            dataProximaDose,
          }
        );

        alert("Vacina atualizada!");
      } else {
        await addDoc(
          collection(db, "vacinas"),
          {
            userId: auth.currentUser.uid,
            petId,
            nomeVacina,
            dataAplicacao,
            dataProximaDose,
            concluido: false,
          }
        );

        await criarNotificacao({
          petId,
          tipo: "Vacina",
          mensagem: `Vacina ${nomeVacina} próxima do vencimento`,
          dataEvento: dataProximaDose,
        });

        alert("Vacina cadastrada!");
      }

      setVacinaEditando(null);

      setPetId("");
      setNomeVacina("");
      setDataAplicacao("");
      setDataProximaDose("");

      await carregarVacinas();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar vacina.");
    }
  }

  async function excluirVacina(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta vacina?"
    );

    if (!confirmar) return;

    try {
      const vacina = vacinas.find((v) => v.id === id);

      const notificacoesSnapshot = await getDocs(
        query(
          collection(db, "notificacoes"),
          where("userId", "==", auth.currentUser.uid),
          where("petId", "==", vacina.petId)
        )
      );

      for (const documento of notificacoesSnapshot.docs) {
        const notificacao = documento.data();

        if (
          notificacao.tipo === "Vacina" &&
          notificacao.dataEvento === vacina.dataProximaDose
        ) {
          await deleteDoc(
            doc(db, "notificacoes", documento.id)
          );
        }
      }

      await deleteDoc(doc(db, "vacinas", id));

      alert("Vacina removida com sucesso!");

      await carregarVacinas();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir vacina.");
    }
  }

  async function concluirVacina(id) {
    try {
      const vacina = vacinas.find(
        (v) => v.id === id
      );

      await updateDoc(
        doc(db, "vacinas", id),
        {
          concluido: true,
        }
      );

      const notificacoesSnapshot = await getDocs(
        query(
          collection(db, "notificacoes"),
          where("petId", "==", vacina.petId)
        )
      );

      for (const documento of notificacoesSnapshot.docs) {
        const notificacao = documento.data();

        if (
          notificacao.tipo === "Vacina" &&
          notificacao.dataEvento === vacina.dataProximaDose
        ) {
          await deleteDoc(
            doc(db, "notificacoes", documento.id)
          );
        }
      }

      alert("Vacina marcada como concluída!");

      await carregarVacinas();
    } catch (error) {
      console.error(error);
      alert("Erro ao concluir vacina.");
    }
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Controle de Vacinas</h1>

        <form
          onSubmit={cadastrarVacina}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "500px",
            marginTop: "20px",
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
            placeholder="Nome da vacina"
            value={nomeVacina}
            onChange={(e) =>
              setNomeVacina(
                e.target.value
              )
            }
            required
          />

          <input
            type="date"
            value={dataAplicacao}
            onChange={(e) =>
              setDataAplicacao(
                e.target.value
              )
            }
            required
          />

          <input
            type="date"
            value={dataProximaDose}
            onChange={(e) =>
              setDataProximaDose(
                e.target.value
              )
            }
            required
          />

          <button
            type="submit"
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {vacinaEditando
              ? "Atualizar Vacina"
              : "Salvar Vacina"}
          </button>
        </form>

        <hr
          style={{
            margin: "30px 0",
          }}
        />

        <h2>Vacinas cadastradas</h2>

        {vacinas.length === 0 ? (
          <p>
            Nenhuma vacina cadastrada.
          </p>
        ) : (
          vacinas.map((vacina) => (
            <div
              key={vacina.id}
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
                💉 {vacina.nomeVacina}
              </h3>

              <p>
                <strong>Pet:</strong>{" "}
                {buscarNomePet(
                  vacina.petId
                )}
              </p>

              <p>
                <strong>
                  Aplicação:
                </strong>{" "}
                {
                  vacina.dataAplicacao
                }
              </p>

              <p>
                <strong>
                  Próxima dose:
                </strong>{" "}
                {
                  vacina.dataProximaDose
                }
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {
                  vacina.concluido ? "✅ Concluída" : "⏳ Pendente"
                }
              </p>

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() =>
                    editarVacina(
                      vacina
                    )
                  }
                  style={{
                    background:
                      "#1976d2",
                    color: "white",
                    border: "none",
                    padding:
                      "8px 12px",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    excluirVacina(
                      vacina.id
                    )
                  }
                  style={{
                    background:
                      "#d32f2f",
                    color: "white",
                    border: "none",
                    padding:
                      "8px 12px",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                  }}
                >
                  Excluir
                </button>

                <button
                  onClick={() => concluirVacina(vacina.id)}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
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
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Vacinas;