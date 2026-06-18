import emailjs from "@emailjs/browser";

export async function enviarEmail(
  emailDestino,
  nome,
  tipo,
  mensagem,
  dataEvento
) {
  await emailjs.send(
    "service_9buxba4",
    "template_w8xjl1k",
    {
      to_email: emailDestino,
      nome,
      tipo,
      mensagem,
      dataEvento,
    },
    "E2ajjFRuo90roVvTn"
  );
}