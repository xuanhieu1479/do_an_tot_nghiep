import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import NavBar from "../components/navbar/navbar";
import apiCaller from "../utils/apiCaller";

interface PageFeedbackState {
    userEmail: any;
    feedback: string;
    show: boolean;
}

export default class PageFeedback extends React.Component<any, PageFeedbackState> {
    constructor(props: any) {
        super(props);
        this.state = {
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            feedback: '',
            show: false,
        }
    }

    onChangeFeedback(event: any) {
        this.setState({feedback: event.target.value});
    }

    hideModal() {
        this.setState({show: false});
        this.props.history.push("./home")
    }

    sendFeedback() {
        let request = {
            email: this.state.userEmail,
            feedback: this.state.feedback,
        }
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/feedback', 'POST', request, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode } = response;
                if (statusCode === 200) {
                    this.setState({show: true});
                } else {
                    alert('Something went wrong, please try again!');
                }
            }
        );
    }

    render(): React.ReactNode {
        return (
            <div>
                <NavBar />
                <Form style={{marginLeft: 20, marginTop: 20}}>
                    <Form.Group controlId="formGridFeedback">
                        <Form.Control
                            as="textarea"
                            placeholder="Input your feedback here"
                            rows="10"
                            value={this.state.feedback}
                            onChange={this.onChangeFeedback.bind(this)}
                            style={{width: '50%'}}
                        />
                        <Button
                            variant="primary"
                            onClick={this.sendFeedback.bind(this)}
                            style={{marginTop: 20}}
                        >
                            Send Feedback
                        </Button>
                    </Form.Group>
                </Form>

                <Modal show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>You feedback has been sent!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Thank you for your feedback. Your input will help us build a better products for you and other customers.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.hideModal.bind(this)}>Thanks!</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}