import React from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router";
import SideBar from "../components/sidebar/sidebar";

export default class PageCalendar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.clearAccessToken = this.clearAccessToken.bind(this);
    }

    clearAccessToken() {
        localStorage.removeItem('access_token');
        this.props.history.push('./');
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        return (
            <div>
                <SideBar 
                    mainContent=
                    {
                        <Button variant="primary" onClick={this.clearAccessToken}>
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