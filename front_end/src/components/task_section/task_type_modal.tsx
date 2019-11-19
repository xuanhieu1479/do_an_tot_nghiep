import React from "react";
import { Modal, Form, InputGroup, Col, Button } from "react-bootstrap";
import jwt_decode from 'jwt-decode';
import apiCaller from "../../utils/apiCaller";
import TaskType from "../../models/task_type";

interface TaskTypeModalState {
    show: boolean;
    userEmail: any;
    newTaskTypeName: string;
    maloai: number;
    taskTypeList: TaskType[];
    doneLoadTaskType: boolean;
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
            show: this.props.show,
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            newTaskTypeName: '',
            maloai: 0,
            taskTypeList: [],
            doneLoadTaskType: false,
        }

        this.hideThisModal = this.hideThisModal.bind(this);
        this.onChangeAddType = this.onChangeAddType.bind(this);
        this.onChangeDeleteType = this.onChangeDeleteType.bind(this);
        this.loadTaskType = this.loadTaskType.bind(this);
        this.addTaskType = this.addTaskType.bind(this);
        this.deleteTaskType = this.deleteTaskType.bind(this);
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.show !== prevProps.show) {
            this.setState({show: this.props.show})
        }
    }

    hideThisModal() {
        this.setState({show: false});
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
                    this.setState({taskTypeList: data.loaikehoach, maloai: data.loaikehoach[0].maloai, doneLoadTaskType: true});
                }
            }
        );
    }

    addTaskType() {
        let newTaskType = {
            email: this.state.userEmail,
            tenloai: this.state.newTaskTypeName,
        };

        apiCaller(process.env.REACT_APP_DOMAIN + 'api/themloaikehoach', 'POST', newTaskType, localStorage.getItem('access_token')).then(
            response => {
                alert(response.data.message);
                this.setState({newTaskTypeName: '', doneLoadTaskType: false});
                this.props.setLoadTaskTypeUndone();                
            }
        );
    }

    deleteTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/deleteloaikehoach?maloai=' + this.state.maloai, 'DELETE', null, localStorage.getItem('access_token')).then(
            response => {
                alert(response.data.message);
                this.setState({doneLoadTaskType: false});
                this.props.setLoadTaskTypeUndone();                
            }
        );
    }

    render(): React.ReactNode {
        if(!this.state.doneLoadTaskType && this.state.show) this.loadTaskType();
        return (
            <Modal show={this.state.show} onHide={this.props.hideModal} centered>
                <Modal.Body>
                    <Form.Group as={Col} controlId="formGridAddTaskType">
                        <Form.Label>Thêm loại kế hoạch</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control onChange={this.onChangeAddType} value={this.state.newTaskTypeName}></Form.Control>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.addTaskType}>+</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridDeleteTaskType">
                        <Form.Label>Xóa loại kế hoạch</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control as="select" onChange={this.onChangeDeleteType}>
                                {this.state.taskTypeList.map((taskType: TaskType) => {
                                    return (
                                        <option key={taskType.maloai} data-key={taskType.maloai}>{taskType.tenloai}</option>
                                    );
                                })}
                            </Form.Control>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.deleteTaskType}>-</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Modal.Body>
            </Modal>
        );
    }
}