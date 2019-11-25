import React from "react";
import { Button, Modal, Form, Col, InputGroup, Overlay, Tooltip } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import jwt_decode from 'jwt-decode';
import moment from "moment";
import apiCaller from "../../utils/apiCaller";
import TaskType from "../../models/task_type";

interface TaskModalState {
    tenkehoach: string;
    thoigian: Date;
    ghichu: string;
    mauutien: number;
    maloai: number;
    cothongbao: boolean;
    userEmail: any;
    doneLoadTask: boolean;
    dataChanged: boolean;
    dateTimeValidated: boolean;
    taskNameValidated: boolean;
    taskNoteValidated: boolean;
    isFetching: boolean;
}

interface TaskModalProps {
    isAddingTask: boolean;
    show: boolean;
    setLoadTaskUndone: () => void;
    hideModal: () => void;
    makehoach: string,
    showTypeModal: () => void;
    taskType: TaskType[];
}

export default class TaskModal extends React.Component<TaskModalProps, TaskModalState> {

    private dateTimePickerRef: any;
    private taskNameRef: any;
    private taskNoteRef: any;
    private taskNameRegex = new RegExp(/^.{1,20}$/);
    private taskNoteRegex = new RegExp(/^.{0,1000}$/);

    constructor(props: TaskModalProps) {
        super(props);
        this.state = {
            tenkehoach: '',
            thoigian: moment().add(1, 'hours').toDate(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            doneLoadTask: false,
            dataChanged: false,
            dateTimeValidated: true,
            taskNameValidated: true,
            taskNoteValidated: true,
            isFetching: false,
        }

        this.dateTimePickerRef = React.createRef();
        this.taskNameRef = React.createRef();
        this.taskNoteRef = React.createRef();
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.show !== prevProps.show) {
            this.setState({
                maloai: this.props.taskType[0].maloai,
                dataChanged: false,
                doneLoadTask: false,
                dateTimeValidated: true,
                taskNameValidated: true,
                taskNoteValidated: true,
            });
        }
        
        if(!this.props.isAddingTask && !this.state.doneLoadTask && this.props.show && !this.state.isFetching) {
            this.setState({isFetching: true});
            this.loadTaskData();
        }
    }

    hideThisModal() {
        if(this.props.isAddingTask) {
            this.props.hideModal();
        } else {
            if (this.state.dataChanged) {
                let isValidated = this.checkValidation();
                if (!isValidated) return;
            }            

            this.updateTask();
            this.resetThisModal();
            this.props.hideModal();
        }
    }

    cancelButton() {
        if(!this.props.isAddingTask) {
            this.resetThisModal();
        }      
        this.props.hideModal();
    }

