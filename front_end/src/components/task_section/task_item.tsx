import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import Task from "../../models/task";
import apiCaller from "../../utils/apiCaller";

interface TaskItemProps {
    key: string;
    task: Task;
    showModal: (makehoach: string) => void;
    deleteThisItem: (makehoach: string) => void;
}
interface TaskItemState {
    task: Task;
}

export default class TaskItem extends React.Component<TaskItemProps, TaskItemState> {
    constructor(props: TaskItemProps) {
        super(props);
        this.state = {
            task: this.props.task,
        }

        this.showUpdateModal = this.showUpdateModal.bind(this);
        this.switchStatus = this.switchStatus.bind(this);
    }

    showUpdateModal() {
        this.props.showModal(this.state.task.makehoach);
    }

    async switchStatus(event: any) {
        event.stopPropagation();
        let task = {...this.state.task};
        task.dahoanthanh = !this.state.task.dahoanthanh;
        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatekehoach?makehoach=' + this.props.task.makehoach, 'PUT', 
            {dahoanthanh: task.dahoanthanh}, localStorage.getItem('access_token')).then(
                response => {
                    const { data } = response;
                    if (data.daxoa) {
                        this.props.deleteThisItem(this.state.task.makehoach);
                    } else {
                        this.setState({task: task});
                    }                    
                }
            );        
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
                    <div 
                        id={'Switch - ' + this.props.task.makehoach}
                        style={{clear: 'both', float: 'right'}} 
                        onClick={this.switchStatus}
                    >
                    <Form.Check 
                        type="switch"
                        id={'Switch - ' + this.props.task.makehoach}
                        label=""
                        checked={!this.state.task.dahoanthanh}  
                        onChange={this.switchStatus}                      
                    />
                    </div>
                </ListGroup.Item>
            </div>
        );
    }
}
