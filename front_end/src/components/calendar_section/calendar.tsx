import React from "react";
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import apiCaller from "../../utils/apiCaller";

const localizer = momentLocalizer(moment);

interface CalendarTask {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface CalendarComponentState {
    userEmail: any;
    taskList: CalendarTask[];
    doneLoadTask: boolean;
}

export default class CalendarComponent extends React.Component<any, CalendarComponentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            userEmail: Object.values(jwt_decode(localStorage.getItem('access_token') as string))[5],
            taskList: [],
            doneLoadTask: false,
        }

        this.loadTask = this.loadTask.bind(this);
    }

    async loadTask() {
        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/allkehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { data } = response;
                let taskReceived = data.kehoach;
                let taskList: CalendarTask[] = [];
                taskReceived.map((task: any) => {
                    return taskList.push({
                        title: task.tenkehoach,
                        start: new Date(task.thoigian),
                        end: new Date(task.thoigian),
                        allDay: true,
                    });
                })
                this.setState({taskList: taskList, doneLoadTask: true});
            }
        );
    }

    render(): React.ReactNode {
        if (!this.state.doneLoadTask) this.loadTask();

        let allView: View[] = [
            'month',
            // 'day',
        ];

        return (
            <div style={{height: "92%", width: "99%"}}>
                <Calendar
                    localizer={localizer}
                    events={this.state.taskList}
                    views={allView}
                />
            </div>
        );
    }
}