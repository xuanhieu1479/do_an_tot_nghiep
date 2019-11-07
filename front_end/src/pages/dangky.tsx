import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert, Modal } from "react-bootstrap";
import callApi from "../utils/apiCaller";
import { Redirect } from "react-router";

interface LoginScreenState {
    email: string;
    password: string;
    errorMessage: string;
    show: boolean;
}

export default class PageDangKy extends React.Component<any, LoginScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            show: false,
        };

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.doRegister = this.doRegister.bind(this);
        this.redirectToHome = this.redirectToHome.bind(this);
    }

    onChangeEmail(event: any) {
        this.setState({email: event.target.value});
    }

    onChangePassword(event: any) {
        this.setState({password: event.target.value});
    }

    doRegister() {
        let registerInfo = {
            email: this.state.email,
            matkhau: this.state.password,
        }
        callApi(process.env.REACT_APP_DOMAIN + 'api/dangky', "POST", registerInfo).then(
            response => {
                const { statusCode, data } = response;
                if (statusCode === 200) {
                    localStorage.setItem('access_token', data.access_token);
                    this.setState({show: true});
                } else {
                    this.setState({errorMessage: data.message});
                }                
            }
        );
    }

    redirectToHome() {
        this.props.history.push("./home")
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') && this.state.show === false) return (<Redirect to="/home" />);
        let isHidden = this.state.errorMessage ? false : true;
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Form style={{width: 540}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Nhập email" value={this.state.email} onChange={this.onChangeEmail} />
                        <Form.Text className="text-muted">
                        <Alert variant='danger' hidden={isHidden}>
                            {this.state.errorMessage}
                        </Alert>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" placeholder="Mật khẩu" value={this.state.password} onChange={this.onChangePassword} />
                    </Form.Group>
                    <Button variant="primary" onClick={this.doRegister}>
                        Đăng ký
                    </Button>
                </Form>

                <Modal show={this.state.show}>
                    <Modal.Header>
                    <Modal.Title>Đăng ký thành công</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bắt đầu quản lý thời gian một cách hiệu quả hơn.</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={this.redirectToHome}>
                        Ngon!
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}