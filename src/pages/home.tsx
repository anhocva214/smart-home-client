import { deviceApi } from '@apis/exports';
import { Card, Col, Row, Statistic, Select, Switch, Button } from 'antd';
const { Option } = Select;
import { useEffect, useState } from 'react';
import { MetaData } from 'src/models/device.model';
import { Connector, useMqttState } from 'mqtt-react-hooks';
import mqtt from 'mqtt'
import JSChaCha20 from '@utils/jschacha20'

const CARD_HAS_SWITCH = ['status1', 'status2']

const CardDevice = ({ title, value , onSwitch}: { title: string, value: string, onSwitch?: (value) => void}) => {
    console.log(value, ' - ', value == 'ON')
    return (
        <Card title={title}>
            <Statistic
                value={value}
                // precision={2}
                valueStyle={{ color: '#0d8add' }}
            // suffix="%"
            />

            {
                CARD_HAS_SWITCH.indexOf(title) >= 0 && (
                    <Switch checked={value == "ON" ? true : false} onChange={e => onSwitch(e)} />
                )
            }
        </Card>
    )
}

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
    const [selectModeEncrypt, setSelectModeEncrypt] = useState<'not_encrypt' | 'chacha_encrypt' | 'aes_encrypt'>('not_encrypt')
    // const [dataMetaData, setDataMetaData] = useState<MetaData[]>([])

    const key = new Uint8Array([
        0x54, 0x50, 0x4e, 0x56, 0x61, 0x68, 0x50, 0x20, 0x33, 0x20, 0x65, 0x73, 0x63,
        0x65, 0x53, 0x20, 0x20, 0x74, 0x65, 0x72, 0x20, 0x79, 0x65, 0x6b, 0x54, 0x20,
        0x79, 0x62, 0x68, 0x6e, 0x61, 0x68,
      ]); // 32 bytes key
      const nonce = new Uint8Array([0x4f, 0x2b, 0x6d, 0xc2, 0x40, 0xcc, 0xf1, 0x8a]); // 8 bytes nonce
      const blockNumber = new Uint8Array([
        0xed, 0x48, 0x7e, 0x24, 0x1e, 0xe9, 0x37, 0x5,
      ]); // 8 bytes blockNumber


    useEffect(() => {
        const TOPICS = ['/nodejs/mqtt', '/get/type_data', '/node/relay1', '/node/relay2', '/post/data/chacha_encrypt']
        client.on('connect', () => {
            console.log('Connected')
            client.subscribe(TOPICS, () => {
                console.log(`Subscribe `, TOPICS)
            })
        })

    }, [])

    function numberToChar(number) {
        let i;
        let r="";
        for (i = 0; i < number.length; i++) {
          r+= String.fromCharCode(number[i])
        }

        return r
      }

    useEffect(() => {

        client.on('message', (topic, payload) => {
            console.log('Received Message', topic, payload)
            console.log("selectModeEncrypt: ", selectModeEncrypt)
            if (topic == '/nodejs/mqtt' && selectModeEncrypt == 'not_encrypt') {
                let s = payload.toString().indexOf("{")
                try {
                    let data = new MetaData(JSON.parse(payload.toString().slice(s)))
                    if (data.devID == selectDevID) {
                        // console.log(selectDevID, " - ", data.devID)
                        setDataLatest(data)
                    }
                }
                catch (err) {
                    // setDataLatest(new MetaData())
                }
            }
            else if (topic == '/post/data/chacha_encrypt' && selectModeEncrypt == 'chacha_encrypt'){
                
                let message = new JSChaCha20(key, nonce, blockNumber).decrypt(payload);
                // console.log(numberToChar(message))
                let data = new MetaData(JSON.parse(numberToChar(message)))
                console.log("data: ", data)
                if (data.devID == selectDevID) {
                    // console.log(selectDevID, " - ", data.devID)
                    setDataLatest(data)
                }
            }
        })
    }, [selectDevID, selectModeEncrypt])

    const publishStatusBtn = (value: 'ON' | 'OFF', key: string) => {
        console.log(key == 'status1' ? '/node/relay1': '/node/relay2', value)
        setDataLatest({
            ...dataLatest,
            [key]: value
        })
        client.publish(key == 'status1' ? '/node/relay1': '/node/relay2', value, {qos: 1, retain: true})
    }

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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(item => !!item).map((item) => (
                    <Option key={item} value={item} >{item}</Option>
                ))}
            </Select>

            <Select onChange={value => {
                // console.log('value = ', value)
                setSelectModeEncrypt(value)
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
                        if (key != 'create_at') {
                            return (
                                <Col span={6} key={key} >
                                    <CardDevice
                                        title={key}
                                        value={dataLatest[key]}
                                        onSwitch={(value: boolean) =>publishStatusBtn(value?'ON':'OFF', key)}
                                    />
                                </Col>
                            )
                        }
                        else return ""
                })}

                <Col span={6}>

                </Col>
            </Row>
        </div>
        // </Connector>

    )
}