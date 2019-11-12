import React from "react";
import { Button } from "react-bootstrap";

interface ButtonAddTaskProps {
    showModal: () => void;
}

export default class ButtonAddTask extends React.Component<ButtonAddTaskProps, any> {

    render(): React.ReactNode {
        return(
            <div>
                <Button variant="outline-success" size="sm" onClick={this.props.showModal}>Thêm Task</Button>
            </div>
        );
    }
}