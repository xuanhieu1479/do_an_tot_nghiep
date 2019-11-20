import React from "react";
import { Button, Modal, Form, Col, InputGroup, Overlay, Tooltip } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import jwt_decode from 'jwt-decode';
import moment from "moment";
import apiCaller from "../../utils/apiCaller";
import TaskType from "../../models/task_type";

interface TaskModalState {
    show: boolean;
    tenkehoach: string;
    thoigian: Date;
    ghichu: string;
    mauutien: number;
    maloai: number;
    cothongbao: boolean;
    dahoanthanh: boolean;
    userEmail: any;
    loaikehoach: TaskType[];
    doneLoadTask: boolean;
    dataChanged: boolean;
    dateTimeValidated: boolean;
    taskNameValidate: boolean;
    taskNoteValidated: boolean;
}

interface TaskModalProps {
    isAddingTask: boolean;
    show: boolean;
    setLoadTaskUndone: () => void;
    hideModal: () => void;
    makehoach: string,
    showTypeModal: () => void;
    doneLoadTaskType: boolean;
    setLoadTaskTypeDone: () => void;
}

export default class TaskModal extends React.Component<TaskModalProps, TaskModalState> {
    private dateTimePickerRef: any;
    private taskNameRef: any;
    private taskNoteRef: any;
    constructor(props: TaskModalProps) {
        super(props);
        this.state = {
            show: this.props.show,
            tenkehoach: '',
            thoigian: moment().add(1, 'hours').toDate(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
            dahoanthanh: false,
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            loaikehoach: [],
            doneLoadTask: false,
            dataChanged: false,
            dateTimeValidated: true,
            taskNameValidate: true,
            taskNoteValidated: true,
        }

        this.dateTimePickerRef = React.createRef();
        this.taskNameRef = React.createRef();
        this.taskNoteRef = React.createRef();

        this.hideThisModal = this.hideThisModal.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.resetThisModal = this.resetThisModal.bind(this);
        this.onChangeTenKeHoach = this.onChangeTenKeHoach.bind(this);
        this.onChangeThoiGian = this.onChangeThoiGian.bind(this);
        this.onChangeGhiChu = this.onChangeGhiChu.bind(this);
        this.onChangeMaUuTien = this.onChangeMaUuTien.bind(this);
        this.onChangeMaLoai = this.onChangeMaLoai.bind(this);
        this.onChangeCoThongBao = this.onChangeCoThongBao.bind(this);
        this.onChangeDaHoanThanh = this.onChangeDaHoanThanh.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.getCurrentTaskType = this.getCurrentTaskType.bind(this);
        this.checkValidation = this.checkValidation.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.show !== prevProps.show) {
            this.setState({
                show: this.props.show,                 
                dataChanged: false,
                doneLoadTask: false,
                dateTimeValidated: true,
                taskNameValidate: true,
                taskNoteValidated: true,
            });
        }
    }

    hideThisModal() {
        if(this.props.isAddingTask) {
            this.setState({
                show: false,
            });
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
        if(this.props.isAddingTask) {
            this.setState({
                show: false,
            });
        } else {
            this.resetThisModal();
        }        
        this.props.hideModal();
    }

    resetThisModal() {
        this.setState({
            show: false, 
            tenkehoach: '',
            thoigian: moment().add(1, 'hours').toDate(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
            dahoanthanh: false,
        });
    }

    async onChangeTenKeHoach(event: any) {
        await this.setState({tenkehoach: event.target.value, dataChanged: true});
        let taskNameRegex = new RegExp(/^.{1,20}$/);        
        if (taskNameRegex.test(this.state.tenkehoach) && this.state.taskNameValidate === false) {
            this.setState({taskNameValidate: true});
        }
    }

    async onChangeThoiGian(date: Date) {
        await this.setState({thoigian: date, dataChanged: true});
        if (this.state.thoigian >= moment().add(3300, 'seconds').toDate() && this.state.dateTimeValidated === false) {
            this.setState({dateTimeValidated: true});
        }
    }

    async onChangeGhiChu(event: any) {
        await this.setState({ghichu: event.target.value, dataChanged: true});
        let taskNoteRegex = new RegExp(/^.{0,1000}$/);
        if (taskNoteRegex.test(this.state.ghichu) && this.state.taskNoteValidated === false) {
            this.setState({taskNoteValidated: true});
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

    onChangeDaHoanThanh(event: any) {
        this.setState({dahoanthanh: event.target.checked, dataChanged: true});
    }

    loadTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/loaikehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode, data } = response;
                if(statusCode === 200) {
                    this.setState({loaikehoach: data.loaikehoach, maloai: data.loaikehoach[0].maloai});
                    this.props.setLoadTaskTypeDone();
                }
            }
        );
    }

