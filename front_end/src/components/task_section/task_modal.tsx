import React from "react";
import { Button, Modal, Form, Col, InputGroup } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import jwt_decode from 'jwt-decode';
import apiCaller from "../../utils/apiCaller";

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
    loaikehoach: string[];
    doneLoadTaskType: boolean;
}

interface TaskModalProps {
    modalType: string;
    show: boolean;
    setLoadTaskUndone: () => void;
    hideModal: () => void;
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
            loaikehoach: ['Công việc'],
            doneLoadTaskType: false,
        }

        this.hideThisModal = this.hideThisModal.bind(this);
        this.onChangeTenKeHoach = this.onChangeTenKeHoach.bind(this);
        this.onChangeThoiGian = this.onChangeThoiGian.bind(this);
        this.onChangeGhiChu = this.onChangeGhiChu.bind(this);
        this.onChangeMaUuTien = this.onChangeMaUuTien.bind(this);
        this.onChangeMaLoai = this.onChangeMaLoai.bind(this);
        this.onChangeCoThongBao = this.onChangeCoThongBao.bind(this);
        this.onChangeDaHoanThanh = this.onChangeDaHoanThanh.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.saveTask = this.saveTask.bind(this);
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.show !== prevProps.show) {
            this.setState({show: this.props.show, thoigian: new Date()});
        }
    }

    hideThisModal() {
        this.setState({show: false, doneLoadTaskType: false});
        this.props.hideModal();
    }

    onChangeTenKeHoach(event: any) {
        this.setState({tenkehoach: event.target.value});        
    }

    onChangeThoiGian(date: Date) {
        this.setState({thoigian: date});
    }

    onChangeGhiChu(event: any) {
        this.setState({ghichu: event.target.value});
    }

    onChangeMaUuTien(event: any) {
        this.setState({mauutien: event.target.selectedIndex});
    }

    onChangeMaLoai(event: any) {
        this.setState({maloai: event.target.selectedIndex});
    }

    onChangeCoThongBao(event: any) {
        this.setState({cothongbao: event.target.checked});
    }

    onChangeDaHoanThanh(event: any) {
        this.setState({dahoanthanh: event.target.checked});
    }

    loadTaskPriority() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/mucdouutien', 'GET').then(            
            response => {
                localStorage.setItem('mucdouutien', JSON.stringify(response.data));
            }
        );
    }

    loadTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/loaikehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode, data } = response;
                if(statusCode === 200) {
                    this.setState({loaikehoach: data.loaikehoach, doneLoadTaskType: true});
                }
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
            maloai: this.state.maloai + 1,
            cothongbao: this.state.cothongbao,
            dahoanthanh: this.state.dahoanthanh,
        }

        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/themkehoach', 'POST', task, localStorage.getItem('access_token')).then(
            response => {        
                this.props.setLoadTaskUndone();        
                this.setState({show: false, doneLoadTaskType: false, thoigian: new Date()});
                this.props.hideModal();
            }
        );
    }

    render(): React.ReactNode {
        if(localStorage.getItem('mucdouutien') === null) {
            this.loadTaskPriority();
        }
        let mucdouutien = JSON.parse(localStorage.getItem('mucdouutien')!);
        if(!this.state.doneLoadTaskType && this.state.show) this.loadTaskType();
        
        return(
            <Modal 
                show={this.state.show} 
                centered
                onHide={this.hideThisModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Tạo task mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridPrioritiy">
                            <Form.Label>Mức độ ưu tiên</Form.Label>
                            <Form.Control as="select" onChange={this.onChangeMaUuTien}>
                                {(mucdouutien) ? 
                                    mucdouutien.mucdouutien.map((mdut :string) => {     //Sau khi parse thì nó vẫn là object, map chỉ dùng đc với array
                                        return (                                        //Array cần tìm nằm trong mucdouutien
                                            <option>{mdut}</option>
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
                                <Form.Control as="select" onChange={this.onChangeMaLoai}>
                                    {this.state.loaikehoach.map((lkh: string) => {
                                        return (
                                            <option>{lkh}</option>
                                        );
                                    })}
                                </Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-secondary">+</Button>
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
                                    onChange={this.onChangeCoThongBao}
                                />
                            </Form.Group>
                        </Form.Row>
                        
                        <Form.Group controlId="formGridTaskName">
                            <Form.Label>Tên Task</Form.Label>
                            <Form.Control type="text" onChange={this.onChangeTenKeHoach} />
                        </Form.Group>

                        <Form.Group controlId="formGridTaskDetail">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control as="textarea" rows="5" onChange={this.onChangeGhiChu} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.saveTask}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}