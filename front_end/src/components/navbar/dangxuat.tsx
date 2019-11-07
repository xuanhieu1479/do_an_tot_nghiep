import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ButtonDangXuatProps {
    isHidden: boolean;
}

export default class ButtonDangXuat extends React.Component<ButtonDangXuatProps, any> {

    clearAccessToken() {
        localStorage.removeItem('access_token');
    }

    render(): React.ReactNode {
        return (
            <div>
                <Link to='/'>
                    <Button variant="secondary" hidden={!this.props.isHidden} onClick={this.clearAccessToken}>Đăng xuất</Button>
                </Link>   
            </div>
        );
    }
}