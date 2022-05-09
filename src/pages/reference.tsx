import { Input } from 'antd';
import { Button } from 'antd';
import mqtt from 'mqtt'
import { useEffect, useState } from 'react';


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


export default function ReferencePage() {

    const [ref1, setRef1] = useState('')
    const [ref2, setRef2] = useState('')
    const [ref3, setRef3] = useState('')

    const TOPIC_REFERENCES = {
        ref1: '/node/ref1',
        ref2: '/node/ref2',
        ref3: '/node/ref3'
    }

    useEffect(() => {
        const TOPICS = Object.values(TOPIC_REFERENCES)
        client.on('connect', () => {
            console.log('Connected')
            client.subscribe(TOPICS, () => {
                console.log(`Subscribe `, TOPICS)
            })
        })

        client.on('message', (topic, payload) => {
            console.log('Received Message', topic, payload.toString())           
        })

    }, [])


    const clear = ()=>{
        setRef1('')
        setRef2('')
        setRef3('')
    }

    const submit = () => {
        client.publish(TOPIC_REFERENCES.ref1, ref1, {qos: 1, retain: true})
        client.publish(TOPIC_REFERENCES.ref2, ref2, {qos: 1, retain: true})
        client.publish(TOPIC_REFERENCES.ref3, ref3, {qos: 1, retain: true})
        clear()
    }


    return (
        <>
            <main>
                <div style={{
                    display: 'flex',
                    height: '100vh',
                    justifyContent: 'center',
                    alignItems: 'start'
                }}>
                    <div
                        style={{
                            maxWidth: 600,
                            marginTop: 100
                        }}
                    >
                        <div className="field-form" style={{marginBottom: 30}} >
                            <label>Reference for relay</label>
                            <Input onChange={e => setRef1(e.target.value)} />
                        </div>
                        <div className="field-form" style={{marginBottom: 30}} >
                            <label>Reference for voltage</label>
                            <Input onChange={e => setRef2(e.target.value)} />
                        </div>
                        <div className="field-form" style={{marginBottom: 30}} >
                            <label>Reference for current</label>
                            <Input onChange={e => setRef3(e.target.value)} />
                        </div>
                        <Button onClick={submit} type="primary" block>Submit</Button>
                    </div>
                </div>
            </main>
        </>
    )
}