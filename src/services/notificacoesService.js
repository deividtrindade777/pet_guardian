import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebase";
import { enviarEmail } from "./emailService";

export async function criarNotificacao({
  petId,
  tipo,
  mensagem,
  dataEvento,
}) {
  if (!auth.currentUser) return;

  await addDoc(collection(db, "notificacoes"), {
    userId: auth.currentUser.uid,
    petId,
    tipo,
    mensagem,
    dataEvento,
    concluido: false,
  });

  await enviarEmail(
    auth.currentUser.email,
    auth.currentUser.displayName || "tutor",
    tipo,
    mensagem,
    dataEvento
  );
}