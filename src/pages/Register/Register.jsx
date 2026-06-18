import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import "./Register.css";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function cadastrar(e) {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        nome,
        email,
      });

      navigate("/dashboard");
    } catch (error) {
      setErro("Erro ao cadastrar usuário.");
      console.log(error);
    }
  }

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={cadastrar}>
        <h1>🐾 Criar conta</h1>

        {erro && <p>{erro}</p>}

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>

        <p>
          Já tem conta? <a href="/">Entrar</a>
        </p>
      </form>
    </div>
  );
}

export default Register;