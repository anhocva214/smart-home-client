import { baseApi } from "@services/api";
import { urls } from "./exports";


export function getListMetaData (){
    return baseApi({
        url: urls.getListMetaData,
        method: 'GET'
    })
}