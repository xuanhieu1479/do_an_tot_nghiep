import React from "react";
import { Button } from "react-bootstrap";
import TaskModal from "./task_modal";

interface ButtonAddTaskState {
    showModal: boolean;
}

export default class ButtonAddTask extends React.Component<any, ButtonAddTaskState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showModal: false,
        }

        this.showModal = this.showModal.bind(this);
    }

    async showModal() {
        await this.setState({showModal: true});
        this.setState(this.state);
    }

    render(): React.ReactNode {
        return(
            <div>
                <Button variant="outline-success" size="sm" onClick={this.showModal}>Thêm Task</Button>
                <TaskModal modalType="add" show={this.state.showModal} />
            </div>
        );
    }
}