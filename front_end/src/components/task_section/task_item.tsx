import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import Task from "../../models/task";

interface TaskItemProps {
    task: Task;
}
interface TaskItemState {
    task: Task;
}

export default class TaskItem extends React.Component<TaskItemProps, TaskItemState> {
    constructor(props: TaskItemProps) {
        super(props);
        this.state = {
            task: this.props.task
        }

        this.switchStatus = this.switchStatus.bind(this);
    } 

    switchStatus() {
        let task = {...this.state.task};
        task.dahoanthanh = !this.state.task.dahoanthanh;
        this.setState({task: task});
    }

    render(): React.ReactNode {
        return (
            <div>
                <ListGroup.Item action variant={(this.state.task.dahoanthanh) ? "secondary" : undefined}>
                    <div>
                        <div style={{display: 'inline', float: 'left'}}>
                            {this.props.task.tenkehoach}
                        </div>
                        <div style={{display: 'inline', float: 'right'}}>
                            {this.props.task.thoigian}
                        </div>
                    </div>
                    <div style={{clear: 'both', float: 'right'}}>
                        <Form.Check 
                            type="switch"
                            id={this.props.task.makehoach}
                            label=""
                            checked={!this.state.task.dahoanthanh}
                            onClick={this.switchStatus}
                        />
                    </div>
                </ListGroup.Item>
            </div>
        );
    }
}
