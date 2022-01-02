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
const port = '3883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`

// var options = {
//     clientId: "clientId",
//     username: "username",
//     password: "password",
//     protocolId: "MQTT",
//     protocolVersion: 4,

//     port: 3883,
//     clean: true
// };
// const client = mqtt.connect(connectUrl, options)

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

    const [dataLatest, setDataLatest] = useState<MetaData>(new MetaData())
    const [devIDs, setDevIDs] = useState<string[]>([])
    const [selectDevID, setSelectDevID] = useState(null)
    const [dataMetaData, setDataMetaData] = useState<MetaData[]>([])

    // const { connectionStatus } = useMqttState();

    useEffect(() => {
        setInterval(() => {
            (async () => {
                let response = await deviceApi.getListMetaData()
                let data = response.data.map(item => new MetaData(item))
                setDataMetaData(data)
                setDevIDs(Array.from(
                    new Set(data.map((item: MetaData) => {
                        return item.devID
                    }))
                ))
            })()
        }, 1000)

        // console.log("connectionStatus: ", connectionStatus)
    }, [])

    useEffect(() => {
        // console.log(selectDevID)
        if (dataMetaData.length > 0 && !!selectDevID) {
            let data = dataMetaData.filter(item => item.devID == selectDevID)
            setDataLatest(data[data.length - 1])
        }
    }, [selectDevID, dataMetaData])

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

    return (
        // <Connector brokerUrl="wss://test.mosquitto.org:1884">

        <div style={{
            padding: 30,
            backgroundColor: '#f5f8fa',
            minHeight: '100vh'
        }}>

            <Select style={{ width: 350 }} defaultValue={null} onChange={setSelectDevID}>
                <Option value={null} >Chọn thiết bị</Option>
                {devIDs.filter(item => !!item).map((item) => (
                    <Option key={item} value={item} >{item}</Option>
                ))}
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