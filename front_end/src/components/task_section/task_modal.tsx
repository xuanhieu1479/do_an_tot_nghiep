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
}

interface TaskModalProps {
    modalType: string;
    show: boolean;
}

export default class TaskModal extends React.Component<TaskModalProps, TaskModalState> {
    constructor(props: TaskModalProps) {
        super(props);
        this.state = {
            show: false,
            tenkehoach: '',
            thoigian: new Date(),
            ghichu: '',
            mauutien: 0,
            maloai: 0,
            cothongbao: false,
            dahoanthanh: false,
        }

        this.showTaskModal = this.showTaskModal.bind(this);
        this.hideTaskModal = this.hideTaskModal.bind(this);
        this.onChangeTenKeHoach = this.onChangeTenKeHoach.bind(this);
        this.onChangeThoiGian = this.onChangeThoiGian.bind(this);
        this.onChangeGhiChu = this.onChangeGhiChu.bind(this);
        this.onChangeMaUuTien = this.onChangeMaUuTien.bind(this);
        this.onChangeMaLoai = this.onChangeMaLoai.bind(this);
        this.onChangeCoThongBao = this.onChangeCoThongBao.bind(this);
        this.onChangeDaHoanThanh = this.onChangeDaHoanThanh.bind(this);
        this.saveTask = this.saveTask.bind(this);
    }

    async UNSAFE_componentWillReceiveProps() {
        await this.setState({show: this.props.show});
    }

    showTaskModal() {
        this.setState({show: true});
    }

    hideTaskModal() {
        this.setState({show: false});
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

    async saveTask() {
        let token: string = localStorage.getItem('access_token') as string;
        let decodedToken: object = jwt_decode(token);
        let userEmail = Object.values(decodedToken)[5];

        let task = {
            email: userEmail,
            tenkehoach: this.state.tenkehoach,
            thoigian: this.state.thoigian,
            ghichu: this.state.ghichu,
            mauutien: this.state.mauutien,
            maloai: this.state.maloai,
            cothongbao: this.state.cothongbao,
            dahoanthanh: this.state.dahoanthanh,
        }

        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/addtask', 'PUT', task).then(
            response => {                
                this.hideTaskModal();
            }
        );
    }

    render(): React.ReactNode {
        return(
            <Modal 
                show={this.state.show} 
                centered
                onHide={this.hideTaskModal}
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
                                <Form.Control as="select" onChange={this.onChangeMaLoai}>
                                    <option>Công việc</option>
                                    <option>Ăn chơi</option>
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