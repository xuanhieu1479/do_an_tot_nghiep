import React from "react";
import { Redirect } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import Calendar from "../components/calendar_section/calendar";

export default class PageCalendar extends React.Component<any, any> {

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <Calendar />
                    }
                    activeTab="#calendar"
                    transitions={false}
                />                
            </div>
        );
    }
}