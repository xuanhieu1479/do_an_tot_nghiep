import React from "react";
import { Redirect } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import TaskDeck from "../components/task_section/task_deck";
import ButtonAddTask from "../components/task_section/add_task";

interface PageHomeState {
    doneLoadTask: boolean;
}

export default class PageHome extends React.Component<any, PageHomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            doneLoadTask: false,
        }

        this.setLoadTaskDone = this.setLoadTaskDone.bind(this);
        this.setLoadTaskUndone = this.setLoadTaskUndone.bind(this);
    }

    setLoadTaskDone() {
        this.setState({doneLoadTask: true});
    }

    setLoadTaskUndone() {
        this.setState({doneLoadTask: false});
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <div style={{height: '100%'}}>
                            <div style={{marginBottom: 20}}><ButtonAddTask setLoadTaskUndone={this.setLoadTaskUndone} /></div>
                            <TaskDeck 
                                doneLoadTask={this.state.doneLoadTask}
                                setLoadTaskDone={this.setLoadTaskDone}
                            />
                        </div>
                    }
                    activeTab="#home"
                />                
            </div>
        );
    }
}