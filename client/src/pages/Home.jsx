import {React, useContext, useState, useEffect} from 'react'
import { UserDataContext } from '../context/User.context'
import {Link,useNavigate} from 'react-router-dom'
import axios from '../config/axios.js'

const Home = () => {

    const [isModalOpen, setisModalOpen] = useState(false);

    const { user, setUser } = useContext(UserDataContext);
    const [projectName, setprojectName] = useState('');
    const [project, setproject] = useState([])

    const navigate = useNavigate()



    function createProject(e) {
         e.preventDefault();
        //  console.log(user);
         
        axios.post('/projects/create',
            {
                name: projectName
            }).then((res) => {
                // console.log(res);
            }).catch((err) => {
                console.log(err);
            })
         console.log("project name", projectName);
         setisModalOpen(false);
         setprojectName('');
    }

    useEffect(()=>{
       axios.get('/projects/all')
       .then((res)=>{
        // console.log(res.data)
        setproject(res.data.projects)
       }).catch((err)=>{
        console.log(err)
       })
    },[])

  return (
    <main className="p-4">
        <div className='projects flex flex-wrap gap-3'>
            <button onClick={() => setisModalOpen(true)} className='project p-4 border border-slate-400 rounded-md'>
                 Create a new project <i className="ri-link"></i>
            </button>
     
     {
      project.map((project)=>(
         
        <div onClick={() => {
          navigate('/project',{
            state : {project}
          }
          )
        }}
        
        key={project._id}  className='project items-center justify-center hover:bg-red-400 p-4 flex flex-col cursor-pointer border min-w-56 border-slate-400 rounded-md'>
           <p  className='text-bold' >projectName : {project.name}</p>
            {/* <i className='ri-link ml-2'></i> */}

            <div className='flex gap-1'>
            <p>collaborator <i className="ri-user-line bold"></i> :</p>
              <h2>{project.users.length}</h2>
            </div>
        </div>
      ))
     }

        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-md p-4">
                <h2>Create a new project</h2>
              <form onSubmit={createProject}>
                <div className="mb-2">
                  <label htmlFor="name" className="block mb-1">Name</label>
                  <input onChange={(e) => setprojectName(e.target.value)} value={projectName} type="text" id="name" name="name" className="border border-slate-400 p-2 rounded-md w-full" />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Create</button>
                  <button type="button" onClick={() => setisModalOpen(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                </div>
              </form>
              <button onClick={() => setisModalOpen(false)} className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">X</button>
            </div>
          </div>
        )}
        
      

    </main>
  )
}

export default Home