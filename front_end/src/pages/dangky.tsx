import React from "react";
import { Form, Button, Alert, Modal, Image } from "react-bootstrap";
import apiCaller from "../utils/apiCaller";
import { Redirect } from "react-router-dom";
import NavBar from "../components/navbar/navbar";
import RegisterImage from "../images/Register Image.jpg"

interface LoginScreenState {
    email: string;
    password: string;
    telephone: string;
    errorMessage: string;
    show: boolean;
    emailValidated: boolean;
    passwordValidated: boolean;
    telephoneValidated: boolean;
    isFetching: boolean;
}

export default class PageDangKy extends React.Component<any, LoginScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            telephone: '',
            errorMessage: '',
            show: false,
            emailValidated: true,
            passwordValidated: true,
            telephoneValidated: true,
            isFetching: false,
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

    onChangeTelephone(event: any) {
        this.setState({telephone: event.target.value});
    }

    checkValidation() {
        let emailRegex = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
        let passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);
        let telephoneRegex = new RegExp(/^(\d{0}|\d{10}|\d{11})$/);
        let emailValidated = true;
        let passwordValidated = true;
        let telephoneValidated = true;
        let isValidated = true;

        if (!emailRegex.test(this.state.email)) {
            emailValidated = false;
            isValidated = false;
        }

        if (!passwordRegex.test(this.state.password)) {
            passwordValidated = false;
            isValidated = false;
        }

        if (!telephoneRegex.test(this.state.telephone)) {
            telephoneValidated = false;
            isValidated = false;
        }

        this.setState({emailValidated: emailValidated, passwordValidated: passwordValidated, telephoneValidated: telephoneValidated})
        return isValidated;
    }

    doRegister() {        
        let isValidated = this.checkValidation();
        if (!isValidated) return;
        this.setState({isFetching: true});

        let registerInfo = {
            email: this.state.email,
            matkhau: this.state.password,
            sdt: this.state.telephone,
            timezone: new Date().toString(),
        }
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/dangky', "POST", registerInfo).then(
            response => {
                const { statusCode, data } = response;
                if (statusCode === 200) {
                    localStorage.setItem('access_token', data.access_token);
                    this.setState({show: true, isFetching: false});
                } else {
                    this.setState({errorMessage: data.message, isFetching: false});
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
            <>
            <NavBar />
            <div style={{
                height: '75vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{marginRight: 60, marginTop: 20}}>
                    <div style={{marginLeft: 20}}>
                        <p style={{fontSize: 44}}>Never forget a thing</p>
                        <p style={{fontSize: 20}}>
                            From groceries to picking up the kids, we help you remember it all,<br></br>
                            anytime, anywhere
                        </p>
                    </div>
                    <Image
                        src={RegisterImage}
                        rounded
                        style={{height: '45vh'}}
                    />
                </div>
                <Form style={{width: 540}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="asdasd@gmail.com" value={this.state.email} onChange={this.onChangeEmail.bind(this)} />
                        <Alert variant='danger' hidden={isHidden}>{this.state.errorMessage}</Alert>
                        <Alert variant='danger' hidden={this.state.emailValidated}>Your email does not have corrected format.</Alert>
                    </Form.Group>

                    <Form.Group controlId="formBasicTel">
                        <Form.Label>Telephone Number</Form.Label>
                        <Form.Control type="text" placeholder="0905123456" value={this.state.telephone} onChange={this.onChangeTelephone.bind(this)} />
                        <Alert variant='danger' hidden={this.state.telephoneValidated}>Your telephone number does not seem right, you can always update it later.</Alert>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="asd123" value={this.state.password} onChange={this.onChangePassword.bind(this)} />
                        <Alert variant='danger' hidden={this.state.passwordValidated}>At least 6 characters, with 1 word character or 1 digit.</Alert>
                    </Form.Group>
                    <Button
                        variant="primary"
                        disabled={this.state.isFetching}
                        onClick={this.doRegister.bind(this)}
                    >
                        {(this.state.isFetching) ? 'Loading...' : 'Sign Up'}
                    </Button>
                </Form>

                <Modal show={this.state.show}>
                    <Modal.Header>
                        <Modal.Title>Sign Up Successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Start to find better ways to spend your time.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.redirectToHome.bind(this)}>Got It!</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            </>
        );
    }
}