import React from "react";
import { Modal, Form, InputGroup, Col, Button, Alert } from "react-bootstrap";
import jwt_decode from 'jwt-decode';
import apiCaller from "../../utils/apiCaller";
import TaskType from "../../models/task_type";

interface TaskTypeModalState {
    userEmail: any;
    newTaskTypeName: string;
    maloai: number;
    taskTypeList: TaskType[];
    doneLoadTaskType: boolean;
    taskTypeNameValidated: boolean;
}

interface TaskTypeModalProps {
    show: boolean;
    hideModal: () => void;
    setLoadTaskTypeUndone: () => void;
}

export default class TaskTypeModal extends React.Component<TaskTypeModalProps, TaskTypeModalState> {
    constructor(props: TaskTypeModalProps) {
        super(props);
        this.state = {
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            newTaskTypeName: '',
            maloai: 0,
            taskTypeList: [],
            doneLoadTaskType: false,
            taskTypeNameValidated: true,
        }
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.show !== prevProps.show) {
            this.setState({taskTypeNameValidated: true})
        }
    }

    onChangeAddType(event: any) {
        this.setState({newTaskTypeName: event.target.value});
    }

    onChangeDeleteType(event: any) {
        this.setState({maloai: event.target.options[event.target.selectedIndex].getAttribute('data-key')})
    }

    loadTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/loaikehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode, data } = response;
                if(statusCode === 200) {
                    this.setState({
                        taskTypeList: data.loaikehoach,
                        maloai: data.loaikehoach[0].maloai,
                        doneLoadTaskType: true,
                    });
                }
            }
        );
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
                this.setState({newTaskTypeName: '', doneLoadTaskType: false});
                this.props.setLoadTaskTypeUndone();
                alert(response.data.message);
            }
        );
    }

    deleteTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/deleteloaikehoach?maloai=' + this.state.maloai, 'DELETE', null, localStorage.getItem('access_token')).then(
            response => {                
                this.setState({doneLoadTaskType: false});
                this.props.setLoadTaskTypeUndone();
                alert(response.data.message);
            }
        );
    }

    render(): React.ReactNode {

        if(!this.state.doneLoadTaskType && this.props.show) this.loadTaskType();
        
        return (
            <Modal show={this.props.show} onHide={this.props.hideModal} centered>
                <Modal.Body>
                    <Form.Group as={Col} controlId="formGridAddTaskType">
                        <Form.Label>Thêm loại kế hoạch</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control onChange={this.onChangeAddType.bind(this)} placeholder="Giải trí" value={this.state.newTaskTypeName}></Form.Control>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.addTaskType.bind(this)}>+</Button>
                            </InputGroup.Append>                            
                        </InputGroup>
                        <Alert variant='danger' hidden={this.state.taskTypeNameValidated}>Tối đa 10 ký tự và không được để trống.</Alert>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridDeleteTaskType">
                        <Form.Label>Xóa loại kế hoạch</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control as="select" onChange={this.onChangeDeleteType.bind(this)}>
                                {this.state.taskTypeList.map((taskType: TaskType) => {
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