import React from "react";
import { Redirect } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import TaskDeck from "../components/task_section/task_deck";
import ButtonAddTask from "../components/task_section/add_task";
import TaskModal from "../components/task_section/task_modal";
import TaskTypeModal from "../components/task_section/task_type_modal";
import apiCaller from "../utils/apiCaller";

interface PageHomeState {
    doneLoadTask: boolean;
    showModal: boolean;
    showTypeModal: boolean;
    isAddingTask: boolean;
    makehoach: string;
    doneLoadTaskType: boolean;
}

export default class PageHome extends React.Component<any, PageHomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            doneLoadTask: false,
            showModal: false,
            showTypeModal: false,
            isAddingTask: true,
            makehoach: '',
            doneLoadTaskType: false,
        }

        this.showAddModal = this.showAddModal.bind(this);
        this.showUpdateModal = this.showUpdateModal.bind(this);
        this.showTypeModal = this.showTypeModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.hideTypeModal = this.hideTypeModal.bind(this);
        this.setLoadTaskDone = this.setLoadTaskDone.bind(this);
        this.setLoadTaskUndone = this.setLoadTaskUndone.bind(this);
        this.setLoadTaskTypeDone = this.setLoadTaskTypeDone.bind(this);
        this.setLoadTaskTypeUndone = this.setLoadTaskTypeUndone.bind(this);
    }

    showAddModal() {
        this.setState({showModal: true, isAddingTask: true});
    }

    showUpdateModal(makehoach: string) {
        this.setState({showModal: true, makehoach: makehoach, isAddingTask: false});
    }

    showTypeModal() {
        this.setState({showTypeModal: true});
    }

    hideModal() {
        this.setState({showModal: false});
    }

    hideTypeModal() {
        this.setState({showTypeModal: false})
    }

    setLoadTaskDone() {
        this.setState({doneLoadTask: true});
    }

    setLoadTaskUndone() {
        this.setState({doneLoadTask: false});
    }

    setLoadTaskTypeDone() {
        this.setState({doneLoadTaskType: true});
    }

    setLoadTaskTypeUndone() {
        this.setState({doneLoadTaskType: false});
    }

    loadTaskPriority() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/mucdouutien', 'GET').then(            
            response => {
                localStorage.setItem('mucdouutien', JSON.stringify(response.data));
            }
        );
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        if(localStorage.getItem('mucdouutien') === null) {
            this.loadTaskPriority();
        }
        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <div style={{height: '100%'}}>
                            <div style={{marginBottom: 20}}><ButtonAddTask showModal={this.showAddModal} setLoadTaskTypeUndone={this.setLoadTaskTypeUndone} /></div>
                            <TaskDeck 
                                doneLoadTask={this.state.doneLoadTask}
                                setLoadTaskDone={this.setLoadTaskDone}
                                showModal={this.showUpdateModal}
                            />
                            <TaskModal 
                                isAddingTask={this.state.isAddingTask}
                                show={this.state.showModal}
                                setLoadTaskUndone={this.setLoadTaskUndone}
                                hideModal={this.hideModal}
                                makehoach={this.state.makehoach}
                                showTypeModal={this.showTypeModal}
                                doneLoadTaskType={this.state.doneLoadTaskType}
                                setLoadTaskTypeDone={this.setLoadTaskTypeDone}
                            />
                            <TaskTypeModal 
                                show={this.state.showTypeModal}
                                hideModal={this.hideTypeModal}
                                setLoadTaskTypeUndone={this.setLoadTaskTypeUndone}
                            />
                        </div>
                    }
                    activeTab="#home"
                />                
            </div>
        );
    }
}