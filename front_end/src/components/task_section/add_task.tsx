import React from "react";
import { Button } from "react-bootstrap";

interface ButtonAddTaskProps {
    showModal: () => void;
    setLoadTaskTypeUndone: () => void;
}

export default class ButtonAddTask extends React.Component<ButtonAddTaskProps, any> {

    onClickAddButton() {
        this.props.setLoadTaskTypeUndone();
        this.props.showModal();
    }

    render(): React.ReactNode {
        return(
            <Button variant="outline-success" size="sm" onClick={this.onClickAddButton.bind(this)}>Thêm Task</Button>
        );
    }
}