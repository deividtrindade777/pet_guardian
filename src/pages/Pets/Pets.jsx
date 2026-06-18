import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../components/Navbar/Navbar";

function Pets() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [raca, setRaca] = useState("");
  const [peso, setPeso] = useState("");
  const [tipoAnimal, setTipoAnimal] = useState("");

  const [pets, setPets] = useState([]);
  const [petEditando, setPetEditando] = useState(null);

  async function carregarPets() {
    try {
      const q = query(
        collection(db, "pets"),
        where("userId", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      const listaPets = [];

      querySnapshot.forEach((doc) => {
        listaPets.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPets(listaPets);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        carregarPets();
      }
    });

    return () => unsubscribe();
  }, []);

  async function cadastrarPet(e) {
    e.preventDefault();

    try {
      if (petEditando) {
        await updateDoc(
          doc(db, "pets", petEditando.id),
          {
            nome,
            idade,
            raca,
            peso,
            tipoAnimal,
          }
        );

        alert("Pet atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "pets"), {
          userId: auth.currentUser.uid,
          nome,
          idade,
          raca,
          peso,
          tipoAnimal,
        });

        alert("Pet cadastrado com sucesso!");
      }

      setPetEditando(null);

      setNome("");
      setIdade("");
      setRaca("");
      setPeso("");
      setTipoAnimal("");

      await carregarPets();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar pet.");
    }
  }

  async function excluirPet(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este pet?"
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "pets", id));

      alert("Pet removido com sucesso!");

      await carregarPets();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir pet.");
    }
  }

  function editarPet(pet) {
    setPetEditando(pet);

    setNome(pet.nome);
    setIdade(pet.idade);
    setRaca(pet.raca);
    setPeso(pet.peso);
    setTipoAnimal(pet.tipoAnimal);
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Meus Pets</h1>

        <form
          onSubmit={cadastrarPet}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "400px",
            marginTop: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Nome do pet"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Raça"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Peso (kg)"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Tipo do animal"
            value={tipoAnimal}
            onChange={(e) => setTipoAnimal(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn-primary"
          >
            {petEditando
              ? "Atualizar Pet"
              : "Cadastrar Pet"}
          </button>
        </form>

        <hr style={{ margin: "30px 0" }} />

        <h2>Pets cadastrados</h2>

        {pets.length === 0 ? (
          <p>Nenhum pet cadastrado.</p>
        ) : (
          pets.map((pet) => (
            <div
              key={pet.id}
              style={{
                background: "#fff",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>🐾 {pet.nome}</h3>

              <p>Raça: {pet.raca}</p>
              <p>Idade: {pet.idade} anos</p>
              <p>Peso: {pet.peso} kg</p>
              <p>Tipo: {pet.tipoAnimal}</p>

              <button
                className="btn-primary"
                onClick={() => editarPet(pet)}
                style={{ marginRight: "10px" }}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                onClick={() => excluirPet(pet.id)}
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

export default Pets;