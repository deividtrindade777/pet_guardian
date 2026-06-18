import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

export async function gerarNotificacoes() {
  const snapshot = await getDocs(
    collection(db, "vacinas")
  );

  const hoje = new Date();

  for (const vacinaDoc of snapshot.docs) {
    const vacina = vacinaDoc.data();

    if (vacina.concluido) continue;

    const dataEvento = new Date(
      vacina.dataProximaDose
    );

    const diferencaDias = Math.ceil(
      (dataEvento - hoje) /
        (1000 * 60 * 60 * 24)
    );

    if (diferencaDias <= 7) {
      await addDoc(
        collection(db, "notificacoes"),
        {
          userId: auth.currentUser.uid,
          tipo: "vacina",
          titulo: "Vacina próxima",
          mensagem: `A vacina ${vacina.nomeVacina} vence em ${diferencaDias} dias`,
          dataEvento: vacina.dataProximaDose,
          lida: false,
        }
      );
    }
  }
}