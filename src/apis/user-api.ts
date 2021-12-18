import { baseApi } from "@services/api";
import { UserLoginDTO, UserRegisterDTO } from "src/models/user.model";
import { urls } from "./exports";



export function registerUser(data: UserRegisterDTO){
    return baseApi({
        url: urls.registerUser,
        method: 'POST',
        data
    })
}

export function loginUser(data: UserLoginDTO){
    return baseApi({
        url: urls.loginUser,
        method: 'POST',
        data
    })
}