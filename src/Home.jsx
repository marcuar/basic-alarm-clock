import {useState, useEffect} from 'react'
import axios from 'axios';
import { v4 } from 'uuid';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alarms, setAlarms] = useState([]);
  const [ formData, setFormData ] = useState({
    title: '',
    content: '',
    completionTime: '',
    userId: ''
  });
  const [ isDeleting, setIsDeleting ] = useState({
    status: false,
    id: null,
  });

  useEffect(() => {
    let userId;
    if(localStorage.getItem('eventManagerUserId') === null) {
      userId = v4();
      setFormData({...formData, userId});
      localStorage.setItem('eventManagerUserId', userId);
    } else {
      setFormData({...formData, userId: localStorage.getItem('eventManagerUserId')});
    }
    const fetchAlarms = async () => {
      try {
        userId = localStorage.getItem('eventManagerUserId');
        const alarms = await axios.get(`https://basic-alarm-clock-server.onrender.com/alarms?userId=${userId}`, {})
        console.log(alarms)
        if(alarms.data) {
          setIsLoading(false);
          console.log(alarms.data);
          setAlarms(alarms.data);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    }
    fetchAlarms();
  }, [])

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    axios.post('https://basic-alarm-clock-server.onrender.com/alarms', formData)
      .then((res) => {
        console.log(res.data);
        setAlarms(res.data);
        setIsAdding(false);
        setFormData({
          title: '',
          content: '',
          completionTime: '',
          userId: localStorage.getItem('eventManagerUserId')
        });
      })
      .catch((err) => {
        console.error(err);
        setIsAdding(false);
      });
  }

  const handleDelete = async (id) => {
    if(!id) return;
    setIsDeleting({status: true, id});
    try {
      const res = await axios.delete(`https://basic-alarm-clock-server.onrender.com/alarms?id=${id}`);
      console.log(res.data);
      setAlarms(res.data);
      setIsDeleting({status: false, id: null});
    } catch (err) {
      console.error(err);
      setIsDeleting({status: false, id: null});
    }
  }

  return (
    <>
      <header className="bg-black p-4 h-12 flex items-center justify-between">
        <h1 className="text-white text-md font-poppins">Event Manager</h1>
      </header>
      <main style={{height: "calc(100vh - 40px)"}} className="flex flex-col items-center justify-start p-3">
        <form onSubmit={(e) => handleSubmit(e)} className="w-full max-w-md rounded-md flex flex-col gap-2 items-center justify-center">
          <div className="w-full">
            <label className="absolute -left-[10000px]">Title</label>
            <input name='title' value={formData.title} onChange={(e)=>handleInputChange(e)} type="text" className="w-full border border-[#cbf61e] font-poppins text-[0.9rem] px-2 py-1 rounded-sm inset-shadow-xs outline-none" placeholder="Event Title" required/>
          </div>
          <div className="w-full">
            <label className="absolute -left-[10000px]">Event</label>
            <textarea name='content' value={formData.content} onChange={(e)=>handleInputChange(e)}  type="text" className="w-full border border-[#07d255] font-poppins text-[0.9rem] px-2 py-1 rounded-sm inset-shadow-xs outline-none" placeholder="Content" required/>
          </div>
          <div className="w-full -mt-1">
            <label className="absolute -left-[10000px]">Event</label>
            <input name='completionTime' value={formData.completionTime} onChange={(e)=>handleInputChange(e)}  type="datetime-local" className="w-full border border-[#ddd] font-poppins text-[0.9rem] px-2 py-1 rounded-sm inset-shadow-xs outline-none cursor-pointer" required/>
          </div>
          <button type='submit' className="bg-black py-[5px] w-full font-bold rounded-sm text-white cursor-pointer hover:opacity-85 transition-all">{isAdding ? "Adding..." : "Add"}</button>
        </form>
        {isLoading ? <p className='mt-5'>Loading...</p> : (alarms && alarms.length < 0 ) ? <p>No event yet!</p> : <section className='w-full max-w-md flex flex-col items-center justify-start mt-1'>
          {alarms.sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0).map((alarm) => <article key={alarm._id} className="w-full max-w-md bg-blue-950 p-3 rounded-md my-1 shadow-sm flex justify-between">
            <div>
              <h2 className="text-[1.1rem] text-white font-bold font-poppins">{alarm.title}</h2>
              <p className="text-[0.9rem] text-white font-poppins">{alarm.content}</p>
              <p className="text-[0.7rem] text-gray-400 font-poppins">Created at: {new Date(alarm.createdAt).toLocaleString()}</p>
              <p className="text-[0.7rem] text-gray-400 font-poppins">Completion Time: {new Date(alarm.completionTime).toLocaleString()}</p>
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
              <Link to={`/edit-event/${alarm._id}`} className='text-blue-950 bg-white py-1 px-3 font-poppins text-[0.8rem] rounded-sm w-20 cursor-pointer hover:opacity-95 transition-all flex items-center justify-center'>
                Edit
              </Link>
              <button onClick={() => handleDelete(alarm._id)} className='text-white bg-red-500 py-1 px-3 font-poppins text-[0.8rem] rounded-sm w-20 cursor-pointer hover:opacity-95 transition-all'>
                {(isDeleting.status && isDeleting.id === alarm._id) ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>)}
        </section>}
      </main>
    </>
  )
}

export default Home