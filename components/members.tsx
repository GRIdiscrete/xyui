"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member } from "@/types.db";

interface Members {
    members: Member[] | undefined
}

const Members = ({ members }: Members) => {

    return (
        <>
            <section className="py-32">
                <div className="container flex flex-col items-center text-center">
                    <p className="semibold">Community</p>
                    <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
                        Members
                    </h2>
                </div>
                <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
                    {members?.map((person) => (
                        <div key={person.id} className="flex flex-col items-center">
                            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
                                <AvatarImage src={person.created_on} />
                                <AvatarFallback>{person.first_name}</AvatarFallback>
                            </Avatar>
                            <p className="text-center font-medium">{person.first_name} {person.last_name}</p>
                            <p className="text-center text-muted-foreground">{person.email}</p>
                            {person.admin === '1' && (
                                <span className="text-sm text-white bg-red-600 rounded-md p-2">Admin</span>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Members;
