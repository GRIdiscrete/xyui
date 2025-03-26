"use client"

import { Community } from "@/types.db";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import toast from "react-hot-toast";


interface commProps {
    comm: string
}

const Editor = ({comm}: commProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();





    const [communityName, setCommunityName] = useState('');
    const [hq, setHq] = useState('');
    const [about, setAbout] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        const headers = {
          'x-api-key': 'proTract22$'
        };
        const params = {
          'user_id': sessionStorage.getItem('user'),
          // Add more parameters as needed
        };
  
        try {
          const response = await axios.get('https://accounts.protracc.com/api/community', {
            headers,
            params
          });
  
          const data: Community[] = response.data.data as Community[];
          const filteredData = data.find((item) => item.id === comm); // Find the element whose id is equal to the comm prop
            setHq(`${filteredData?.head_quater}`)
            setAbout(`${filteredData?.about}`)
            setEmail(`${filteredData?.id}`)
            setCommunityName(`${filteredData?.title}`) // Save the filtered data to the state variable
      
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      if (typeof window !== 'undefined') {
        const storedUser = sessionStorage.getItem('user');

        if (!storedUser) {
          router.push('/login');
        } else {
          fetchData();
        }
      }
  
    }, [router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
// For a change event on an <input type="file">

  
        // Get the file from the input element
// For a change event on an <input type="file">
      const file = (e.target as HTMLInputElement).files?.[0]; // Access first file

        

              
        
        
        const logoResponse = await axios.put('https://accounts.protracc.com/api/communityLogoUpload', {
            'logo': file,
            'community_id': comm
         }, {
          headers: {
              'x-api-key': 'proTract22$'
          }
         });

         
      
      
      if(logoResponse.status == 200){
        toast.success("Logo Successfully Uploaded")

        const employeesResponse = await axios.put('https://accounts.protracc.com/api/community', {
          'row_id': comm,
          'user_id': sessionStorage.getItem('user'),
          'title': communityName,
          'head_quater': hq,
          'about': about

          }, {
              headers: {
                  'x-api-key': 'proTract22$'
              }
          });

          if(employeesResponse.status == 200){
              toast.success("Community Successfully Updated")
              setIsModalOpen(false)
              router.push('/')
            }

      }
      else{
        toast.error("")
      }
      
    };
    


    return ( <>


{isModalOpen && (
  <div className="fixed z-50 inset-0 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <form  
                onSubmit={handleSubmit}>
        
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-center">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Edit Community
              </h3>
              <div className="mt-4 w-full">
                <p className="text-sm text-gray-400">Add Logo</p>
                  <input name="logo" type="file" placeholder="logo" accept="image/*" className="border border-green-600 rounded-md p-2" />

                  <Input name='title' placeholder={communityName} onChange={(e) => setCommunityName(e.target.value)} 
                  className='m-2 mt-4'/>
                  <Input name='HQ' placeholder={hq} onChange={(e) => setHq(e.target.value)} className='m-2  mt-4'  />
                  <Input name='about' placeholder={about} onChange={(e) => setAbout(e.target.value)} className='m-2 mt-4' />
                  <Input name='email' placeholder={email} onChange={(e) => setEmail(e.target.value)} className='m-2 mt-4'  />
          
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="submit" 
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
 
          >
            Save
          </button>
          <button 
            type="button" 
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
)}




     <div className="flex  space-x-8">
                    <button className="group flex items-center space-x-1 bg-gray-100 p-2 rounded-md transition duration-800 ease-in-out " onClick={() => setIsModalOpen(true)}>
                        <Edit strokeWidth={1} className="text-gray-500 group-hover:text-green-700 transition duration-800 ease-in-out" />
                        <span className="hidden group-hover:inline text-green-700 transition duration-800 ease-in-out">Edit</span>
                    </button>
                    <button className="group flex items-center space-x-1 bg-gray-100 p-2 rounded-md transition duration-800 ease-in-out">
                        <Trash strokeWidth={1}   className="text-gray-500 group-hover:text-green-700 transition duration-800 ease-in-out" />
                        <span className="hidden group-hover:inline text-green-700 transition duration-800 ease-in-out">Delete</span>
                    </button>
                </div>
    </> );
}
 
export default Editor;