import React, { useEffect, useState } from "react";
import axios from "../config/axios.js";
import { useLocation } from "react-router-dom";
import { initializeSocket , receiveMessage , sendMessage } from "../config/socket";

const Project = () => {
  const location = useLocation();

  // Added fallback for missing project data.
  if (!location.state || !location.state.project) {
    return <div>Error: Missing project data.</div>;
  }

  const [isSideOpen, setisSideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  // Use optional chaining to safely initialize project state.
  const [project, setproject] = useState(location.state?.project);

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

  useEffect(() => {
    initializeSocket();

    axios
      .get(`projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setproject(res.data);
        // console.log("project details :", res.data);
      });

    axios.post("/users/all").then((res) => {
      setUsers(res.data);
    });
  }, [location.state.project._id]);

  const toggleUserSelection = (userId) => {
    setSelectedUserId(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Remove user if already selected
          : [...prevSelected, userId] // Add user if not selected
    );
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative h-screen flex flex-col min-w-96 bg-red-300">
        <header className="flex justify-between p-2 px-4 w-full bg-slate-200">
          <button
            className="flex gap-2 items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-line"></i>
            <p>Add Collaborator</p>
          </button>

          <button className="p-2" onClick={() => setisSideOpen(!isSideOpen)}>
            <i className="ri-group-line"></i>
          </button>
        </header>

        <div className="conversationArea flex-grow flex flex-col">
          <div className="messageBox p-1 flex-grow flex flex-col gap-1">
            <div className="incomingMsg border rounded-md flex max-w-64 flex-col p-2 px-4 bg-blue-200 w-fit gap-1">
              <small className="opacity-45 text-sm">example@gmail.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit Lorem ipsum dolor sit amet. amet.
              </p>
            </div>

            <div className="ml-auto Msg flex max-w-64 rounded-md flex-col p-2 px-4 bg-blue-200 w-fit gap-1">
              <small className="opacity-45 text-sm">example@gmail.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Fuga, consequatur. amet.
              </p>
            </div>
          </div>

          <div className="inputField w-full flex">
            <input
              className="py-3 px-4 border-none w-4/5 outline-none"
              type="text"
              placeholder="Enter message"
            />
            <button className="flex-grow bg-blue-700">
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
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
