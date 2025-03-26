
import Nav from "@/components/nsv";

import axios from "axios";

import CommPage from "@/components/commPage";
import { mapItem, Member } from "@/types.db";
import Members from "@/components/members";
import Editor from "@/components/editor";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent2 } from "@/components/map2";
import Community3 from "@/components/verge";
// If you have a custom PageProps type, adjust it to:


type Params = Promise<{ commId: string }>


  const Community2 = async (props: { params: Params }) => {
    const params = await (props.params);

    
    const id = params.commId;


    return (
            <>
               <Community3  commId={id}/>
            </>

    );
}

export default Community2;
