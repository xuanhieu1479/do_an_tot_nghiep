import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ButtonDangNhapProps {
    isHidden: boolean;
}

export default class ButtonDangNhap extends React.Component<ButtonDangNhapProps, any> {

    render(): React.ReactNode {
        return (
            <Link to='/dangnhap'>
                <Button variant="primary" hidden={this.props.isHidden}>Sign In</Button>
            </Link>
        );
    }
}