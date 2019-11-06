import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import PageDangNhap from "./pages/dangnhap";
import PageHome from "./pages/home";

const AppRouter = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={NavBar} />
                <Route path="/dangnhap" component={PageDangNhap} />
                <Route path="/home" component={PageHome} />
            </Switch>
        </HashRouter>
    );
};

export { AppRouter };