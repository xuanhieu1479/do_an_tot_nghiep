import React from "react";
import NavBar from "../components/navbar/navbar";
import { Redirect } from "react-router-dom";
import apiCaller from "../utils/apiCaller";

export default class PageFront extends React.Component {
    componentDidMount() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatethongke', 'GET', null);
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token')) return (<Redirect to="/home" />);
        return (
            <div>
                <NavBar />
            </div>
        );
    }
}