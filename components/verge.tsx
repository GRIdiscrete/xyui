"use client";

import Nav from "@/components/nsv";
import axios from "axios";
import CommPage from "@/components/commPage";
import { mapItem, Member } from "@/types.db";
import Members from "@/components/members";
import Editor from "@/components/editor";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent2 } from "@/components/map2";
import { useEffect, useState } from "react";

const Community3 = ({ commId }: { commId: string }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [map, setMap] = useState<mapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUniqueOrgIds = (dataArray: Member[]): string[] => {
    const orgIds = dataArray.map((item) => item.org_id);
    return Array.from(new Set(orgIds));
  };

  const getData2 = async (communityId: string) => {
    try {
      const response = await axios.get("https://accounts.protracc.com/api/members", {
        headers: { "x-api-key": "proTract22$" },
        params: { community_id: communityId },
      });
      return response.data.data as Member[];
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  };

  const getData3 = async (orgIds: string[]) => {
    try {
      let mapData: mapItem[] = [];
      for (const orgId of orgIds) {
        const response = await axios.get("https://accounts.protracc.com/api/getAssets", {
          headers: { "x-api-key": "proTract22$" },
          params: { org_id: orgId },
        });
        mapData = [...mapData, ...response.data.data];
      }
      return mapData;
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch members data
        const membersData = await getData2(commId);
        setMembers(membersData);

        // Fetch map data
        const orgIds = getUniqueOrgIds(membersData);
        const mapData = await getData3(orgIds);
        setMap(mapData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [commId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex h-screen">
      <Nav comm={commId} />
      <div className="flex-1 p-4 overflow-y-auto h-full">
        <MapProvider>
          <MapComponent2 data={map} />
        </MapProvider>
        <Editor comm={commId} />
        <CommPage comm={commId} />
        <Members members={members} />
      </div>
    </div>
  );
};

export default Community3;