import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class ButtonDangKy extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <Link to='/dangky'>
                    <Button variant="success">Đăng ký</Button>
                </Link>                
            </div>
        );
    }
}