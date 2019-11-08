import React from "react";
import { Card, CardDeck, ListGroup } from "react-bootstrap";
import TaskItem from "./task_item";
import Task from "../../models/task";
import dummyTask from "../../dummy_data/task.json";

interface TaskDeckState {
    taskList: Task[];
}

export default class TaskDeck extends React.Component<any, TaskDeckState> {
    constructor(props: any) {
        super(props);
        this.state = {
            taskList: dummyTask.tasks
        }
    }

    render(): React.ReactNode {
        return (
            <CardDeck style={{height: "90%", width: "100%"}}>
                <Card style={{height: "100%"}}>
                    <Card.Body style={{overflow: 'auto'}}>
                    <Card.Title>Quá thời gian</Card.Title>
                        <ListGroup>
                            A
                        </ListGroup>
                    </Card.Body>
                </Card>
                <Card style={{height: "100%"}}>
                    <Card.Body>
                    <Card.Title>Hôm nay</Card.Title>
                        {this.state.taskList.map(task => {
                            return (
                                <TaskItem task={task} />
                            );
                        })}
                    </Card.Body>
                </Card>
                <Card style={{height: "100%"}}>
                    <Card.Body>
                    <Card.Title>Ngày mai</Card.Title>
                        C
                    </Card.Body>
                </Card>
                <Card style={{height: "100%"}}>
                    <Card.Body>
                    <Card.Title>Các task khác</Card.Title>
                        D
                    </Card.Body>
                </Card>
            </CardDeck>
        );
    }
}