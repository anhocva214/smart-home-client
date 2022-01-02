import { userSelector } from '@store/slices/user.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { usersApi } from '@apis/exports'
import { UserRegisterDTO } from 'src/models/user.model'
import { useState } from 'react'
import { alertActions } from '@actions/exports';
import Router from 'next/router'
import cookie from 'react-cookies'


export default function LoginPage() {

  const dispatch = useDispatch()

  const { users } = useSelector(userSelector)

  const [message, setMessage] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  useEffect(() => {
    console.log(users)
  }, [users])

  const onFinish = async (e) => {
    setMessage('')
    try {
      setLoadingLogin(true)
      let res = await usersApi.loginUser(new UserRegisterDTO(e))
      console.log(res)
      // setMessage(res.message)
      Router.push('/home')
      dispatch(alertActions.alertSuccess(res.message))
      setLoadingLogin(false)
      cookie.save("access_token", res.data.access_token, {path: '/'})


    }
    catch (err) {
      console.log(err)
      setLoadingLogin(false)
      // setMessage(err.message)
      dispatch(alertActions.alertError(err.message))

    }

  }

  const onFinishFailed = () => {

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

        <h1>Đăng nhập</h1>

        <h2 style={{ textAlign: 'center', color: 'red' }}>{message}</h2>

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



        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <a role="button" href="/" >Register new a user</a>
        </div>
      </Form>
    </div>
  )
}
