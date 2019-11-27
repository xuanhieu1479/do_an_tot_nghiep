import React from "react";
import { Form, Button, Overlay, Tooltip } from "react-bootstrap";
import apiCaller from "../utils/apiCaller";
import NavBar from "../components/navbar/navbar";

interface NewPasswordState {
    email: any;
    token: any;
    newPassword: string;
    confirmPassword: string;
    newPasswordValidated: boolean;
    confirmPasswordValidated: boolean;
}

export default class PageNewPassword extends React.Component<any, NewPasswordState> {

    private newPasswordRef: any;
    private confirmPasswordRef: any;
    private passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);

    constructor(props: any) {
        super(props);
        this.state = {
            email: (new URLSearchParams(this.props.location.search)).get('email'),
            token: (new URLSearchParams(this.props.location.search)).get('token'),
            newPassword: '',
            confirmPassword: '',
            newPasswordValidated: true,
            confirmPasswordValidated: true,
        };

        this.newPasswordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
    }

    onChangeNewPassword(event: any) {
        this.setState({newPassword: event.target.value});

        if (this.passwordRegex.test(event.target.value) && !this.state.newPasswordValidated) this.setState({newPasswordValidated: true});
        if (event.target.value === this.state.confirmPassword && !this.state.confirmPasswordValidated) this.setState({confirmPasswordValidated: true});
    }

    onChangeConfirmPassword(event: any) {
        this.setState({confirmPassword: event.target.value});

        if (event.target.value === this.state.newPassword && !this.state.confirmPasswordValidated) this.setState({confirmPasswordValidated: true});
    }

    changePassword() {
        if (!this.passwordRegex.test(this.state.newPassword)) {
            this.setState({newPasswordValidated: false});
            return;
        }

        if (this.state.confirmPassword !== this.state.newPassword) {
            this.setState({confirmPasswordValidated: false});
            return;
        }

        let request = {email: this.state.email, password: this.state.newPassword};
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatepassword', 'PUT', request, this.state.token).then(
            response => {
                const { statusCode } = response;
                if (statusCode === 200) {
                    alert("Your new password has been updated successfully. Please use it to login to our page.");
                    this.props.history.push("./dangnhap");
                }
            }
        );
    }

    render(): React.ReactNode {
        return (
            <div>
                <NavBar />
                <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Form style={{width: 600, marginTop: 200}}>
                        <Form.Group controlId="formBasicNewPassword">
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
                        </Form.Group>
                        <Form.Group controlId="formBasicConfirmPassword">
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
                        <div style={{textAlign: 'right'}}>
                            <Button variant="primary" onClick={this.changePassword.bind(this)}>Update Password</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}