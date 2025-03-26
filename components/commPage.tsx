"use client"

import { Community} from "@/types.db";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardCopy} from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

import toast from "react-hot-toast";


interface commProps {
    comm: string
}

const CommPage = ({comm}: commProps) => {
    const router = useRouter();
    const [tyin, setTyin] = useState<Community>();
    let user: string | null // Initialize the state as an array of Community
  
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
            setTyin(filteredData); // Save the filtered data to the state variable

  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      if (typeof window !== 'undefined') {
            user = sessionStorage.getItem('user');


        if (!user) {
          router.push('/login');
        } else {
          fetchData();
        }
      }
  
    }, [router]);
  
    return ( <>
    <section className="relative overflow-hidden bg-muted py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="/14ce6d34-eb97-47d6-8e2b-05403e5579a0-3.png"
          className="[mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        />
      </div>
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <img src={`${tyin?.logo}`} alt="logo" className="h-16" />
            <Badge variant="outline">Head Quaters: {tyin?.head_quater}</Badge>
            <div>
              <h1 className="mb-6 text-2xl font-bold text-pretty lg:text-5xl">
                {tyin?.title}
              </h1>
              <p className="text-muted-foreground lg:text-xl">
                {
                tyin?.about}
              </p>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button className="bg-green-700">View Archive</Button>
              <Button variant="outline" onClick={async () => {
                const response = await axios.get('https://accounts.protracc.com/api/apply',{
                  headers: {
                  'x-api-key': 'proTract22$'
                  },
                  params: {
                    'community_id': comm,
                    'member_id': user,
                    'admin': '1'
                  }
                })
                if(response.data.code == 200){
                  console.log(response.data)
                  toast.success('Successfully Joined Community')
                }

              }}>
                Join Community <ClipboardCopy strokeWidth={1} className="ml-2 h-4" />
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <p className="text-center: text-muted-foreground lg:text-left">
                Social Links
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/shadcn-ui-icon.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/typescript-icon.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/react-icon.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <img
                    src="https://shadcnblocks.com/images/block/logos/tailwind-icon.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </> );
}
 
export default CommPage;