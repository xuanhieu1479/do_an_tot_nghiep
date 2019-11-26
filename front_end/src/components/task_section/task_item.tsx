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
    }

    showUpdateModal() {
        this.props.showModal(this.state.task.makehoach);
    }

    switchStatus(event: any) {
        event.stopPropagation();
        let task = {...this.state.task};
        task.dahoanthanh = !this.state.task.dahoanthanh;
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatekehoach?makehoach=' + this.props.task.makehoach, 'PUT', 
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

    formatDateTimeToTime(dateTime: string) {
        let time = dateTime.split(" ")[1];
        let hour = time.split(":")[0];
        let minute = time.split(":")[1];
        let subfix = 'A.M';
        if (Number(hour) > 12) {
            hour = (Number(hour) - 12).toString();
            subfix = 'P.M';
        } else if (Number(hour) < 10) {
            hour = hour.substr(1);
        }
        return hour + ":" + minute + " " + subfix;
    }

    render(): React.ReactNode {
        return (
            <ListGroup.Item                    
                action 
                variant={(this.state.task.dahoanthanh) ? "secondary" : undefined}
                onClick={this.showUpdateModal.bind(this)}
            >
                <div>
                    <div style={{display: 'inline', float: 'left'}}>
                        {this.props.task.tenkehoach}
                    </div>
                    <div style={{display: 'inline', float: 'right'}}>
                        {this.formatDateTimeToTime(this.props.task.thoigian)}
                    </div>
                </div>
                <div 
                    id={'Switch - ' + this.props.task.makehoach}
                    style={{clear: 'both', float: 'right'}} 
                    onClick={this.switchStatus.bind(this)}
                >
                    <Form.Check 
                        type="switch"
                        id={'Switch - ' + this.props.task.makehoach}
                        label=""
                        checked={!this.state.task.dahoanthanh}  
                        onChange={this.switchStatus.bind(this)}                      
                    />
                </div>
            </ListGroup.Item>
        );
    }
}
