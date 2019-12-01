import React from "react";
import { Redirect } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import TaskType from "../models/task_type";
import SideBar from "../components/sidebar/sidebar";
import NavBar from "../components/navbar/navbar";
import TaskDeck from "../components/task_section/task_deck";
import ButtonAddTask from "../components/task_section/add_task";
import TaskModal from "../components/task_section/task_modal";
import TaskTypeModal from "../components/task_section/task_type_modal";
import apiCaller from "../utils/apiCaller";

interface PageHomeState {
    userEmail: any,
    doneLoadTask: boolean;
    showModal: boolean;
    showTypeModal: boolean;
    isAddingTask: boolean;
    makehoach: string;
    taskType: TaskType[];
    doneLoadTaskType: boolean;
}

export default class PageHome extends React.Component<any, PageHomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            userEmail: (localStorage.getItem('access_token')) ? Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5] : '',
            doneLoadTask: false,
            showModal: false,
            showTypeModal: false,
            isAddingTask: true,
            makehoach: '',
            taskType: [],
            doneLoadTaskType: false,
        }
    }

    componentDidMount() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatethongke', 'GET', null);
        this.loadTaskPriority();
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

    loadTaskType() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/loaikehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { statusCode, data } = response;
                if(statusCode === 200) {
                    this.setState({taskType: data.loaikehoach, doneLoadTaskType: true});
                }
            }
        );
    }

    render(): React.ReactNode {

        if(localStorage.getItem('access_token') === null) return (<Redirect to="/dangnhap" />);
        if(!this.state.doneLoadTaskType) this.loadTaskType();

        return (
            <div>
                <NavBar />
                <SideBar 
                    mainContent=
                    {
                        <div style={{height: '100%'}}>
                            <div style={{marginBottom: 20}}>
                                <ButtonAddTask showModal={this.showAddModal.bind(this)} isDisabled={!this.state.doneLoadTaskType} />
                            </div>
                            <TaskDeck 
                                doneLoadTask={this.state.doneLoadTask}
                                setLoadTaskDone={this.setLoadTaskDone.bind(this)}
                                showModal={this.showUpdateModal.bind(this)}
                            />
                            <TaskModal 
                                isAddingTask={this.state.isAddingTask}
                                show={this.state.showModal}
                                setLoadTaskUndone={this.setLoadTaskUndone.bind(this)}
                                hideModal={this.hideModal.bind(this)}
                                makehoach={this.state.makehoach}
                                showTypeModal={this.showTypeModal.bind(this)}
                                taskType={this.state.taskType}
                            />
                            <TaskTypeModal 
                                show={this.state.showTypeModal}
                                hideModal={this.hideTypeModal.bind(this)}
                                taskTypeList={this.state.taskType}
                                setLoadTaskTypeUndone={this.setLoadTaskTypeUndone.bind(this)}
                            />
                        </div>
                    }
                    activeTab="#home"
                />                
            </div>
        );
    }
}