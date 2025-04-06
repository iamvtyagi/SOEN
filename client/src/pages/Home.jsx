import React, { useContext, useState, useEffect } from 'react';
import { UserDataContext } from '../context/User.context';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';

const Home = () => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const { user, setUser } = useContext(UserDataContext);
  const [projectName, setprojectName] = useState('');
  const [project, setproject] = useState([]); // ✅ initialized to []

  const navigate = useNavigate();

  console.log(user)

  function createProject(e) {
    e.preventDefault();

    axios
      .post('/projects/create', {
        name: projectName,
      })
      .then((res) => {
        // Optionally update project list after creation
        fetchProjects(); // ⬅ auto-update list
      })
      .catch((err) => {
        console.log(err);
      });

    console.log('project name', projectName);
    setisModalOpen(false);
    setprojectName('');
  }

  function fetchProjects() {
    axios
      .get('/projects/all')
      .then((res) => {
        const fetchedProjects = res.data.projects;
        setproject(Array.isArray(fetchedProjects) ? fetchedProjects : []);
      })
      .catch((err) => {
        console.log(err);
        setproject([]); // fallback to avoid undefined
      });
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setisModalOpen(true)}
          className="project p-4 border border-slate-400 rounded-md"
        >
          Create a new project <i className="ri-link"></i>
        </button>

        {/* ✅ Safe map check */}
        {Array.isArray(project) &&
          project.map((project) => (
            <div
              onClick={() =>
                navigate('/project', {
                  state: { project },
                })
              }
              key={project._id}
              className="project items-center justify-center hover:bg-red-400 p-4 flex flex-col cursor-pointer border min-w-56 border-slate-400 rounded-md"
            >
              <p className="font-bold">projectName: {project.name}</p>

              <div className="flex gap-1">
                <p>
                  collaborator <i className="ri-user-line bold"></i>:
                </p>
                <h2>{project.users.length}</h2>
              </div>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white relative rounded-md p-4">
            <h2 className="text-lg font-bold mb-2">Create a new project</h2>
            <form onSubmit={createProject}>
              <div className="mb-2">
                <label htmlFor="name" className="block mb-1">
                  Name
                </label>
                <input
                  onChange={(e) => setprojectName(e.target.value)}
                  value={projectName}
                  type="text"
                  id="name"
                  name="name"
                  className="border border-slate-400 p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setisModalOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
            <button
              onClick={() => setisModalOpen(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full"
            >
              X
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
