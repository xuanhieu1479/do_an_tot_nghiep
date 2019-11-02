import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class ButtonDangNhap extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <Link to='/dangnhap'>
                    <Button variant="success">Đăng nhập</Button>
                </Link>   
            </div>
        );
    }
}