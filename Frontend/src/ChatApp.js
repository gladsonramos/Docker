import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

const ChatApp = () => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [username, setUsername] = useState(""); // Estado para o nome do usuário
  const [isUsernameSet, setIsUsernameSet] = useState(false); // Flag para verificar se o nome já foi definido

  const API_BASE_URL = 'http://54.145.117.35'; // Alterar para o IP quando necessário

  // Conectar ao WebSocket e recuperar mensagens do servidor

  useEffect(() => {
    //const socket = new WebSocket("ws://localhost:5000");
    const socket = new WebSocket(`${API_BASE_URL.replace("http", "ws")}:5000`);

    setWs(socket);

    socket.onopen = async () => {
      console.log("✅ Conectado ao servidor WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.messages) {
        setChatMessages(data.messages);
      }

      if (data.message) {
        setChatMessages((prevMessages) => [
          {
            message: data.message,
            sender_name: data.senderName,
          },
          ...prevMessages,
        ]);

        if (data.senderName === username) return;

        setNewMessage({
          message: data.message || "Nova mensagem recebida!",
          name: data.senderName,
        });
      }
    };

    /*     socket.onclose = () => {
          console.log("🔴 Conexão WebSocket fechada");
        }; */

    /*     socket.onerror = (error) => {
          console.error("⚠️ Erro no WebSocket:", error);
        }; */

    return () => {
      socket.close();
    };
  }, [username]); // Atualiza a conexão sempre que o nome de usuário mudar

  const sendMessage = () => {
    if (ws && message.trim() !== "" && username) {
      ws.send(
        JSON.stringify({ action: "sendMessage", message: message, senderName: username })
      );
      setMessage(""); // Limpa o campo de texto após enviar
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSetUsername = () => {
    if (username.trim() !== "") {
      setIsUsernameSet(true); // Marca o nome como definido
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 5, textAlign: "center", borderRadius: "16px" }}>
        {!isUsernameSet ? (
          <>
            <Typography variant="h6" gutterBottom>
              Com build ooque aconteceu
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Nome de usuário"
              value={username}
              onChange={handleUsernameChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSetUsername}
              sx={{ borderRadius: "25px" }}
            >
              Definir Nome
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#00796b" }}>
              Chat - {username}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column-reverse",
                maxHeight: 400,
                overflowY: "auto",
                bgcolor: "#f5f5f5",
                borderRadius: "8px",
                p: 2,
                mb: 2,
              }}
            >
              {chatMessages.map((msg, index) => (
                <ListItem key={index} sx={{ marginBottom: 1 }}>
                  <ListItemText
                    primary={msg.message}
                    secondary={`De: ${msg.sender_name}`}
                    sx={{
                      bgcolor: msg.sender_name === username ? "#c8e6c9" : "#ffffff",
                      padding: "10px",
                      borderRadius: "20px",
                      boxShadow:
                        msg.sender_name === username
                          ? "2px 2px 6px rgba(0, 128, 128, 0.3)"
                          : "2px 2px 6px rgba(0, 0, 0, 0.1)",
                      marginLeft: msg.sender_name === username ? "auto" : "0",
                      maxWidth: "75%",
                    }}
                  />
                </ListItem>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Digite sua mensagem"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                sx={{
                  borderRadius: "25px",
                  backgroundColor: "#ffffff",
                  padding: "10px",
                  marginRight: "10px",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                sx={{
                  borderRadius: "25px",
                  backgroundColor: "#00796b",
                  padding: "10px 20px",
                  height: "56px",
                  width: "56px",
                }}
              >
                ➤
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={Boolean(newMessage)}
        autoHideDuration={8000}
        onClose={() => setNewMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setNewMessage(null)} severity="info">
          📩 {newMessage?.message} {newMessage?.name && `de ${newMessage.name}`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChatApp;
