import React from "react";
import { Navbar, Nav, } from "react-bootstrap";
import ButtonDangKy from "./dangky";
import ButtonDangNhap from "./dangnhap";
import ButtonDangXuat from "./dangxuat";
import UserAvatar from "../profile/avatar";

export default class NavBar extends React.Component {
    isLoggedIn = (localStorage.getItem('access_token')) ? true : false;

    render(): React.ReactNode {
        return (
            <Navbar bg="light" expand="lg">
                <UserAvatar isHidden={!this.isLoggedIn} />
                <Navbar.Brand hidden={this.isLoggedIn} href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#feedback">Feedback</Nav.Link>
                        <Nav.Link href="#aboutus">About Us</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <ButtonDangNhap isHidden={this.isLoggedIn} />   
                <ButtonDangKy isHidden={this.isLoggedIn} />
                <ButtonDangXuat isHidden={!this.isLoggedIn} />            
            </Navbar>
        );
    }
}