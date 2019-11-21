import React from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import callApi from "../utils/apiCaller";
import { Redirect } from "react-router-dom";

interface LoginScreenState {
    email: string;
    password: string;
    errorMessage: string;
    show: boolean;
    emailValidated: boolean;
    passwordValidated: boolean;
}

export default class PageDangKy extends React.Component<any, LoginScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            show: false,
            emailValidated: true,
            passwordValidated: true,
        };
    }

    onChangeEmail(event: any) {
        this.setState({email: event.target.value});
    }

    onChangePassword(event: any) {
        this.setState({password: event.target.value});
    }

    checkValidation() {
        let emailRegex = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
        let passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);
        let emailValidated;
        let passwordValidated;
        let isValidated;

        if (emailRegex.test(this.state.email)) {
            emailValidated = true;
            isValidated = true;
        } else {
            emailValidated = false;
            isValidated = false;
        }

        if (passwordRegex.test(this.state.password)) {
            passwordValidated = true;
            isValidated = (isValidated && true);
        } else {
            passwordValidated = false;
            isValidated = false;
        }

        this.setState({emailValidated: emailValidated, passwordValidated: passwordValidated})
        return isValidated;
    }

    doRegister() {
        let isValidated = this.checkValidation();
        if (!isValidated) return;

        let registerInfo = {
            email: this.state.email,
            matkhau: this.state.password,
            timezone: new Date().toString(),
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

        if(localStorage.getItem('access_token') && !this.state.show) return (<Redirect to="/home" />);
        let isHidden = this.state.errorMessage ? false : true;
        
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Form style={{width: 540}}>
                    <h1 style={{marginBottom: 50, textAlign: 'center'}}>Đăng ký</h1>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="asdasd@gmail.com" value={this.state.email} onChange={this.onChangeEmail.bind(this)} />
                        <Form.Text className="text-muted">
                        <Alert variant='danger' hidden={isHidden}>{this.state.errorMessage}</Alert>
                        <Alert variant='danger' hidden={this.state.emailValidated}>Yêu cầu nhập đúng định dạng email.</Alert>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" placeholder="asd123" value={this.state.password} onChange={this.onChangePassword.bind(this)} />
                        <Alert variant='danger' hidden={this.state.passwordValidated}>Tối thiểu 6 ký tự, trong đó tồn tại ít nhất 1 chữ và 1 số.</Alert>
                    </Form.Group>
                    <Button variant="primary" onClick={this.doRegister.bind(this)}>Đăng ký</Button>
                </Form>

                <Modal show={this.state.show}>
                    <Modal.Header>
                    <Modal.Title>Đăng ký thành công</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bắt đầu quản lý thời gian một cách hiệu quả hơn.</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={this.redirectToHome.bind(this)}>Ngon!</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}