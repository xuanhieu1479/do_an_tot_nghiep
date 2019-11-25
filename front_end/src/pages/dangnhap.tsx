import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import apiCaller from "../utils/apiCaller";
import { Redirect } from "react-router-dom";

interface LoginScreenState {
    email: string;
    password: string;
    errorMessage: string;
}

export default class PageDangNhap extends React.Component<any, LoginScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
        };
    }

    componentDidMount() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatethongke', 'GET', null);
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
            matkhau: this.state.password,
        }
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/dangnhap', "POST", loginInfo).then(
            response => {
                const { statusCode, data } = response;
                if (statusCode === 200) {
                    localStorage.setItem('access_token', data.access_token);
                    (this.state.email === 'admin') ? this.props.history.push("./admin") : this.props.history.push("./home");         
                } else {
                    this.setState({errorMessage: data.message});
                }                
            }
        );
    }

    render(): React.ReactNode {

        if(localStorage.getItem('access_token')) return (<Redirect to="/home" />);
        let isHidden = this.state.errorMessage ? false : true;

        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Form style={{width: 540}}>
                <h1 style={{marginBottom: 50, textAlign: 'center'}}>Đăng nhập</h1>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="asdasd@gmail.com" value={this.state.email} onChange={this.onChangeEmail.bind(this)} />
                        <Form.Text className="text-muted">
                        <Alert variant='danger' hidden={isHidden}>{this.state.errorMessage}</Alert>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" placeholder="asd123" value={this.state.password} onChange={this.onChangePassword.bind(this)} />
                    </Form.Group>
                    <Button variant="primary" onClick={this.doLogin.bind(this)}>Đăng nhập</Button>
                </Form>
            </div>
        );
    }
}