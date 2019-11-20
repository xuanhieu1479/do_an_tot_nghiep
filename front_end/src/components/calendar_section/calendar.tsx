import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
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
    }

    async loadTask() {
        await apiCaller(process.env.REACT_APP_DOMAIN + 'api/allkehoach?email=' + this.state.userEmail, 'GET', null, localStorage.getItem('access_token')).then(
            response => {
                const { data } = response;
                let taskList: CalendarTask[] = [];
                data.kehoach.map((task: any) => {
                    return taskList.push({
                        title: task.tenkehoach,
                        start: new Date(task.thoigian),
                        end: new Date(task.thoigian),
                        allDay: false,
                    });
                })
                this.setState({taskList: taskList, doneLoadTask: true});
            }
        );
    }

    render(): React.ReactNode {
        if (!this.state.doneLoadTask) this.loadTask();

        return (
            <div style={{height: "92%", width: "99%"}}>
                <Calendar
                    localizer={localizer}
                    events={this.state.taskList}
                    views={['month', 'week', 'day']}
                />
            </div>
        );
    }
}