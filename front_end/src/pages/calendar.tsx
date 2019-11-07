import React from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";

export default class PageCalendar extends React.Component<any, any> {

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <Button variant="primary">
                            Calendar
                        </Button>
                    }
                    activeTab="#calendar"
                    transitions={false}
                />                
            </div>
        );
    }
}