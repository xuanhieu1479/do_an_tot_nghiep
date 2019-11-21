import React from "react";
import { Card, CardDeck, ListGroup } from "react-bootstrap";
import jwt_decode from 'jwt-decode';
import TaskItem from "./task_item";
import Task from "../../models/task";
import apiCaller from "../../utils/apiCaller";

interface TaskDeckState {
    userEmail: any;
    overdueTask: Task[];
    todayTask: Task[];
    tommorowTask: Task[];
    otherTask: Task[];
    doneLoadTask: boolean;
    deleteThisItem: string[];
    isFetching: boolean;
}

interface TaskDeckProps {
    doneLoadTask: boolean;
    setLoadTaskDone: () => void;
    showModal: (makehoach: string) => void;
}

export default class TaskDeck extends React.Component<TaskDeckProps, TaskDeckState> {
    constructor(props: TaskDeckProps) {
        super(props);
        this.state = {
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            overdueTask: [],
            todayTask: [],
            tommorowTask: [],
            otherTask: [],
            doneLoadTask: this.props.doneLoadTask,
            deleteThisItem: [],
            isFetching: false,
        }
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.doneLoadTask !== prevProps.doneLoadTask) {
            this.setState({doneLoadTask: this.props.doneLoadTask});
        }

        if(!this.state.doneLoadTask && !this.state.isFetching) {
            this.setState({isFetching: true});
            this.loadTask();
        }
    }

    loadTask() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/kehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { data } = response;
                this.setState({
                    overdueTask: data.overdueTask,
                    todayTask: data.todayTask,
                    tommorowTask: data.tommorowTask,
                    otherTask: data.otherTask,
                    doneLoadTask: true,
                    isFetching: false,
                });
                this.props.setLoadTaskDone();
            }
        );
    }

    deleteThisItem(makehoach: string) {
        let dummyArray = this.state.deleteThisItem; 
        dummyArray.push(makehoach);
        this.setState({deleteThisItem: dummyArray});
    }

    render(): React.ReactNode {
        return (
            <CardDeck style={{height: "90%", width: "100%"}}>
                <Card style={{height: "100%"}}>
                    <Card.Body style={{overflow: 'auto'}}>
                    <Card.Title>Quá thời gian</Card.Title>
                        <ListGroup>
                            {this.state.overdueTask.map(task => {
                                return (
                                    (this.state.deleteThisItem.indexOf(task.makehoach) === -1) ?
                                    <TaskItem
                                        key={task.makehoach}
                                        task={task} 
                                        showModal={this.props.showModal}
                                        deleteThisItem={this.deleteThisItem.bind(this)}
                                    />
                                    :
                                    null
                                );
                            })}
                        </ListGroup>
                    </Card.Body>
                </Card>
                <Card style={{height: "100%"}}>
                    <Card.Body style={{overflow: 'auto'}}>
                    <Card.Title>Hôm nay</Card.Title>
                        {this.state.todayTask.map(task => {
                            return (
                                (this.state.deleteThisItem.indexOf(task.makehoach) === -1) ?
                                <TaskItem
                                    key={task.makehoach}
                                    task={task} 
                                    showModal={this.props.showModal}
                                    deleteThisItem={this.deleteThisItem.bind(this)}
                                />
                                :
                                null
                            );
                        })}
                    </Card.Body>
                </Card>
                <Card style={{height: "100%"}}>
                    <Card.Body style={{overflow: 'auto'}}>
                    <Card.Title>Ngày mai</Card.Title>
                        {this.state.tommorowTask.map(task => {
                            return (
                                (this.state.deleteThisItem.indexOf(task.makehoach) === -1) ?
                                <TaskItem
                                    key={task.makehoach}
                                    task={task} 
                                    showModal={this.props.showModal}
                                    deleteThisItem={this.deleteThisItem.bind(this)}
                                />
                                :
                                null
                            );
                        })}
                    </Card.Body>
                </Card>
                <Card style={{height: "100%"}}>
                    <Card.Body style={{overflow: 'auto'}}>
                    <Card.Title>Các task khác</Card.Title>
                        {this.state.otherTask.map(task => {
                            return (
                                (this.state.deleteThisItem.indexOf(task.makehoach) === -1) ?
                                <TaskItem
                                    key={task.makehoach}
                                    task={task} 
                                    showModal={this.props.showModal}
                                    deleteThisItem={this.deleteThisItem.bind(this)}
                                />
                                :
                                null
                            );
                        })}
                    </Card.Body>
                </Card>
            </CardDeck>
        );
    }
}