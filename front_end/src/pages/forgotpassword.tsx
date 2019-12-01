import React from "react";
import { Redirect } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import apiCaller from "../utils/apiCaller";
import NavBar from "../components/navbar/navbar";

interface ForgotPasswordState {
    email: any;
    isFetching: boolean;
}

export default class PageForgotPassword extends React.Component<any, ForgotPasswordState> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            isFetching: false,
        };
    }

    onChangeEmail(event: any) {
        this.setState({email: event.target.value});
    }

    submitEmail() {
        this.setState({isFetching: true});
        apiCaller(process.env.REACT_APP_DOMAIN + "api/submitemail?email=" + this.state.email, 'GET').then(
            response => {
                const { statusCode } = response;
                if (statusCode === 200) {
                    alert("An email has been sent to " + this.state.email + " address. Please follow instructions inside.");
                    this.setState({isFetching: false});
                } else {
                    alert("This email does not exist!");
                    this.setState({isFetching: false});
                }
            }
        );
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token')) return (<Redirect to="/home" />);

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
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Input your email here"
                                value={this.state.email}
                                onChange={this.onChangeEmail.bind(this)}
                            />                            
                        </Form.Group>
                        <div style={{textAlign: 'right'}}>
                            <Button
                                variant="primary"
                                disabled={this.state.isFetching}
                                onClick={this.submitEmail.bind(this)}
                            >
                                {(this.state.isFetching) ? "Submiting..." : "Submit Email"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}