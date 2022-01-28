import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaMensagens, setListaMensagens] = React.useState([]);

  function handleNovaMensage(novaMensagem) {
  
    const mensagem = {
      id: listaMensagens.length + 1, 
      de: "leandroaugust0",
      texto: novaMensagem,
    };

    setListaMensagens([
      mensagem,
      ...listaMensagens,
    ]);
    setMensagem("");
  }

  function handleDeleteMensagem(mensagemAtual) {
   
    const id = mensagemAtual.id;
 
    const messagesListFiltered = listaMensagens.filter((message) => {
      return message.id != id;
    });
    setListaMensagens(messagesListFiltered);
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url(https://initiate.alphacoders.com/images/798/stretched-1920-1081-798461.jpg?3881)",
        width: "100%",
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[100],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
          opacity: 0.9,
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[200],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
            opacity: 0.7,
          }}
        >
          <MessageList
            mensagens={listaMensagens}
            handleDeleteMensagem={handleDeleteMensagem}
          />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "row",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              // verifica se o enter vai ser pressionado
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  // retira o comportamento padrão do enter (quebrar uma linha)
                  event.preventDefault();
                  handleNovaMensage(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[700],
                marginRight: "6px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              size="lg"
              variant="primary"
              colorVariant="dark"
              label={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-send"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              }
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.neutrals[800],
                mainColorLight: appConfig.theme.colors.neutrals[900],
                mainColorStrong: appConfig.theme.colors.neutrals[900],
              }}
              styleSheet={{
                borderRadius: "5px",
              }}
              onClick={(event) => {
                // retirar o comportamento padrão do enter (quebrar uma linha)
                event.preventDefault();
                // função pra enviar a msg
                handleNovaMensage(mensagem);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label={"Logout"}
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  const handleDeleteMensagem = props.handleDeleteMensagem;

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        // pra cada item do array ele vai retornar:
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/leandroaugust0.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>

              <Button
                /* botão para excluir a mensagem */
                styleSheet={{
                  borderRadius: "25%",
                  width: "12px",
                  marginLeft: "8px",
                }}
                variant="tertiary"
                colorVariant="neutral"
                label={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-trash"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                }
                buttonColors={{
                  variant: "tertiary",
                  colorVariant: "neutral",
                }}
                // quando clicar vai chamar a função de excluir a mensagem
                onClick={(event) => {
                  event.preventDefault();
                  handleDeleteMensagem(mensagem);
                }}
              />
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
