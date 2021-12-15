export class UserRegisterDTO {
    username: string
    password: string
    last_name: string
    first_name: string
    email: string
    constructor()
    constructor(obj?: UserRegisterDTO)
    constructor(obj?: any){
        this.username = obj?.username || null;
        this.password = obj?.password || null;
        this.last_name = obj?.last_name || null;
        this.first_name = obj?.first_name || null;
        this.last_name = obj?.last_name || null;
        this.email = obj?.email || null;
    }
}