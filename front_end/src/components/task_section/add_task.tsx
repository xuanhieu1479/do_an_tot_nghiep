import React from "react";
import { Button, Modal, Form, Col, InputGroup } from "react-bootstrap";

interface ButtonAddTaskState {
    show: boolean;
}

export default class ButtonAddTask extends React.Component<any, ButtonAddTaskState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: false
        }

        this.showAddTaskModal = this.showAddTaskModal.bind(this);
        this.hideAddTaskModal = this.hideAddTaskModal.bind(this);
    }

    showAddTaskModal() {
        this.setState({show: true});
    }

    hideAddTaskModal() {
        this.setState({show: false});
    }

    render(): React.ReactNode {
        return(
            <div>
                <Button variant="outline-success" size="sm" onClick={this.showAddTaskModal}>Thêm Task</Button>
                <Modal 
                    show={this.state.show} 
                    centered
                    onHide={this.hideAddTaskModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo task mới</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridPrioritiy">
                                <Form.Label>Mức độ ưu tiên</Form.Label>
                                <Form.Control as="select">
                                    <option>Cứ từ từ</option>
                                    <option>Để mai cũng được</option>
                                    <option>Bình thường</option>
                                    <option>Làm không kẻo muộn</option>
                                    <option>Vắt giò lên cổ chạy</option>
                                </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridTaskType">
                                <Form.Label>Loại Task</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control as="select">
                                        <option>Công việc</option>
                                        <option>Ăn chơi</option>
                                    </Form.Control>
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary">+</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Ngày bắt đầu</Form.Label>
                                <Form.Control placeholder="1234 Main St" />
                            </Form.Group>

                            <Form.Group controlId="formGridAddress2">
                                <Form.Label>Address 2</Form.Label>
                                <input type="datetime-local" />
                                <Form.Control placeholder="Apartment, studio, or floor" />
                            </Form.Group>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State</Form.Label>
                                <Form.Control as="select">
                                    <option>Choose...</option>
                                    <option>...</option>
                                </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group id="formGridCheckbox">
                                <Form.Check type="checkbox" label="Check me out" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success">
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}