"use client"

import { useState } from 'react';
import { MapComponent } from "@/components/map";
import { MapProvider } from "@/providers/map-provider";
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon,  UserIcon, MapIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon, Navigation2Icon } from 'lucide-react';
import { Community, mapItem } from '@/types.db';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

interface commProps {
  comms: Community[];
  comms2: Community[];
  data: mapItem[]
  // members: Member[] | undefined;
}

const GoogleMap2 = ({comms, comms2, data}: commProps) => {


  const pickRandomItem = (array: Community[]): Community => {
    const randomIndex = Math.floor(Math.random() * array.length);
    const item = array[randomIndex]; // Remove the item from the array
    return item;
  };

  const randomItem = pickRandomItem(comms2);


  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [map, setMap] = useState(true);
  const [members, setMembers] = useState(false);
  const [explore, setExplore] = useState(false);

  const [communityName, setCommunityName] = useState('');
  const [hq, setHq] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter()

  console.log(email)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    const employeesResponse = await axios.post('https://accounts.protracc.com/api/community', {
      // This is the request body
      title: communityName,
      head_quater: hq,
      about: about,
      user_id: sessionStorage.getItem('user')

  }, {
      headers: {
          'x-api-key': 'proTract22$'
      }
  });
  
  
  if(employeesResponse.status == 200){
      setIsModalOpen(false)
      router.push('/')
  }
  
};




  const [isCommunitiesOpen, setIsCommunitiesOpen] = useState(false);

  const toggleCommunitiesDropdown = () => {
    setIsCommunitiesOpen(!isCommunitiesOpen);
  };

  return (


    <div className="flex h-screen">

      {/* Modal Forms */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
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
                        Create Community
                      </h3>
                      <div className="mt-4 w-full">

                          <Input name='title' placeholder='Community Name' onChange={(e) => setCommunityName(e.target.value)} 
                          className='m-2 mt-4' />
                          <Input name='HQ' placeholder='Head Quaters' onChange={(e) => setHq(e.target.value)} className='m-2  mt-4'  />
                          <Input name='about' placeholder='About' onChange={(e) => setAbout(e.target.value)} className='m-2 mt-4' />
                          <Input name='email' placeholder='Contact Email' onChange={(e) => setEmail(e.target.value)} className='m-2 mt-4'  />
                  
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




      {/* Dashboard Navigation */}
        <div className={`bg-white  text-gray-600 text-sm   transition-all ease-in-out duration-800 ${isCollapsed ? 'w-16' : 'w-64'} rounded-md `}>
          <div className="flex flex-col h-full shadow-md">
            {/* Collapse Button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-4 hover:bg-green-700 hover:text-white flex justify-center"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-6 w-6" strokeWidth={1}/>
              ) : (
                <ChevronLeftIcon className="h-6 w-6" strokeWidth={1}/>
              )}
            </button>

            {/* Navigation Items */}
            <nav className="flex-1 px-2 space-y-1">
              <a href="#" onClick={() => {
                router.push(`/`)
          
                  setMap(true)
                  setExplore(false)
                  setMembers(false)
             
                }} className={`cursor-pointer flex items-center p-2 transition-all ease-in-out duration-800 rounded ${map ? 'bg-gray-100 rounded-md ' : ''} hover:bg-green-700 hover:text-white`}>
                <HomeIcon className="h-6 w-6" strokeWidth={1}/>
                {!isCollapsed && <span className="ml-3">Dashboard</span>}
              </a>
  {/* Your Communities (Collapsible Dropdown) */}
  <div className='p-2 border border-gray-200 rounded-md'>
          <button
            onClick={toggleCommunitiesDropdown}
            className="flex items-center justify-between w-full p-2 hover:bg-green-700 transition-all ease-in-out duration-800 hover:text-white rounded"
          >
            <div className="flex items-center">
              <MapIcon className="h-6 w-6" strokeWidth={1} />
              {!isCollapsed && <span className="ml-3">Your Communities</span>}
            </div>
            {!isCollapsed && (isCommunitiesOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />)}
          </button>

          {/* Dropdown Content */}
          {isCommunitiesOpen && !isCollapsed &&  (
            <>
            <div className="ml-6 mt-1 space-y-1">
              {comms.map((community, index) => (
              <a
                key={index}
                onClick={() => {router.push(`community/${community.id}`)}}
                className="block p-2 hover:bg-green-700 transition-all ease-in-out duration-800 hover:text-white rounded cursor-pointer"
              >
                {community.title}
              </a>
            ))}
            </div>
            <Button 
                  variant={"outline"} 
                  className='m-4' 
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Community
            </Button>

            </>
          )}
        </div>
              <a href="#" className={`cursor-pointer flex items-center p-2 transition-all ease-in-out duration-800 rounded ${explore ? 'bg-gray-100 rounded-md ' : ''} hover:bg-green-700 hover:text-white`}
              onClick={() => {
                setMap(false)
                setExplore(true)
                setMembers(false)
              }}>
                <Navigation2Icon className="h-6 w-6" strokeWidth={1}/>
                {!isCollapsed && <span className="ml-3">Explore</span>}
              </a>
              <a href="#" className={`cursor-pointer flex items-center p-2 transition-all ease-in-out duration-800 rounded ${members ? 'bg-gray-100 rounded-md ' : ''} hover:bg-green-700 hover:text-white`}
              onClick={() => {
                                setMap(false)
                                setExplore(false)
                                setMembers(true)
              }}>
                <UserIcon className="h-6 w-6" strokeWidth={1}/>
                {!isCollapsed && <span className="ml-3">Organization Members</span>}
              </a>
            </nav>
            <i className='p-2 text-xs text-center'>powered by <span className='text-green-700'>Protracc</span></i>
          </div>

        </div>



      {/* Map Content */}
          {
            map && (
              <div className="flex-1">
              <MapProvider>
                <MapComponent data={data} />
              </MapProvider>
            </div>
            )
          }




        {/* Explore Section */}
          {explore && (
            <>
        <div className="flex-1 flex-col w-full p-4 z-50 bg-[url('/ddd.png')] bg-contain bg-no-repeat  bg-center bg-opacity-50">

                  <h1 className='text-4xl font-light text-gray-500 '>Explore Communities</h1>
                  

                  <div className=" mt-8 grid grid-cols-3 gap-4 max-h-screen overflow-y-auto p-8">

                    <div className="w-full h-[400px]  p-4 shadow-lg border-gray-200 bg-white rounded-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:translate-y-2 hover:z-50 grid grid-cols-2 col-span-2">
                        <img src={randomItem?.logo || 'https://example.com/default-logo.png'} alt="logo" className='w-2/4 rounded-full mt-4' />
                        <div className="wrap">
                              <h1  className='mt-4 text-xl text-green-700'>{randomItem.title}</h1>
                              <p className='mt-4 text-gray-400'>{randomItem.head_quater}</p>
                            </div>
                            <div className="col-span-2">
                              <h3 className='text-center text-xl text-gray-300 font-light'>50 Members</h3>
                              <p>{randomItem.about}</p>
                              <button className='p-2 border border-green-800 hover:border-gray-300 transition-transform duration-300  text-gray-400 rounded-md mt-2'>View Community</button>
                            </div>
                    </div>
                    {comms2?.filter((person) => person !== randomItem)
                    .map((person) => (
                      <div key={person.id} className="w-full h-[300px]  p-4 shadow-lg border-gray-200 bg-white rounded-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:translate-y-2 hover:z-50 grid grid-cols-2">
                            <img src={person?.logo || 'o'} alt="logo" className='w-2/4 rounded-full mt-4' />
                            <div className="wrap">
                              <h1 className='mt-4 text-xl text-green-700'>{person.title}</h1>
                              <p className='mt-4 text-gray-400'>{person.head_quater}</p>
                            </div>
                            <div className="col-span-2">
                              <h3 className='text-center text-xl text-gray-300 font-light'>50 Members</h3>
                              <p>{person.about}</p>
                              <button className='p-2 border border-green-800 hover:border-gray-300 transition-transform duration-300  text-gray-400 rounded-md mt-2'>View Community</button>
                            </div>
                        </div>
                      ))}

                  </div>

              </div>
            </>
          )}



        {/* Org Members Section */}
        {members && (
                    <div className="flex-1">
            <>
              <div className="flex-1 flex-col w-full p-4 z-50 bg-[url('/ddd.png')] bg-contain bg-no-repeat  bg-center bg-opacity-50">
                  <h1 className='text-4xl font-light text-gray-500 '>Explore Communities</h1>
                  

                  <div className=" mt-8 grid grid-cols-3 gap-4 max-h-screen overflow-y-auto p-8">

                    <div className="grid grid-cols-2 w-full h-[300px] p-4  shadow-lg border-gray-200 col-span-2   bg-white rounded-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:translate-y-2 hover:z-50">
                        <img src={randomItem?.logo || 'https://example.com/default-logo.png'} alt="logo" className='w-full rounded-full mt-4' />
                        <div className="wrap">
                              <h1  className='mt-4 text-xl text-green-700'>{randomItem.title}</h1>
                              <p className='mt-4 text-gray-400'>{randomItem.head_quater}</p>
                            </div>
                            <div className="col-span-2">
                              <h3 className='text-center text-xl text-gray-300 font-light'>50 Members</h3>
                              <p>{randomItem.about}</p>
                              <button className='p-2 border border-green-800 hover:border-gray-300 transition-transform duration-300  text-gray-400 rounded-md mt-2'>View Community</button>
                            </div>
                    </div>
                    {comms2?.filter((person) => person !== randomItem)
                    .map((person) => (
                      <div key={person.id} className="w-full h-[300px]  p-4 shadow-lg border-gray-200 bg-white rounded-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:translate-y-2 hover:z-50 grid grid-cols-2">
                            <img src={person?.logo || 'o'} alt="logo" className='w-2/4 rounded-full mt-4' />
                            <div className="wrap">
                              <h1 className='mt-4 text-xl text-green-700'>{person.title}</h1>
                              <p className='mt-4 text-gray-400'>{person.head_quater}</p>
                            </div>
                            <div className="col-span-2">
                              <h3 className='text-center text-xl text-gray-300 font-light'>50 Members</h3>
                              <p>{person.about}</p>
                              <button className='p-2 border border-green-800 hover:border-gray-300 transition-transform duration-300  text-gray-400 rounded-md mt-2'>View Community</button>
                            </div>
                        </div>
                      ))}

                  </div>

              </div>
            </>
                    </div>
          )}

    </div>
  )
}

export default GoogleMap2;