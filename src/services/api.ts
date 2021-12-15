import axios, {Method} from 'axios';
import cookie from 'react-cookies';


const ErrorResponse = (e: any) => {
    try {
        // console.log("----------------------------------------------")
        // console.log("Status: ", e.response.status);
        // console.log("Data: ", e.response.data)
        // console.log("----------------------------------------------")

        return new ObjResponse({...e.response.data, statusCode: e.response.status})
    }
    catch (err) {
        console.log(err)
        return err
    }
}

interface IPramsRequest{
    url: string,
    method: Method,
    headers?: any,
    data?: any,
}

export class ObjResponse{
    message: string;
    data?: any;
    error?: {};
    errors?: {};
    statusCode: number;

    constructor()
    constructor(obj?: ObjResponse)
    constructor(obj?: any){
        this.message = obj?.message || null
        this.data = obj?.data || null
        // this.error = obj?.error || null
        this.errors = obj?.errors || null
        this.statusCode = obj?.statusCode || null
    }
}

export async function baseApi({url, method, headers, data}: IPramsRequest): Promise<ObjResponse>{
    return new Promise((resolve, reject) => {
        // console.log("process.env.ENDPOINT ", process.env.ENDPOINT)
        return axios({
            url:  process.env.ENDPOINT + url,
            method,
            headers:{
                Authorization: 'Bearer ' + cookie.load('access_token'), 
                ...headers
            },
            data
        }).then(({data})=>{
            resolve(new ObjResponse(data))
        }).catch(e => reject(ErrorResponse(e)))
    })
}