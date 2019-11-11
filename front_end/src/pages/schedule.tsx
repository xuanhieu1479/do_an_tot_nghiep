import React from "react";
import { Redirect } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import TaskDeck from "../components/task_section/task_deck";

export default class PageSchedule extends React.Component<any, any> {

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <TaskDeck />
                    }
                    activeTab="#schedule"
                    transitions={false}
                />                
            </div>
        );
    }
}