import React from "react";
import { Button } from "react-bootstrap";

interface ButtonAddTaskProps {
    showModal: () => void;
    isDisabled: boolean;
}

export default class ButtonAddTask extends React.Component<ButtonAddTaskProps, any> {

    onClickAddButton() {
        this.props.showModal();
    }

    render(): React.ReactNode {
        return(
            <Button
                variant="outline-success"
                size="sm"
                disabled={this.props.isDisabled}
                onClick={this.onClickAddButton.bind(this)}
            >
                Create more tasks
            </Button>
        );
    }
}