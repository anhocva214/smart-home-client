import { alertActions } from '@actions/alert.action'
// import { userActions } from '@actions/user.action'
import { userSelector } from '@store/slices/user.slice'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { usersApi } from '@apis/exports'
import { UserRegisterDTO } from 'src/models/user.model'
import {useState} from 'react'


export default function Home() {

  const { users } = useSelector(userSelector)

  const [message, setMessage] = useState('')

  useEffect(() => {
    console.log(users)
  }, [users])

  const onFinish = async (e)=>{
    setMessage('')
    try{
      let res = await usersApi.registerUser(new UserRegisterDTO(e))
      setMessage(res.message)

    } 
    catch(err){
      console.log(err)
      setMessage(err.message)
    }
   
  }

  const onFinishFailed = ()=>{

  }

  return (
    <>
      <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{
          width: 400,
          margin: 100
        }}
      >

        <h2 style={{textAlign: 'center', color: 'red'}}>{message}</h2>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Last name"
          name="last_name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="First name"
          name="first_name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
       

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
