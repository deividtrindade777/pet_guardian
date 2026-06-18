import emailjs from "@emailjs/browser";

export async function enviarEmail(
  email,
  nome,
  tipo,
  mensagem,
  dataEvento
) {
  try {
    await emailjs.send(
      "service_9buxba4",
      "template_w8xjl1k",
      {
        email,
        nome,
        tipo,
        mensagem,
        dataEvento,
      },
      "E2ajjFRuo90roVvTn"
    );

    console.log("E-mail enviado!");
  } catch (error) {
    console.error(error);
  }
}