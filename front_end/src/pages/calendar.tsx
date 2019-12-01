import React from "react";
import { Redirect } from "react-router-dom";
import apiCaller from "../utils/apiCaller";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import Calendar from "../components/calendar_section/calendar";

export default class PageCalendar extends React.Component<any, any> {
    componentDidMount() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatethongke', 'GET', null);
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent={<Calendar />}
                    activeTab="#calendar"
                />                
            </div>
        );
    }
}