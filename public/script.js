
const socket = io();

let isLogged = false;

socket.on("user-login", (msg) => {
    const welcomeMessage = document.getElementById("chatBoxx");
    const p = document.createElement("p");

    p.textContent = msg;
    p.classList.add("text-green-400");

    welcomeMessage.appendChild(p);
    scrollMessages();
});

socket.on("user-logout", (msg) => {
    const messagesArea = document.getElementById("chatBoxx");
    const p = document.createElement("p");

    p.textContent = msg;
    p.classList.add("text-red-400");

    messagesArea.appendChild(p);
    scrollMessages();
});

socket.on("chat-message", (msg) => {
    const messagesArea = document.getElementById("chatBoxx");
    const p = document.createElement("p");
    p.textContent = msg;
    messagesArea.appendChild(p);
    messagesArea.scrollTo({
        top: messagesArea.scrollHeight,
        behavior: "smooth"
    });
})

function handleSubmit(event) {
    event.preventDefault();

    const inputName = document.getElementById("name");
    const btonWelcome = document.getElementById("btnLogin");

    if (!isLogged) {

        const name = inputName.value.trim();

        if (name === "") {
            alert("Digite um nick para entrar no chat!");
            return;
        }

        const data = {
            name: name
        }

        socket.emit("username", data);
        inputName.value = "";
        inputName.disabled = true;
        btonWelcome.textContent = "Sair";

        isLogged = true;
        updateChatAccess(true);
    } else {
        socket.emit("logout");

        inputName.disabled = false;
        btnLogin.textContent = "Entrar";

        isLogged = false;
        updateChatAccess(false);
    }
}

function handleSendMessage(event) {
    event.preventDefault();

    const inputMessage = document.getElementById("message");

    const text = inputMessage.value.trim();

    if (text === "") {
        alert("Digite um texto válido para enviar!");
        return;
    }

    socket.emit("textSend", text);
    inputMessage.value = "";
}

function updateChatAccess(logged) {
    const messagesArea = document.getElementById("chatBoxx");
    const inputMessage = document.getElementById("message");
    const btnMsg = document.getElementById("btnMsg");

    messagesArea.classList.toggle("blur-md", !logged);
    inputMessage.disabled = !logged;
    btnMsg.disabled = !logged;
}

function scrollMessages() {
    const messagesArea = document.getElementById("chatBoxx");

    messagesArea.scrollTo({
        top: messagesArea.scrollHeight,
        behavior: "smooth",
    });
}




// npx @tailwindcss/cli -i ./src/input.css -o ./public/output.css --watch