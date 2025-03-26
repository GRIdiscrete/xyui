"use client"

import { Community } from "@/types.db";
import axios from "axios";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, HomeIcon, MapIcon,  UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { InvitationsList } from "./invitations";


interface commProps {
    comm: string
  }
const Nav = ({comm}:commProps) => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const router = useRouter();
  const [tyin, setTyin] = useState<Community[]>([]); // Initialize the state as an array of Community

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
        setTyin(data); // Save the data to the state variable


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

  const [isModalOpen, setIsModalOpen] = useState(false);

  
    const [isCommunitiesOpen, setIsCommunitiesOpen] = useState(false);
  
    const toggleCommunitiesDropdown = () => {
      setIsCommunitiesOpen(!isCommunitiesOpen);
    };
    return ( <>


    {/* Modal for Join Requests */}
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Join Requests</DialogTitle>
                        <X
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none cursor-pointer" 
                            onClick={() => setIsModalOpen(false)}
                        />
                    </DialogHeader>
                    <InvitationsList commu={comm} /> {/* Replace with your actual community ID */}
                </DialogContent>
            </Dialog>




      {/* Dashboard Navigation */}
      <div className={`bg-white  text-gray-600 text-sm   transition-all ease-in-out duration-800 ${isCollapsed ? 'w-16' : 'w-64'} rounded-md`}>
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
            <a href="#" onClick={() => {router.push(`/`)}}  className="cursor-pointer flex items-center p-2 hover:bg-green-700 transition-all ease-in-out duration-800 hover:text-white rounded">
              <HomeIcon className="h-6 w-6" strokeWidth={1}/>
              {!isCollapsed && <span className="ml-3">Home</span>}
            </a>
             {/* Modified Join Requests button */}
             <a 
                    href="#" 
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer flex items-center p-2 hover:bg-green-700 transition-all ease-in-out duration-800 hover:text-white rounded"
                >
                    <UserIcon className="h-6 w-6" strokeWidth={1}/>
                    {!isCollapsed && <span className="ml-3">Join Requests</span>}
                </a>
 {/* Your Communities (Collapsible Dropdown) */}
 <div>
        <button
          onClick={toggleCommunitiesDropdown}
          className="cursor-pointer border border-gray-300 rounded-md flex items-center justify-between w-full p-2 hover:bg-green-700 transition-all ease-in-out duration-800 hover:text-white rounded"
        >
          <div className="flex items-center">
            <MapIcon className="h-6 w-6" strokeWidth={1} />
            {!isCollapsed && <span className="ml-3">Your Communities</span>}
          </div>
          {!isCollapsed && (isCommunitiesOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />)}
        </button>

        {/* Dropdown Content */}
        {isCommunitiesOpen && !isCollapsed && (<>
          <div className="ml-6 mt-1 space-y-1">
            {tyin.map((community, index) => (
            <a
              key={index}
              onClick={() => {router.push(`community/${community.id}`)}}
              className="cursor-pointer  block p-2 hover:bg-green-700 transition-all ease-in-out duration-800 hover:text-white rounded"
            >
              {community.title}
            </a>
          ))}
          </div>
           </>
        )}
      </div>
            
          </nav>
          <i className='p-2 text-xs text-center'>powered by <span className='text-green-700'>Protracc</span></i>
        </div>

      </div>
    </> );
}
 
export default Nav;