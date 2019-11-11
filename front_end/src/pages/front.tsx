import React from "react";
import NavBar from "../components/navbar/navbar";
import { Redirect } from "react-router-dom";

export default class PageFront extends React.Component {
    render(): React.ReactNode {
        if(localStorage.getItem('access_token')) return (<Redirect to="/home" />);
        return (
            <div>
                <NavBar />
            </div>
        );
    }
}