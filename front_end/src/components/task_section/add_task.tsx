import React from "react";
import { Button } from "react-bootstrap";
import TaskModal from "./task_modal";

interface ButtonAddTaskState {
    showModal: boolean;
}

interface ButtonAddTaskProps {
    setLoadTaskUndone: () => void;
}

export default class ButtonAddTask extends React.Component<ButtonAddTaskProps, ButtonAddTaskState> {
    constructor(props: ButtonAddTaskProps) {
        super(props);
        this.state = {
            showModal: false,
        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal() {
        this.setState({showModal: true});
    }

    hideModal() {
        this.setState({showModal: false});
    }

    render(): React.ReactNode {
        return(
            <div>
                <Button variant="outline-success" size="sm" onClick={this.showModal}>Thêm Task</Button>
                <TaskModal 
                    modalType="add" 
                    show={this.state.showModal}
                    setLoadTaskUndone={this.props.setLoadTaskUndone}
                    hideModal={this.hideModal}
                />
            </div>
        );
    }
}