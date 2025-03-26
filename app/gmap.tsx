'use client';

import GoogleMap2 from "@/components/googlemap";
import { Community, mapItem, Member } from "@/types.db";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GoogleMap = () => {
  const router = useRouter();
  const [tyin, setTyin] = useState<Community[]>([]);
  const [tyin2, setTyin2] = useState<Community[]>([]); // Initialize the state as an array of Community
  const [map, setMapp] = useState<mapItem[]>([])

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

        const employeesResponse = await axios.get('https://accounts.protracc.com/api/community', {
          headers: {
              'x-api-key': 'proTract22$'
          }
      });


      setTyin2(employeesResponse.data.data as Community[])

        //   const response3 = await axios.get('https://accounts.protracc.com/api/members', {
        //     headers: {
        //       'x-api-key': 'proTract22$'
        //   },
        //   params: {

        //   }
        // });

        const response4 = await axios.get('https://accounts.protracc.com/api/getAssets',{
          headers: {
          'x-api-key': 'proTract22$'
          },
          params: {
            'org_id': 4
          }
        })
        setMapp(response4.data.data as mapItem[])

    // Save the data to the state variable
    return response.data.data as Member[]



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

  return (
    <>
      {tyin.length > 0 ? (
        <GoogleMap2 comms={tyin} comms2={tyin2} data={map} /> // Only render GoogleMap2 when tyin is populated
      ) : (
        <div>Loading...</div> // Show a loading message or spinner while fetching data
      )}
    </>
  );
};

export default GoogleMap;
