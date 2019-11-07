import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ButtonDangKyProps {
    isHidden: boolean;
}

export default class ButtonDangKy extends React.Component<ButtonDangKyProps, any> {

    render(): React.ReactNode {
        return (
            <div>
                <Link to='/dangky'>
                    <Button variant="success" hidden={this.props.isHidden}>Đăng ký</Button>
                </Link>                
            </div>
        );
    }
}