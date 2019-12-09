import React from "react";
import { Form, Button, Modal, Overlay, Tooltip, Collapse } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";
import apiCaller from "../utils/apiCaller";
import NavBar from "../components/navbar/navbar";

interface ProfileScreenState {
    email: any;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    telephone: string;
    successMessage: string;
    showModal: boolean;
    openCollapse: boolean;
    oldPasswordValidated: boolean;
    newPasswordValidated: boolean;
    confirmPasswordValidated: boolean;
    passwordChanged: boolean;
    telephoneValidated: boolean;    
}

export default class PageProfile extends React.Component<any, ProfileScreenState> {

    private telephoneRef: any;
    private oldPasswordRef: any;
    private newPasswordRef: any;
    private confirmPasswordRef: any;
    private telephoneRegex = new RegExp(/^(\d{0}|\d{10}|\d{11})$/);
    private passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);

    constructor(props: any) {
        super(props);
        this.state = {
            email: (localStorage.getItem('access_token')) ? Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5] : '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            telephone: '',
            successMessage: '',
            showModal: false,
            openCollapse: false,
            oldPasswordValidated: true,
            newPasswordValidated: true,
            confirmPasswordValidated: true,
            passwordChanged: true,
            telephoneValidated: true,
        };

        this.telephoneRef = React.createRef();
        this.oldPasswordRef = React.createRef();
        this.newPasswordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
    }

    componentDidMount() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatethongke', 'GET', null);
        this.loadTelephone();
    }

    onChangeNewPassword(event: any) {
        this.setState({newPassword: event.target.value});
        let newPasswordValidated = false;
        let confirmPasswordValidated = false;
        let passwordChanged = false;
        if (this.passwordRegex.test(event.target.value)) newPasswordValidated = true;
        if (this.state.confirmPassword === event.target.value) confirmPasswordValidated = true;
        if (this.state.oldPassword !== event.target.value) passwordChanged = true;
        if (newPasswordValidated || confirmPasswordValidated || passwordChanged) {
            this.setState({newPasswordValidated: newPasswordValidated, confirmPasswordValidated: confirmPasswordValidated, passwordChanged: passwordChanged})
        }
    }

    onChangeOldPassword(event: any) {
        this.setState({oldPassword: event.target.value});
    }

    onChangeConfirmPassword(event: any) {
        this.setState({confirmPassword: event.target.value});
        if (this.state.newPassword === event.target.value && !this.state.confirmPasswordValidated) this.setState({confirmPasswordValidated: true});
    }

    onChangeTelephone(event: any) {
        this.setState({telephone: event.target.value});
        if (this.telephoneRegex.test(event.target.value) && !this.state.telephoneValidated) this.setState({telephoneValidated: true});
    }

    hideModal() {
        this.setState({showModal: false});
    }

    switchCollapse() {
        this.setState({openCollapse: !this.state.openCollapse});
    }

    returnToHomePage() {
        this.props.history.push("./home");
    }

    loadTelephone() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/sdt?email=' + this.state.email, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { data } = response;
                this.setState({
                    telephone: data.sdt,
                });
            }
        );
    }

    updateTelephone() {
        if (!this.telephoneRegex.test(this.state.telephone)) {
            this.setState({telephoneValidated: false});
            return;
        }

        let request = {email: this.state.email, telephone: this.state.telephone};
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatesdt', 'PUT', request, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode } = response;
                if (statusCode === 200) {
                    this.setState({successMessage: 'Telephone Number', showModal: true});
                }
            }
        );
    }

    updatePassword() {
        let request = {email: this.state.email, password: this.state.newPassword};
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatepassword', 'PUT', request, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode } = response;
                if (statusCode === 200) {
                    this.setState({
                        successMessage: 'Password',
                        showModal: true,
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                        oldPasswordValidated: true,
                        newPasswordValidated: true,
                        confirmPasswordValidated: true,
                    });
                }
            }
        );
    }

    checkPasswordValidation() {
        let newPasswordValidated = true;
        let confirmPasswordValidated = true;
        let passwordChanged = true;
        let isValidated = true;

        if (!this.passwordRegex.test(this.state.newPassword)) {
            newPasswordValidated = false;
            isValidated = false;
        }

        if (this.state.newPassword !== this.state.confirmPassword) {
            confirmPasswordValidated = false;
            isValidated = false;
        }

        if (this.state.newPassword === this.state.oldPassword) {
            passwordChanged = false;
            isValidated = false;
        }

        this.setState({newPasswordValidated: newPasswordValidated, confirmPasswordValidated: confirmPasswordValidated, passwordChanged: passwordChanged});
        return isValidated;
    }

    changePassword() {
        let request = {email: this.state.email, oldPassword: this.state.oldPassword};
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/checkoldpassword', 'POST', request, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode } = response;
                if (statusCode === 400) {
                    this.setState({oldPasswordValidated: false});
                    return;                    
                } else {
                    this.setState({oldPasswordValidated: true});
                    if (!this.checkPasswordValidation()) return;
                    this.updatePassword();
                }
            }
        );
    }

    render(): React.ReactNode {

        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        const fullWidth = 560;
        const leftWidth = 450;
        
        return (
            <div>
                <NavBar />
                <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Form style={{width: fullWidth, marginTop: 150}}>
                        <Form.Group controlId="formBasicEmail" style={{width: leftWidth}}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={this.state.email} disabled />
                        </Form.Group>

                        <Form.Group controlId="formBasicTel">
                            <div style={{clear: 'both'}}><Form.Label>Telephone Number</Form.Label></div>
                            <div style={{display: 'inline-block'}}>                                
                                <div style={{float: 'left', width: leftWidth}}>
                                    <Form.Control ref={this.telephoneRef} type="text" value={this.state.telephone} onChange={this.onChangeTelephone.bind(this)} />
                                </div>
                                <div style={{float: 'right', marginLeft: 20}}>
                                    <Button variant="success" onClick={this.updateTelephone.bind(this)}>Update</Button>
                                </div>
                            </div>
                            <Overlay target={this.telephoneRef.current} show={!this.state.telephoneValidated} placement="left">
                                {(props: any) => (
                                <Tooltip id="telephoneInput-tooltip" {...props} show={(props.show).toString()}>
                                    Incorrected format
                                </Tooltip>
                                )}
                            </Overlay>
                        </Form.Group>

                        <div style={{width: leftWidth + 40}}>
                            <Button
                                variant="link"
                                onClick={this.switchCollapse.bind(this)}
                                aria-controls="change-password-collapse"
                                aria-expanded={this.state.openCollapse}
                                style={{marginLeft: leftWidth - 140}}
                            >
                                Change Password
                            </Button>
                            <Collapse in={this.state.openCollapse}>
                                <div id="change-password-collapse">
                                    <Form.Group controlId="formBasicOldPassword" style={{width: leftWidth}}>
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control
                                            ref={this.oldPasswordRef}
                                            type="password" value={this.state.oldPassword}
                                            onChange={this.onChangeOldPassword.bind(this)}
                                        />
                                        <Overlay target={this.oldPasswordRef.current} show={!this.state.oldPasswordValidated} placement="left">
                                            {(props: any) => (
                                            <Tooltip id="oldPassowrdInput-tooltip" {...props} show={(props.show).toString()}>
                                                Wrong Password
                                            </Tooltip>
                                            )}
                                        </Overlay>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicNewPassword" style={{width: leftWidth}}>
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            ref={this.newPasswordRef}
                                            type="password" value={this.state.newPassword}
                                            onChange={this.onChangeNewPassword.bind(this)}
                                        />
                                        <Overlay target={this.newPasswordRef.current} show={!this.state.newPasswordValidated} placement="left">
                                            {(props: any) => (
                                            <Tooltip id="newPasswordInput-tooltip" {...props} show={(props.show).toString()}>
                                                At least 6 characters, with 1 word character or 1 digit
                                            </Tooltip>
                                            )}
                                        </Overlay>
                                        <Overlay target={this.newPasswordRef.current} show={!this.state.passwordChanged} placement="right">
                                            {(props: any) => (
                                            <Tooltip id="newPassword2Input-tooltip" {...props} show={(props.show).toString()}>
                                                Your new password does not have any change
                                            </Tooltip>
                                            )}
                                        </Overlay>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicConfirmPassword" style={{width: leftWidth}}>
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            ref={this.confirmPasswordRef}
                                            type="password" value={this.state.confirmPassword}
                                            onChange={this.onChangeConfirmPassword.bind(this)}
                                        />
                                        <Overlay target={this.confirmPasswordRef.current} show={!this.state.confirmPasswordValidated} placement="left">
                                            {(props: any) => (
                                            <Tooltip id="confirmPasswordInput-tooltip" {...props} show={(props.show).toString()}>
                                                Mismatched new password
                                            </Tooltip>
                                            )}
                                        </Overlay>
                                    </Form.Group>
                                    <div style={{width: leftWidth, textAlign: 'right'}}>
                                        <Button variant="primary" onClick={this.changePassword.bind(this)}>Update Password</Button>
                                    </div>
                                </div>
                            </Collapse>
                        </div>                       
                    </Form>

                    <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                        <Modal.Header>
                            <Modal.Title>{'Update ' + this.state.successMessage + ' Successful'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Press the button below to return to home page or click outside to keep updating your information.</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.returnToHomePage.bind(this)}>Return to home page!</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}