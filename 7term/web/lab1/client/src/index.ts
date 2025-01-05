import { io, Socket } from "socket.io-client";

const socket: Socket = io("ws://domain");

const joinForm = document.getElementById("join-form") as HTMLFormElement;
const joinFormError = document.getElementById("join-form-error") as HTMLDivElement;
const joinBox = document.getElementById("join-box") as HTMLDivElement;
const chatBox = document.getElementById("chat-box") as HTMLDivElement;
const chatName = document.getElementById("chat-name") as HTMLHeadingElement;
const getChatInfoButton = document.getElementById("get-chat-info") as HTMLButtonElement;
const displayUsername = document.getElementById("display-username") as HTMLHeadingElement;
const messages = document.getElementById("messages") as HTMLUListElement;
const messageInput = document.getElementById("message") as HTMLInputElement;
const sendMessageButton = document.getElementById("send-message") as HTMLButtonElement;

let username: string;
let chat: string;

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameInput = document.getElementById("join-username") as HTMLInputElement;
  const chatInput = document.getElementById("join-chat-name") as HTMLInputElement;

  username = usernameInput.value;
  chat = chatInput.value;

  socket.emit(
    "chat:join",
    { username, chat },
    ({ success, message }: { success: boolean; message?: string }) => {
      if (!success) {
        joinFormError.innerText = message || "";
      } else {
        joinBox.style.display = "none";
        chatBox.style.display = "flex";
        chatName.innerText = chat;
        displayUsername.innerText = username;
      }
    }
  );
});

getChatInfoButton.addEventListener("click", () => {
  socket.emit("chat:get-info");
});

socket.on("chat-info", (users) => {
  alert(users);
});

function handleSendMessage() {
  const message = messageInput.value;

  if (message.trim() !== "") {
    socket.emit("chat:message", { message });
    messageInput.value = "";
  }
}

sendMessageButton.addEventListener("click", handleSendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});

type IncomingMessage = {
  sender: null | string;
  message: string;
  timestamp: Date;
};

socket.on("message", ({ sender, message: incomingMsg, timestamp }: IncomingMessage) => {
  const isSystemMsg = sender === null;
  const isCurrentUserMsg = sender === username;

  const li = document.createElement("li");
  const messageWrapper = document.createElement("div");
  const usernameBox = document.createElement("div");
  const messageBox = document.createElement("div");

  messageWrapper.classList.add("flex", "flex-col", "max-w-[70%]");

  if (isCurrentUserMsg) {
    messageWrapper.classList.add("items-end");
  }

  li.classList.add("w-full", "flex", "text-base");
  if (isSystemMsg) {
    li.classList.add("flex", "justify-center");
  }
  if (isCurrentUserMsg) {
    li.classList.add("flex", "justify-end");
  }

  messageBox.classList.add(
    "w-full",
    "max-w-fit",
    "px-2",
    "py-1",
    "inline-block",
    "rounded-lg",
    "bg-blue-200",
    "text-base",
    "text-slate-800",
    "break-words"
  );

  if (!isSystemMsg) {
    timestamp = new Date(timestamp);
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    const time = document.createElement("span");
    time.classList.add("text-sm", "text-gray-700");
    time.innerText = ` at ${hours}:${minutes}`;

    usernameBox.classList.add("text-base", "text-gray-800");

    if (isCurrentUserMsg) {
      usernameBox.classList.add("text-right");
      usernameBox.innerText = "You";
    } else {
      usernameBox.innerText = `${sender}`;
    }

    usernameBox.appendChild(time);
    messageWrapper.appendChild(usernameBox);
  }

  messageBox.innerText = incomingMsg;
  messageWrapper.appendChild(messageBox);
  li.appendChild(messageWrapper);

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});