    resetThisModal() {
        this.setState({
            tenkehoach: '',
            thoigian: moment().add(1, 'hours').toDate(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
        });
    }

    onChangeTenKeHoach(event: any) {        
        if (this.taskNameRegex.test(event.target.value) && !this.state.taskNameValidated) {
            this.setState({tenkehoach: event.target.value, dataChanged: true, taskNameValidated: true});
        } else {
            this.setState({tenkehoach: event.target.value, dataChanged: true});
        }
    }

    onChangeThoiGian(date: Date) {        
        if (date >= moment().add(3300, 'seconds').toDate() && !this.state.dateTimeValidated) {
            this.setState({thoigian: date, dataChanged: true, dateTimeValidated: true});
        } else {
            this.setState({thoigian: date, dataChanged: true});
        }
    }

    onChangeGhiChu(event: any) {        
        if (this.taskNoteRegex.test(event.target.value) && !this.state.taskNoteValidated) {
            this.setState({ghichu: event.target.value, dataChanged: true, taskNoteValidated: true});
        } else {
            this.setState({ghichu: event.target.value, dataChanged: true});
        }
    }

    onChangeMaUuTien(event: any) {
        this.setState({mauutien: event.target.selectedIndex, dataChanged: true});
    }

    onChangeMaLoai(event: any) {
        this.setState({maloai: event.target.options[event.target.selectedIndex].getAttribute('data-key'), dataChanged: true});
    }

    onChangeCoThongBao(event: any) {
        this.setState({cothongbao: event.target.checked, dataChanged: true});
    }

    getCurrentTaskType() {
        let lkh = this.props.taskType;
        for (let index = 0; index < lkh.length; ++index) {
            if (this.state.maloai === lkh[index].maloai) {
                return lkh[index].tenloai;
            }
        }
    }
    
    loadTaskData() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/kehoachbyid?makehoach=' + this.props.makehoach, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { data } = response;
                this.setState({
                    tenkehoach: data.kehoach.tenkehoach,
                    thoigian: new Date(data.kehoach.thoigian),
                    ghichu: data.kehoach.ghichu,
                    mauutien: data.kehoach.mauutien - 1,  //Vì auto increment dưới database bắt đầu = 1
                    maloai: data.kehoach.maloai,
                    cothongbao: data.kehoach.cothongbao,
                    doneLoadTask: true,
                    isFetching: false,
                });
            }
        );
    }

    checkValidation() {
        let dateTimeValidated = true;
        let taskNameValidated = true;
        let taskNoteValidated = true;
        let isValidated = true;

        if (this.state.thoigian <= moment().add(3300, 'seconds').toDate()) {
            dateTimeValidated = false;
            isValidated = false;
        }

        if (!this.taskNameRegex.test(this.state.tenkehoach)) {
            taskNameValidated = false;
            isValidated = false;
        }

        if (!this.taskNoteRegex.test(this.state.ghichu)) {
            taskNoteValidated = false;
            isValidated = false;
        }

        this.setState({dateTimeValidated: dateTimeValidated, taskNameValidated: taskNameValidated, taskNoteValidated: taskNoteValidated});
        return isValidated;
    }

    saveTask() {
        let isValidated = this.checkValidation();
        if (!isValidated) return;

        let task = {
            email: this.state.userEmail,
            tenkehoach: this.state.tenkehoach,
            thoigian: this.state.thoigian.toString(),
            ghichu: this.state.ghichu,
            mauutien: this.state.mauutien + 1, //Vì auto increment dưới database bắt đầu = 1
            maloai: this.state.maloai,
            cothongbao: this.state.cothongbao,
            dahoanthanh: false,
        }

        apiCaller(process.env.REACT_APP_DOMAIN + 'api/themkehoach', 'POST', task, localStorage.getItem('access_token')).then(
            response => {        
                this.props.setLoadTaskUndone();        
                this.resetThisModal();
                this.props.hideModal();
            }
        );
    }

    updateTask() {
        let isValidated = this.checkValidation();
        if (!isValidated) return;

        if (!this.state.dataChanged) return;
        let task = {
            tenkehoach: this.state.tenkehoach,
            thoigian: this.state.thoigian.toString(),
            ghichu: this.state.ghichu,
            mauutien: this.state.mauutien + 1, //Vì auto increment dưới database bắt đầu = 1
            maloai: this.state.maloai,
            cothongbao: this.state.cothongbao,
        }

        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatekehoach?makehoach=' + this.props.makehoach, 'PUT', task, localStorage.getItem('access_token')).then(
            response => {        
                this.props.setLoadTaskUndone();
                this.resetThisModal();
                this.props.hideModal();
            }
        );
    }

    deleteTask() {
        if (window.confirm("You're sure?")) {
            apiCaller(process.env.REACT_APP_DOMAIN + 'api/deletekehoach?makehoach=' + this.props.makehoach, 'DELETE', null, localStorage.getItem('access_token')).then(
                response => {        
                    this.props.setLoadTaskUndone();
                    this.resetThisModal();
                    this.props.hideModal();
                }
            );
        }        
    }

    render(): React.ReactNode {        

        let mucdouutien = (localStorage.getItem('mucdouutien')) ? JSON.parse(localStorage.getItem('mucdouutien')!).mucdouutien : [];           
        
        return(
            <Modal centered show={this.props.show} onHide={this.hideThisModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {(this.props.isAddingTask) ? <div>Add Task</div> : <div>Update Task</div>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridPrioritiy">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control as="select" 
                                    onChange={this.onChangeMaUuTien.bind(this)} 
                                    value={mucdouutien[this.state.mauutien]}
                                >
                                    {(mucdouutien) ? 
                                        mucdouutien.map((mdut :string, index: number) => {
                                            return (
                                                <option key={index}>{mdut}</option>
                                            );
                                        })
                                        :
                                        <div></div>
                                    }
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTaskType">
                                <Form.Label>Type</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        as="select" 
                                        onChange={this.onChangeMaLoai.bind(this)}
                                        value={this.getCurrentTaskType()}
                                    >
                                        {this.props.taskType.map((lkh: TaskType) => {
                                            return (
                                                <option key={lkh.maloai} data-key={lkh.maloai}>{lkh.tenloai}</option>
                                            );
                                        })}
                                    </Form.Control>
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={this.props.showTypeModal}>+</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridTime">
                                <Form.Label>Start Date</Form.Label>
                                <DateTimePicker
                                    ref={this.dateTimePickerRef}
                                    onChange={this.onChangeThoiGian.bind(this)}
                                    value={this.state.thoigian}
                                    format="dd-MM-y h:mm:ss a"
                                />
                                <Overlay target={this.dateTimePickerRef.current} show={!this.state.dateTimeValidated} placement="right">
                                    {(props: any) => (
                                    <Tooltip id="dateTimePicker-tooltip" {...props} show={(props.show).toString()}>
                                        At least 1 hour from now
                                    </Tooltip>
                                    )}
                                </Overlay>
                            </Form.Group>
                            <Form.Group as={Col} style={{textAlign: 'right'}} controlId="formGridHasNotification">
                                <Form.Label>Has Notification?</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="id"
                                    label=""
                                    checked={this.state.cothongbao}
                                    onChange={this.onChangeCoThongBao.bind(this)}
                                />
                            </Form.Group>
                        </Form.Row>
                        
                        <Form.Group controlId="formGridTaskName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                ref={this.taskNameRef}
                                type="text"
                                placeholder="Yoga Practice"
                                value={this.state.tenkehoach}
                                onChange={this.onChangeTenKeHoach.bind(this)} 
                            />
                            <Overlay target={this.taskNameRef.current} show={!this.state.taskNameValidated} placement="top">
                                {(props: any) => (
                                <Tooltip id="taskName-tooltip" {...props} show={(props.show).toString()}>
                                    Maximum 20 characters and non-empty
                                </Tooltip>
                                )}
                            </Overlay>
                        </Form.Group>

                        <Form.Group controlId="formGridTaskDetail">
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                ref={this.taskNoteRef}
                                as="textarea"
                                placeholder="Ashen one, hearest thou my voice, still?"
                                rows="5"
                                value={(this.state.ghichu) ? this.state.ghichu : ''} onChange={this.onChangeGhiChu.bind(this)} 
                            />
                            <Overlay target={this.taskNoteRef.current} show={!this.state.taskNoteValidated} placement="top">
                                {(props: any) => (
                                <Tooltip id="taskName-tooltip" {...props} show={(props.show).toString()}>
                                    Maximum 1000 characters
                                </Tooltip>
                                )}
                            </Overlay>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{width: '100%'}}>
                        <div style={{display: 'inline', float: 'right'}}>
                            <Button variant="success" onClick={(this.props.isAddingTask) ? this.saveTask.bind(this) : this.updateTask.bind(this)}>Save</Button>
                            <Button variant="danger" onClick={this.cancelButton.bind(this)}>Cancel</Button>
                        </div>
                        <div style={{display: 'inline', float: 'left'}}>
                            <Button variant="dark" onClick={this.deleteTask.bind(this)}>Delete</Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}