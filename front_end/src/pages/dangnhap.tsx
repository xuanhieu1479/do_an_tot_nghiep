import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from "react-bootstrap";
import callApi from "../utils/apiCaller";

interface LoginScreenState {
    email: string;
    password: string;
}

export default class PageDangNhap extends React.Component<any, LoginScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }

    onChangeEmail(event: any) {
        this.setState({email: event.target.value});
    }

    onChangePassword(event: any) {
        this.setState({password: event.target.value});
    }

    doLogin() {
        let loginInfo = {
            email: this.state.email,
            matkhau: this.state.password
        }
        callApi('Http://Homestead.test/api/dangnhap', "POST", loginInfo).then(
            responseData => {
                console.log(responseData);
            }
        );
    }

    render(): React.ReactNode {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Form onSubmit={this.doLogin} style={{width: 540}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Nhập email" value={this.state.email} onChange={this.onChangeEmail} />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" placeholder="Mật khẩu" value={this.state.password} onChange={this.onChangePassword} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Đăng nhập
                    </Button>
                </Form>
            </div>
        );
    }
}