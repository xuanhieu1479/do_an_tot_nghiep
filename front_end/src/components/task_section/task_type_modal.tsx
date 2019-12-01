import React from "react";
import { Modal, Form, InputGroup, Col, Button, Alert } from "react-bootstrap";
import jwt_decode from 'jwt-decode';
import apiCaller from "../../utils/apiCaller";
import TaskType from "../../models/task_type";

interface TaskTypeModalState {
    userEmail: any;
    newTaskTypeName: string;
    maloai: number;
    taskTypeNameValidated: boolean;
}

interface TaskTypeModalProps {
    show: boolean;
    hideModal: () => void;
    taskTypeList: TaskType[];
    setLoadTaskTypeUndone: () => void;
}

export default class TaskTypeModal extends React.Component<TaskTypeModalProps, TaskTypeModalState> {
    constructor(props: TaskTypeModalProps) {
        super(props);
        this.state = {
            userEmail: (localStorage.getItem('access_token')) ? Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5] : '',
            newTaskTypeName: '',
            maloai: 0,
            taskTypeNameValidated: true,
        }
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.show !== prevProps.show) {
            this.setState({taskTypeNameValidated: true, maloai: this.props.taskTypeList[0].maloai})
        }
    }

    onChangeAddType(event: any) {
        this.setState({newTaskTypeName: event.target.value});
    }

    onChangeDeleteType(event: any) {
        this.setState({maloai: event.target.options[event.target.selectedIndex].getAttribute('data-key')})
    }

    checkValidation() {
        let taskTypeNameRegex = new RegExp(/^.{1,10}$/);
        let isValidated;

        if (taskTypeNameRegex.test(this.state.newTaskTypeName)) {
            this.setState({taskTypeNameValidated: true});
            isValidated = true;
        } else {
            this.setState({taskTypeNameValidated: false});
            isValidated = false;
        }

        return isValidated;
    }

    addTaskType() {
        let isValidated = this.checkValidation();
        if (!isValidated) return;

        let newTaskType = {
            email: this.state.userEmail,
            tenloai: this.state.newTaskTypeName,
        };

        apiCaller(process.env.REACT_APP_DOMAIN + 'api/themloaikehoach', 'POST', newTaskType, localStorage.getItem('access_token')).then(
            response => {                
                this.setState({newTaskTypeName: ''});
                this.props.setLoadTaskTypeUndone();
                alert(response.data.message);
            }
        );
    }

    deleteTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/deleteloaikehoach?maloai=' + this.state.maloai, 'DELETE', null, localStorage.getItem('access_token')).then(
            response => {
                this.props.setLoadTaskTypeUndone();
                alert(response.data.message);
            }
        );
    }

    render(): React.ReactNode {
        return (
            <Modal show={this.props.show} onHide={this.props.hideModal} centered>
                <Modal.Body>
                    <Form.Group as={Col} controlId="formGridAddTaskType">
                        <Form.Label>Add Task Type</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control onChange={this.onChangeAddType.bind(this)} placeholder="R&R" value={this.state.newTaskTypeName}></Form.Control>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.addTaskType.bind(this)}>+</Button>
                            </InputGroup.Append>                            
                        </InputGroup>
                        <Alert variant='danger' hidden={this.state.taskTypeNameValidated}>Maximum 10 characters and non-empty.</Alert>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridDeleteTaskType">
                        <Form.Label>Remove Task Type</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control as="select" onChange={this.onChangeDeleteType.bind(this)}>
                                {this.props.taskTypeList.map((taskType: TaskType) => {
                                    return (
                                        <option key={taskType.maloai} data-key={taskType.maloai}>{taskType.tenloai}</option>
                                    );
                                })}
                            </Form.Control>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.deleteTaskType.bind(this)}>-</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Modal.Body>
            </Modal>
        );
    }
}