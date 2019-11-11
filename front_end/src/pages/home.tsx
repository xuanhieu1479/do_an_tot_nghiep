import React from "react";
import { Redirect } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import TaskDeck from "../components/task_section/task_deck";
import ButtonAddkTask from "../components/task_section/add_task";

export default class PageHome extends React.Component {

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <div style={{height: '100%'}}>
                            <div style={{marginBottom: 20}}><ButtonAddkTask /></div>
                            <TaskDeck />                            
                        </div>
                    }
                    activeTab="#home"
                />                
            </div>
        );
    }
}