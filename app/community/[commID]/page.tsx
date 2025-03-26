import Nav from "@/components/nsv";
import CommPage from "@/components/commPage";
import { mapItem, Member } from "@/types.db";
import Members from "@/components/members";
import Editor from "@/components/editor";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent2 } from "@/components/map2";

type Params = Promise<{ commId: string }>


  const Community2 = async (props: { params: Params }) => {
    const params = await props.params;
    const id = params.commId;

    
  const fetchMembers = async (): Promise<Member[] | null> => {
    try {
      const response = await fetch(
        `https://accounts.protracc.com/api/members?community_id=${id}`,
        {
          headers: {
            'x-api-key': 'proTract22$',
          },
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      return data.data as Member[];
    } catch (error) {
      console.error('Error fetching members:', error);
      return null;
    }
  };

  const fetchAssets = async (orgId: string): Promise<mapItem[] | null> => {
    try {
      const response = await fetch(
        `https://accounts.protracc.com/api/getAssets?org_id=${orgId}`,
        {
          headers: {
            'x-api-key': 'proTract22$',
          },
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch assets');
      const data = await response.json();
      return data.data as mapItem[];
    } catch (error) {
      console.error(`Error fetching assets for org ${orgId}:`, error);
      return null;
    }
  };

  const members = await fetchMembers();
  
  const mapData = members 
    ? (await Promise.all(
        Array.from(new Set(members.map(m => m.org_id)))
          .map(async orgId => await fetchAssets(orgId))
      )).flat().filter(Boolean) as mapItem[]
    : [];

  if (!members) {
    return <div>Error loading community data</div>;
  }

  return (
    <div className="flex h-screen">
      <Nav comm={id} />
      <div className="flex-1 p-4 overflow-y-auto h-full">
        <MapProvider>
          <MapComponent2 data={mapData} />
        </MapProvider>
        <Editor comm={id} />
        <CommPage comm={id} />
        <Members members={members} />
      </div>
    </div>
  );
};

export default Community2;