    getCurrentTaskType() {
        let lkh = this.state.loaikehoach;
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
                    dahoanthanh: data.kehoach.dahoanthanh,
                    doneLoadTask: true,
                });
            }
        );
    }

    checkValidation() {
        let taskNameRegex = new RegExp(/^.{1,20}$/);
        let taskNoteRegex = new RegExp(/^.{0,1000}$/);
        let isValidated;

        if (this.state.thoigian >= moment().add(3300, 'seconds').toDate()) {
            this.setState({dateTimeValidated: true});
            isValidated = true;
        } else {
            this.setState({dateTimeValidated: false});
            isValidated = false;
        }

        if (taskNameRegex.test(this.state.tenkehoach)) {
            this.setState({taskNameValidate: true});
            isValidated = (isValidated && true);
        } else {
            this.setState({taskNameValidate: false});
            isValidated = false;
        }

        if (taskNoteRegex.test(this.state.ghichu)) {
            this.setState({taskNoteValidated: true});
            isValidated = (isValidated && true);
        } else {
            this.setState({taskNoteValidated: false});
            isValidated = false;
        }

        return isValidated;
    }

    async saveTask() {
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
            dahoanthanh: this.state.dahoanthanh,
        }

        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/themkehoach', 'POST', task, localStorage.getItem('access_token')).then(
            response => {        
                this.props.setLoadTaskUndone();        
                this.resetThisModal();
                this.props.hideModal();
            }
        );
    }

    async updateTask() {
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
            dahoanthanh: this.state.dahoanthanh,
        }

        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatekehoach?makehoach=' + this.props.makehoach, 'PUT', task, localStorage.getItem('access_token')).then(
            response => {        
                this.props.setLoadTaskUndone();
                this.resetThisModal();
                this.props.hideModal();
            }
        );
    }

    deleteTask() {
        if (window.confirm("Chắc không?")) {
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
        if(!this.props.doneLoadTaskType && this.state.show) this.loadTaskType();
        if(!this.props.isAddingTask && !this.state.doneLoadTask && this.state.show) this.loadTaskData();
        
        return(
            <Modal 
                show={this.state.show} 
                centered
                onHide={this.hideThisModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {(this.props.isAddingTask) ? <div>Tạo task mới</div> : <div>Cập nhật task</div>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridPrioritiy">
                            <Form.Label>Mức độ ưu tiên</Form.Label>
                            <Form.Control as="select" 
                                onChange={this.onChangeMaUuTien} 
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
                            <Form.Label>Loại Task</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control as="select" 
                                    onChange={this.onChangeMaLoai}
                                    value={this.getCurrentTaskType()}
                                >
                                    {this.state.loaikehoach.map((lkh: TaskType) => {
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
                                <Form.Label>Ngày bắt đầu</Form.Label>
                                <DateTimePicker
                                    ref={this.dateTimePickerRef}
                                    onChange={this.onChangeThoiGian}
                                    value={this.state.thoigian}
                                    format="dd-MM-y h:mm:ss a"
                                />
                                <Overlay target={this.dateTimePickerRef.current} show={!this.state.dateTimeValidated} placement="right">
                                    {(props: any) => (
                                    <Tooltip id="dateTimePicker-tooltip" {...props} show={(props.show).toString()}>
                                        Ít nhất sau 1 giờ hiện tại
                                    </Tooltip>
                                    )}
                                </Overlay>
                            </Form.Group>
                            <Form.Group as={Col} style={{textAlign: 'right'}} controlId="formGridHasNotification">
                                <Form.Label>Có thông báo</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="id"
                                    label=""
                                    checked={this.state.cothongbao}
                                    onChange={this.onChangeCoThongBao}
                                />
                            </Form.Group>
                        </Form.Row>
                        
                        <Form.Group controlId="formGridTaskName">
                            <Form.Label>Tên Task</Form.Label>
                            <Form.Control
                                ref={this.taskNameRef}
                                type="text"
                                value={this.state.tenkehoach}
                                onChange={this.onChangeTenKeHoach} 
                            />
                            <Overlay target={this.taskNameRef.current} show={!this.state.taskNameValidate} placement="top">
                                {(props: any) => (
                                <Tooltip id="taskName-tooltip" {...props} show={(props.show).toString()}>
                                    Tối đa 20 ký tự và không được để trống
                                </Tooltip>
                                )}
                            </Overlay>
                        </Form.Group>

                        <Form.Group controlId="formGridTaskDetail">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                ref={this.taskNoteRef}
                                as="textarea"
                                rows="5"
                                value={(this.state.ghichu) ? this.state.ghichu : ''} onChange={this.onChangeGhiChu} 
                            />
                            <Overlay target={this.taskNoteRef.current} show={!this.state.taskNoteValidated} placement="top">
                                {(props: any) => (
                                <Tooltip id="taskName-tooltip" {...props} show={(props.show).toString()}>
                                    Tối đa 1000 ký tự
                                </Tooltip>
                                )}
                            </Overlay>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{width: '100%'}}>
                        <div style={{display: 'inline', float: 'right'}}>
                            <Button variant="success" onClick={(this.props.isAddingTask) ? this.saveTask : this.updateTask}>Lưu</Button>
                            <Button variant="danger" onClick={this.cancelButton}>Hủy</Button>
                        </div>
                        <div style={{display: 'inline', float: 'left'}}>
                            <Button variant="dark" onClick={this.deleteTask}>Xóa</Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}