export interface SingleUserType {
    id: number;
    name: string;
    email: string;
    create_time: string;
    update_time: string;
}  

export interface FormValues{
    [name:string]:any
}