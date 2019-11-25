import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ButtonDangKyProps {
    isHidden: boolean;
}

export default class ButtonDangKy extends React.Component<ButtonDangKyProps, any> {

    render(): React.ReactNode {
        return (
            <Link to='/dangky'>
                <Button variant="success" hidden={this.props.isHidden}>Sign Up</Button>
            </Link>
        );
    }
}