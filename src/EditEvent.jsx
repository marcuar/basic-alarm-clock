import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { parseISO, format } from 'date-fns'

const EditEvent = () => {
  const {id} = useParams();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ formData, setFormData ] = useState({
    id,
    title: '',
    content: '',
    completionTime: '',
    userId: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const alarm = await axios.get(`http://localhost:3500/alarms/${id}`, {})
        if(alarm.data) {
          console.log(alarm.data.completionTime)
          setFormData({
            ...formData,
            title: alarm.data.title,
            content: alarm.data.content,
            completionTime: format(parseISO(alarm.data.completionTime), "yyyy-MM-dd'T'HH:mm"),
            userId: alarm.data.userId,
          })
          setIsLoading(false);
          console.log(alarm.data);
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
    console.log(e.target.value);
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData);
  await axios.patch('http://localhost:3500/alarms', formData)
    .then((res) => {
      setIsUpdating(false);
      console.log(res.data);
      navigate('/');
      setFormData({
        title: '',
        content: '',
        completionTime: '',
        userId: localStorage.getItem('eventManagerUserId')
      });
    })
    .catch((err) => {
      console.error(err);
      setIsUpdating(false);
    });
  }

  return (
    <>
      <header className="bg-black p-4 h-12 flex items-center justify-between">
        <h1 className="text-white text-md font-poppins">Event Manager</h1>
      </header>
      <main style={{height: "calc(100vh - 40px)"}} className="flex flex-col items-center justify-start p-3">
        {isLoading ? <p>Loading...</p> :  <form onSubmit={(e) => handleSubmit(e)} className="w-full max-w-md rounded-md flex flex-col gap-2 items-center justify-center">
          <div className="w-full">
            <label className="absolute -left-[10000px]">Title</label>
            <input name='title' value={formData.title} onChange={(e)=>handleInputChange(e)} type="text" className="w-full border border-[#ddd] font-poppins text-[0.9rem] px-2 py-1 rounded-sm inset-shadow-xs outline-none" placeholder="Event Title" required/>
          </div>
          <div className="w-full">
            <label className="absolute -left-[10000px]">Event</label>
            <textarea name='content' value={formData.content} onChange={(e)=>handleInputChange(e)}  type="text" className="w-full border border-[#ddd] font-poppins text-[0.9rem] px-2 py-1 rounded-sm inset-shadow-xs outline-none" placeholder="Content" required/>
          </div>
          <div className="w-full -mt-1">
            <label className="absolute -left-[10000px]">Event</label>
            <input name='completionTime' value={formData.completionTime} onChange={(e)=>handleInputChange(e)}  type="datetime-local" className="w-full border border-[#ddd] font-poppins text-[0.9rem] px-2 py-1 rounded-sm inset-shadow-xs outline-none cursor-pointer" required/>
          </div>
          <button type='submit' className="bg-black py-[5px] w-full font-bold rounded-sm text-white cursor-pointer hover:opacity-85 transition-all">{isUpdating ? "Updating..." : "Update"}</button>
        </form>}
      </main>
    </>
  ) 
}

export default EditEvent