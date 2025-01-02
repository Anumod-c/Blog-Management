export interface IBlog{
    title:string;
    _id:string
    category:string;
    description:string;
    createdAt:Date;
    image:string;
    userId:string
    author:{
        username:string;
        avatar:string;
    }
    }

    export interface IBlogData{
        title:string;
        category:string;
        description:string;
        image:File|null;
        userId:string

        
        }
    