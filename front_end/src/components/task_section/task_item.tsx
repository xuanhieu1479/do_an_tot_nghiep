import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import Task from "../../models/task";

interface TaskItemProps {
    task: Task;
    showModal: (makehoach: string) => void;
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
        this.showUpdateModal = this.showUpdateModal.bind(this);
    } 

    switchStatus() {
        let task = {...this.state.task};
        task.dahoanthanh = !this.state.task.dahoanthanh;
        this.setState({task: task});
    }

    showUpdateModal() {
        this.props.showModal(this.state.task.makehoach);
    }

    render(): React.ReactNode {
        return (
            <div>
                <ListGroup.Item 
                    action 
                    variant={(this.state.task.dahoanthanh) ? "secondary" : undefined}
                    onClick={this.showUpdateModal}
                >
                    <div>
                        <div style={{display: 'inline', float: 'left'}}>
                            {this.props.task.tenkehoach}
                        </div>
                        <div style={{display: 'inline', float: 'right'}}>
                            {(this.props.task.thoigian).split(" ")[1]}
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
