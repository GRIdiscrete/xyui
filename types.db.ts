export interface Community {
about: string;

created_on: string;

head_quater: string;
logo: string;

id: string;

status: string;

title: string;

updated_on: string;

user_id: string;
}










export interface Member {admin: string

community_id: string

created_on: string

email: string

first_name: string

id: string

last_name: string

member_id: string
org_id: string;

mobile: string

status: string

updated_on: string}



export interface User {
    admin: string
    
    email: string
    
    first_name: string
    
    id: string
    
    last_name: string
    
    mobile: string
    
    status: string
    

}

export interface Point {
    latitude: string,
    longitude: string,
    assetid: string
}


export interface mapItem {
        category : string;
        classes: string
        code: string
        description: string
        id: string
        location: string
        name: string
        points: Point[]
        qbar: string
        sub_cat: string
        type: string
}


export interface Posy {
    points: Point[],
    id: string
}








