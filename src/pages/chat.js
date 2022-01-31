import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwMzMxOCwiZXhwIjoxOTU4OTc5MzE4fQ.l8F2dmBPh_ml-4auo4aw4tgAdJcFHZzlGwRjSG1C8dc";
const SUPABASE_URL = "https://tjykzvzphnruerafmjcw.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (respostaLive) => {
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaMensagens, setListaMensagens] = React.useState([]);
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        //console.log("Dados da consulta:", data);
        setListaMensagens(data);
      });

    escutaMensagemEmTempoReal((novaMensagem) => {
      console.log("Nova mensagem:", novaMensagem);
      setListaMensagens((valorAtualDaLista) => {
        return [novaMensagem, ...valorAtualDaLista];
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([
        // Tem que ser um objeto com os mesmos campos que escreveu no supabase
        mensagem,
      ])
      .then(({ data }) => {
        console.log("Criando mensagem: ", data);
      });

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
          "url(https://images7.alphacoders.com/798/thumb-1920-798461.jpg)",
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
          backgroundColor: appConfig.theme.colors.neutrals[600],
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
            backgroundColor: appConfig.theme.colors.neutrals[700],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
            opacity: 0.8,
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
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                console.log(
                  "[Usando o componente] Salva esse stick no banco",
                  sticker
                );
                handleNovaMensagem(":sticker: " + sticker);
              }}
            />
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              // verifica se o enter vai ser pressionado
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  // retira o comportamento padrão do enter (quebra de linha)
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                height: "100%",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[600],
                marginRight: "6px",
                color: appConfig.theme.colors.neutrals[100],
                opacity: 0.9,
              }}
            />

            <Button
              size="lg"
              variant="primary"
              colorVariant="light"
              label={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="24"
                  viewBox="0 0 24 20"
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
                mainColor: appConfig.theme.colors.neutrals[600],
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
                handleNovaMensagem(mensagem);
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
          color: appConfig.theme.colors.neutrals["100"],
        }}
      >
        <Text variant="heading4" colorVariant="light">
          Chat
        </Text>
        <Button
          variant="tertiary"
          colorVariant="light"
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
                src={`https://github.com/${mensagem.de}.png`}
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
                styleSheet={{
                  borderRadius: "25%",
                  width: "12px",
                  marginLeft: "8px",
                }}
                variant="tertiary"
                colorVariant="neutral"
                label={
                  <svg
                    xmlns="https://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-trash"
                    color="white"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                }
                buttonColors={{
                  variant: "tertiary",
                  colorVariant: "neutral",
                }}
                // chama a função para excluir a mensagem
                onClick={(event) => {
                  event.preventDefault();
                  handleDeleteMensagem(mensagem);
                }}
              />
            </Box>
            {/*Declarativo*/}
            {/*Condicional: {mensagem.texto.startsWith(':sticker').toString()}*/}
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
            {/*
              /* if mensagem de texto possui stickers: 
              mostra a imagem
              else
              mensagem.texto 
              {/*
                /* {mensagem.texto}*/}
          </Text>
        );
      })}
    </Box>
  );
}
