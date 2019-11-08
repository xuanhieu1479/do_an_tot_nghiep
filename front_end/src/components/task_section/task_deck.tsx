import React from "react";
import { Card, CardDeck, ListGroup  } from "react-bootstrap";
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
            <CardDeck style={{height: "100%", width: "100%"}}>
                <Card style={{height: "90%"}}>
                    <Card.Body style={{overflow: 'auto'}}>
                    <Card.Title>Chưa hoàn thành</Card.Title>
                        <ListGroup>
                            {this.state.taskList.map(task => {
                                return (
                                    <TaskItem task={task} />
                                );
                            })}
                        </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Hôm nay</Card.Title>
                    B
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Ngày mai</Card.Title>
                    C
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Các task khác</Card.Title>
                    D
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
            </CardDeck>
        );
    }
}