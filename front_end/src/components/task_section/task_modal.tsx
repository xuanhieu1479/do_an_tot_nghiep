import React from "react";
import { Button, Modal, Form, Col, InputGroup } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import jwt_decode from 'jwt-decode';
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
    constructor(props: TaskModalProps) {
        super(props);
        this.state = {
            show: this.props.show,
            tenkehoach: '',
            thoigian: new Date(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
            dahoanthanh: false,
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            loaikehoach: [],
            doneLoadTask: false,
            dataChanged: false,
        }

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
            });
        }
    }

    hideThisModal() {
        if(this.props.isAddingTask) {
            this.setState({
                show: false,
            });
        } else {
            this.updateTask();
            this.resetThisModal();
        }        
        this.props.hideModal();
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
            thoigian: new Date(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
            dahoanthanh: false,
        });
    }

    onChangeTenKeHoach(event: any) {
        this.setState({tenkehoach: event.target.value, dataChanged: true});        
    }

    onChangeThoiGian(date: Date) {
        this.setState({thoigian: date, dataChanged: true});
    }

    onChangeGhiChu(event: any) {
        this.setState({ghichu: event.target.value, dataChanged: true});
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

    async saveTask() {
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
                                <div>
                                    <DateTimePicker 
                                        onChange={this.onChangeThoiGian}
                                        value={this.state.thoigian}
                                        format="dd-MM-y h:mm:ss a"
                                    />
                                </div>
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
                            <Form.Control type="text" value={this.state.tenkehoach} onChange={this.onChangeTenKeHoach} />
                        </Form.Group>

                        <Form.Group controlId="formGridTaskDetail">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control as="textarea" rows="5" value={(this.state.ghichu) ? this.state.ghichu : ''} onChange={this.onChangeGhiChu} />
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