import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ButtonDangNhapProps {
    isHidden: boolean;
}

export default class ButtonDangNhap extends React.Component<ButtonDangNhapProps, any> {

    render(): React.ReactNode {
        return (
            <Link to='/dangnhap'>
                <Button variant="primary" hidden={this.props.isHidden}>Đăng nhập</Button>
            </Link>
        );
    }
}