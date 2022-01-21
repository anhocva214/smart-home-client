import { deviceApi } from '@apis/exports';
import { Card, Col, Row, Statistic, Select, Space } from 'antd';
const { Option } = Select;
import { useEffect, useState } from 'react';
import { MetaData } from 'src/models/device.model';
import { Connector, useMqttState } from 'mqtt-react-hooks';
import mqtt from 'mqtt'


const CardDevice = ({ title, value }: { title: string, value: string }) => (
    <Card title={title}>
        <Statistic
            value={value}
            // precision={2}
            valueStyle={{ color: '#0d8add' }}
        // suffix="%"
        />
    </Card>
)

const host = '113.161.225.11'
// const host = 'localhost'
const port = 4884
const clientId = `mqtt_client_nextjs`
const connectUrl = `mqtt://${host}:${port}`

var options = {
    clientId: clientId,
    username: "username",
    password: "password",
    protocolId: "MQTT",
    protocolVersion: 4,

    port,
    clean: true
};
const client = mqtt.connect(connectUrl, options)

// client.on('connect', function () {
//     client.subscribe('presence', function (err) {
//         if (!err) {
//             client.publish('presence', 'Hello mqtt')
//         }
//     })
// })

// client.on('message', function (topic, message) {
//     // message is Buffer
//     console.log(message.toString())
//     client.end()
// })

export default function HomePage() {
    // const [client, setClient] = useState(mqtt.connect(connectUrl, options))
    const [dataLatest, setDataLatest] = useState<MetaData>(new MetaData())
    const [devIDs, setDevIDs] = useState<string[]>([])
    const [selectDevID, setSelectDevID] = useState(null)
    // const [dataMetaData, setDataMetaData] = useState<MetaData[]>([])

    // const { connectionStatus } = useMqttState();

    // useEffect(() => {
    //     setInterval(() => {
    //         (async () => {
    //             let response = await deviceApi.getListMetaData()
    //             let data = response.data.map(item => new MetaData(item))
    //             setDataMetaData(data)
    //             setDevIDs(Array.from(
    //                 new Set(data.map((item: MetaData) => {
    //                     return item.devID
    //                 }))
    //             ))
    //         })()
    //     }, 1000)

    //     // console.log("connectionStatus: ", connectionStatus)
    // }, [])

    // useEffect(() => {
    //     // console.log(selectDevID)
    //     if (dataMetaData.length > 0 && !!selectDevID) {
    //         let data = dataMetaData.filter(item => item.devID == selectDevID)
    //         setDataLatest(data[data.length - 1])
    //     }
    // }, [selectDevID, dataMetaData])

    // useEffect(() => {
    //     console.log(devIDs)
    // },[devIDs])

    // useEffect(() => {
    //     if (client){
    //         client.on('message', function (topic, message) {
    //             // message is Buffer
    //             console.log(message.toString())
    //             // client.end()
    //         })
    //     }


    // }, [client])

    useEffect(() => {
        const TOPIC = '/nodejs/mqtt'
        const Topic2 = '/get/type_data'
        client.on('connect', () => {
            console.log('Connected')
            client.subscribe([TOPIC, Topic2], () => {
                console.log(`Subscribe all `)
            })
        })

    }, [])

    useEffect(()=>{

        client.on('message', (topic, payload) => {
            console.log('Received Message', topic, payload.toString())
            if (topic == '/nodejs/mqtt') {
                let s = payload.toString().indexOf("{")
                try {
                    let data = new MetaData(JSON.parse(payload.toString().slice(s)))
                    if (data.devID == selectDevID){
                        console.log(selectDevID, " - ", data.devID)
                        setDataLatest(data)
                    }
                }
                catch (err) {
                    setDataLatest(new MetaData())
                }
            }
        })
    }, [selectDevID])

    return (
        // <Connector brokerUrl="wss://test.mosquitto.org:1884">

        <div style={{
            padding: 30,
            backgroundColor: '#f5f8fa',
            minHeight: '100vh'
        }}>

            <Select style={{ width: 350 }} defaultValue={null} onChange={value => {
                setSelectDevID(selectDevID => value)
                setDataLatest(new MetaData())
            }}>
                <Option value={null} >Chọn thiết bị</Option>
                {[1, 2, 3, 4, 5,6,7,8,9,10].filter(item => !!item).map((item) => (
                    <Option key={item} value={item} >{item}</Option>
                ))}
            </Select>

            <Select onChange={value => {
                console.log('value = ', value)
                client.publish('/get/type_data', value, { qos: 0, retain: false }, (error) => {
                    if (error) {
                        console.error(error)
                    }
                })
            }} style={{ width: 350, marginLeft: 100 }} defaultValue={'not_encrypt'} >
                <Option value={'not_encrypt'} >Không mã hoá</Option>
                <Option value={'chacha_encrypt'} >Mã hoá ChaCha</Option>
                <Option value={'aes_encrypt'} >Mã hoá AES</Option>
            </Select>

            <div style={{ marginTop: 30 }} />

            <Row gutter={[16, 16]}>
                {Object.keys(dataLatest).map((key) => {
                    if (key != 'id' && key != 'devID')
                        if (key != 'create_at')
                            return (
                                <Col span={6} key={key} >
                                    <CardDevice
                                        title={key}
                                        value={dataLatest[key]}
                                    />
                                </Col>
                            )

                })}

                <Col span={6}>

                </Col>
            </Row>
        </div>
        // </Connector>

    )
}