import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import Navbar from "../../components/Navbar/Navbar";

function PerfilPet() {
  const [pets, setPets] = useState([]);
  const [petSelecionado, setPetSelecionado] = useState("");

  const [vacinas, setVacinas] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [banhoTosa, setBanhoTosa] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const petsSnap = await getDocs(collection(db, "pets"));
    const vacinasSnap = await getDocs(collection(db, "vacinas"));
    const consultasSnap = await getDocs(collection(db, "consultas"));
    const medicamentosSnap = await getDocs(
      collection(db, "medicamentos")
    );
    const banhoTosaSnap = await getDocs(
      collection(db, "banhoTosa")
    );

    setPets(
      petsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );

    setVacinas(
      vacinasSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );

    setConsultas(
      consultasSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );

    setMedicamentos(
      medicamentosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );

    setBanhoTosa(
      banhoTosaSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  }

  const pet = pets.find(
    (p) => p.id === petSelecionado
  );

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Perfil do Pet</h1>

        <select
          value={petSelecionado}
          onChange={(e) =>
            setPetSelecionado(e.target.value)
          }
          style={{
            marginTop: "20px",
            padding: "10px",
          }}
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

        {pet && (
          <>
            <div
              style={{
                background: "#fff",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "8px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h2>🐾 {pet.nome}</h2>
              <p>Raça: {pet.raca}</p>
              <p>Idade: {pet.idade}</p>
              <p>Peso: {pet.peso} kg</p>
              <p>Tipo: {pet.tipoAnimal}</p>
            </div>

            <h2 style={{ marginTop: "30px" }}>
              💉 Vacinas
            </h2>

            {vacinas
              .filter(
                (v) => v.petId === petSelecionado
              )
              .map((vacina) => (
                <p key={vacina.id}>
                  {vacina.nomeVacina}
                </p>
              ))}

            <h2 style={{ marginTop: "30px" }}>
              🩺 Consultas
            </h2>

            {consultas
              .filter(
                (c) => c.petId === petSelecionado
              )
              .map((consulta) => (
                <p key={consulta.id}>
                  {consulta.dataConsulta} -{" "}
                  {consulta.nomeClinica}
                </p>
              ))}

            <h2 style={{ marginTop: "30px" }}>
              💊 Medicamentos
            </h2>

            {medicamentos
              .filter(
                (m) => m.petId === petSelecionado
              )
              .map((med) => (
                <p key={med.id}>
                  {med.nome}
                </p>
              ))}

            <h2 style={{ marginTop: "30px" }}>
              ✂️ Banho e Tosa
            </h2>

            {banhoTosa
              .filter(
                (b) => b.petId === petSelecionado
              )
              .map((registro) => (
                <p key={registro.id}>
                  Banho: {registro.dataBanho} |
                  Tosa: {registro.dataTosa}
                </p>
              ))}
          </>
        )}
      </div>
    </>
  );
}

export default PerfilPet;