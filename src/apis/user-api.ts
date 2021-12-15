import { baseApi } from "@services/api";
import { UserRegisterDTO } from "src/models/user.model";
import { urls } from "./exports";



export function registerUser(data: UserRegisterDTO){
    return baseApi({
        url: urls.registerUser,
        method: 'POST',
        data
    })
}