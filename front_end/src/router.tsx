import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Switch } from "react-router-dom";
import PageFront from "./pages/front"; 
import PageDangNhap from "./pages/dangnhap";
import PageDangKy from "./pages/dangky";
import PageHome from "./pages/home";
import PageCalendar from "./pages/calendar";
import PageProfile from "./pages/profile";
import PageAdmin from "./pages/admin";
import PageFeedback from "./pages/feedback";

const AppRouter = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={PageFront} />
                <Route path="/dangnhap" component={PageDangNhap} />
                <Route path="/dangky" component={PageDangKy} />
                <Route path="/home" component={PageHome} />
                <Route path="/calendar" component={PageCalendar} />
                <Route path="/profile" component={PageProfile} />
                <Route path="/admin" component={PageAdmin} />
                <Route path="/feedback" component={PageFeedback} />
            </Switch>
        </HashRouter>
    );
};

export { AppRouter };