import React, { useEffect, useState, useContext } from "react";
import axios from "../config/axios.js";
import { useLocation } from "react-router-dom";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UserDataContext } from "../context/User.context.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Project = () => {
  const location = useLocation();

  // console.log("location : " , location)

  // Added fallback for missing project data.
  if (!location.state || !location.state.project) {
    return <div>Error: Missing project data.</div>;
  }

  const [isSideOpen, setisSideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [message, setMessage] = useState("");
  // Use optional chaining to safely initialize project state.
  const [project, setproject] = useState(location.state?.project);
  const messageBox = React.createRef();

  const { user } = useContext(UserDataContext);

  // console.log(user)

  // console.log(selectedUserId);

  const [users, setUsers] = useState([]);

  // console.log(location.state);
  // console.log(Array.isArray(selectedUserId))

  // console.log("location is :", location);

  function addCollaborator() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: selectedUserId,
      })
      .then((res) => {
        // console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send message to socket
    sendMessage("project-message", {
      message,
      sender: user._id,
    });

    // Append outgoing message immediately
    appendOutgoingMessage({
      message,
      senderEmail: user.email,
    });

    setMessage("");
  };

  function appendOutgoingMessage(messageObject) {
    const messageBox = document.querySelector(".messageBox");

    const message = document.createElement("div");
    message.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-blue-200",
      "rounded-md",
      "ml-auto"
    );

    message.innerHTML = `
      <small class="opacity-65 text-xs">${messageObject.senderEmail}</small>
      <p class="text-sm">${messageObject.message}</p>
    `;

    message.style.marginBottom = "8px";
    messageBox.appendChild(message);
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  // Function to fetch recent messages from the API
  const fetchRecentMessages = async (projectId) => {
    try {
      const response = await axios.get(`/messages/room/${projectId}`);
      const messages = response.data.messages;

      // Clear existing messages
      const messageBox = document.querySelector(".messageBox");
      if (messageBox) {
        messageBox.innerHTML = "";
      }

      // Render each message
      if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach((msg) => {
          if (msg.senderId === user._id) {
            appendOutgoingMessage({
              message: msg.message,
              senderEmail: msg.senderEmail,
            });
          } else {
            appendIncomingMessage({
              message: msg.message,
              senderEmail: msg.senderEmail,
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load message history");
    }
  };

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      console.log(data);
      appendIncomingMessage(data);
    });

    // Fetch project details
    axios
      .get(`projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setproject(res.data);
        // console.log("project details :", res.data);
      });

    // Fetch all users
    axios.post("/users/all").then((res) => {
      setUsers(res.data);
    });

    // Fetch recent messages
    fetchRecentMessages(project._id);
  }, [location.state.project._id, user?._id]);

  const toggleUserSelection = (userId) => {
    setSelectedUserId(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Remove user if already selected
          : [...prevSelected, userId] // Add user if not selected
    );
  };

  function appendIncomingMessage(messageObject) {
    const messageBox = document.querySelector(".messageBox");

    const message = document.createElement("div");
    message.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-300",
      "rounded-md"
    );

    message.innerHTML = `
      <small class="opacity-65 text-xs">${messageObject.senderEmail}</small>
      <p class="text-sm">${messageObject.message}</p>
    `;

    message.style.marginBottom = "8px";
    messageBox.appendChild(message);

    messageBox.scrollTop = messageBox.scrollHeight;
  }

  return (
    <main className="h-screen w-screen flex">
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="left relative h-screen flex flex-col min-w-96 bg-red-300">
        <header className="flex items-center justify-between p-2 px-4 w-full bg-slate-200">
          <div className="flex gap-4 items-center">
            <button
              className="flex gap-2 items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="ri-add-line"></i>
              <p>Add Collaborator</p>
            </button>
            <h2 className="font-semibold text-lg">
              {project?.projectDetails?.name}
            </h2>
          </div>

          <button className="p-2" onClick={() => setisSideOpen(!isSideOpen)}>
            <i className="ri-group-line"></i>
          </button>
        </header>

        <div className="conversationArea flex-grow flex flex-col">
          <div
            ref={messageBox}
            className="messageBox p-1 flex-grow flex flex-col gap-1 overflow-y-auto"
          >
            {/* Messages will be dynamically added here */}
          </div>

          <form onSubmit={send} className="inputField w-full flex">
            <input
              className="py-3 px-4 border-none w-4/5 outline-none "
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              placeholder="Enter message "
            />
            <button className="flex-grow bg-blue-700">
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </form>
        </div>

        <div
          className={`sidePanel w-full h-full bg-slate-100 flex flex-col gap-2 absolute top-0 ${
            isSideOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between items-center h-14 p-2 px-3 bg-slate-300">
            <h1 className="font-semibold">Collaborators</h1>
            <i
              className="ri-close-large-fill cursor-pointer"
              onClick={() => setisSideOpen(false)}
            ></i>
          </header>

          <div className="users flex flex-col gap-2">
            {project?.projectDetails?.users?.map((user) => (
              <div key={user._id} className="user flex items-center gap-2">
                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-red-300">
                  <i className="ri-user-fill absolute"></i>
                </div>

                <h1 className="font-semibold text-lg cursor-pointer hover:bg-slate-300 p-2">
                  {user.email}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-xl text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Select Users</h2>
            <div className="flex flex-col space-y-2 mb-16 max-h-96 overflow-auto">
              {users.map((user) => (
                <button
                  key={user._id}
                  className={`p-3 rounded-md text-center transition-all ${
                    selectedUserId.includes(user._id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => toggleUserSelection(user._id)}
                >
                  {user.email}
                </button>
              ))}
            </div>
            <button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={() => {
                addCollaborator();
              }}
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}

      {selectedUserId.length > 0 && (
        <p className="mt-4 text-lg text-center w-full">
          Selected User IDs: {selectedUserId.join(", ")}
        </p>
      )}
    </main>
  );
};

export default Project;
