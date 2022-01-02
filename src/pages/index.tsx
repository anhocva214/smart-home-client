// import { userActions } from '@actions/user.action'
import { userSelector } from '@store/slices/user.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { usersApi } from '@apis/exports'
import { UserRegisterDTO } from 'src/models/user.model'
import {useState} from 'react'
import { alertActions } from '@actions/exports';
import Router from 'next/router';


export default function Home() {

  const dispatch  =useDispatch()

  const { users } = useSelector(userSelector)

  const [message, setMessage] = useState('')
  const [loadingRegister, setLoadingRegister] = useState(false)

  useEffect(() => {
    console.log(users)
  }, [users])

  const onFinish = async (e)=>{
    setMessage('')
    try{
      setLoadingRegister(true)
      let res = await usersApi.registerUser(new UserRegisterDTO(e))
      // setMessage(res.message)
      dispatch(alertActions.alertSuccess(res.message))
      Router.push('/login')
      setLoadingRegister(false)

    } 
    catch(err){
      setLoadingRegister(false)
      console.log(err)
      // setMessage(err.message)
     dispatch( alertActions.alertError(err.message))

    }
   
  }

  const onFinishFailed = ()=>{

  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        // initialValues={{ remember: true }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{
          width: 400,
          margin: 100,
          border: '1px solid #333',
          padding: 40
        }}
      >

        <h1>Đăng ký</h1>
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
          <Button loading={loadingRegister} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <a role="button" href="/login" >Login now !</a>
        </div>
      </Form>
    </div>
  )
}
