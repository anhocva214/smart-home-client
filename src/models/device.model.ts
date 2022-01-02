export class MetaData {
    id: string
    devID: string
    status1: string
    status2: string
    current1: string
    current2: string
    voltage1: string
    voltage2: string
    relay_warning1: string
    relay_warning2: string
    temperature_warning: string
    temperature: string
    dynamo_status: string
    wifi_status: string
    create_at: string

    constructor()
    constructor(obj?: MetaData)
    constructor(obj?: any){
        this.id = obj?.id || "";
        this.devID = obj?.devID || "";
        this.status1 = obj?.status1 || ""
        this.status2 = obj?.status2 || ""
        this.current1 = obj?.current1 || ""
        this.current2 = obj?.current2 || ""
        this.voltage1 = obj?.voltage1 || ""
        this.voltage2 = obj?.voltage2 || ""
        this.relay_warning1 = obj?.relay_warning1 || ""
        this.relay_warning2 = obj?.relay_warning2 || ""
        this.temperature_warning = obj?.temperature_warning || ""
        this.temperature = obj?.temperature || ""
        this.dynamo_status = obj?.dynamo_status || ""
        this.wifi_status = obj?.wifi_status || ""
        this.create_at = obj?.create_at || ''

    }
}