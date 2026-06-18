import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function entrar(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/dashboard");
    } catch (error) {
      setErro("E-mail ou senha inválidos.");
      console.log(error);
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={entrar}>
        <h1>🐾 PetGuardian</h1>

        {erro && <p>{erro}</p>}

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

        <button type="submit">Entrar</button>

        <p>
          Não possui conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}

export default Login;