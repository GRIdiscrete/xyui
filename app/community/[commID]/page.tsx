
import Nav from "@/components/nsv";

import axios from "axios";

import CommPage from "@/components/commPage";
import { mapItem, Member } from "@/types.db";
import Members from "@/components/members";
import Editor from "@/components/editor";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent2 } from "@/components/map2";
// If you have a custom PageProps type, adjust it to:


type Params = Promise<{ commId: string }>


  const Community2 = async (props: { params: Params }) => {
    const params = await props.params;
    const id = params.commId;

    console.log("-------------------")
    console.log(id)
    // const [map, setMapp] = useState<mapItem[]>([])
    const getData2 = async () => {


        const headers = {
            'x-api-key': 'proTract22$'
        };
        const params = {
            'community_id': id,
            // Add more parameters as needed
        };

        try {
            const response = await axios.get('https://accounts.protracc.com/api/members', {
                headers,
                params
            });

            // Save the data to the state variable
            return response.data.data as Member[]

            


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const getUniqueOrgIds = (dataArray: Member[]): string[] => {
        const orgIds = dataArray.map(item => item.org_id);
        return Array.from(new Set(orgIds));
      };
      
      // Usage

    // await getData()
    const response = await getData2()


    const getData3 = async () => {
        if (response) {
            const uniqueOrgIds = getUniqueOrgIds(response);

    
            // Initialize the map array
            let map: mapItem[] = [];
    
            // Iterate through uniqueOrgIds and fetch data
            for (const x of uniqueOrgIds) { // Use 'of' instead of 'in' to iterate over array values
                try {
                    const response4 = await axios.get('https://accounts.protracc.com/api/getAssets', {
                        headers: {
                            'x-api-key': 'proTract22$'
                        },
                        params: {
                            'org_id': x
                        }
                    });
    
                    // Append the result to map
                    const result = response4.data.data as mapItem[];
                    console.log(result)
                    map = [...map, ...result];
                } catch (error) {
                    console.error(`Error fetching data for org_id ${x}:`, error);
                }
            }
    
            // Return the map array after all iterations
            return map;
        }
    
        return []; // Return an empty array if response is undefined
    };
    
    // Usage Example

    const map = await getData3();
    console.log("Final Map Array:", map);



    return (
        <><div className="flex h-screen">
            <Nav comm={id}/>
            <div className="flex-1 p-4 overflow-y-auto h-full">
                <MapProvider>
                    <MapComponent2 data={map}/>
                </MapProvider>
               <Editor comm={id}/>
                <CommPage comm={id}/>
                <Members members={response}/>
            </div>

        </div>
        </>
    );
}

export default Community2;
