import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ButtonDangXuatProps {
    isHidden: boolean;
}

export default class ButtonDangXuat extends React.Component<ButtonDangXuatProps, any> {

    clearLocalStorage() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('mucdouutien');
    }

    render(): React.ReactNode {
        return (
            <Link to='/'>
                <Button variant="secondary" hidden={this.props.isHidden} onClick={this.clearLocalStorage}>Sign Out</Button>
            </Link>
        );
    }
}