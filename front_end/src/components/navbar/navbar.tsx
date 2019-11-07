import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown,  } from "react-bootstrap";
import ButtonDangKy from "./dangky";
import ButtonDangNhap from "./dangnhap";
import ButtonDangXuat from "./dangxuat";

export default class NavBar extends React.Component {
    isLoggedIn = (localStorage.getItem('access_token')) ? true : false;

    render(): React.ReactNode {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    <ButtonDangNhap isHidden={this.isLoggedIn} />   
                    <ButtonDangKy isHidden={this.isLoggedIn} />
                    <ButtonDangXuat isHidden={this.isLoggedIn} />            
                </Navbar>                
            </div>
        );
    }
}