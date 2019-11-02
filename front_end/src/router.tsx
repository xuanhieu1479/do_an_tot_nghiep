import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import PageDangNhap from "./pages/dangnhap";

const AppRouter = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={NavBar} />
                <Route path="/dangnhap" component={PageDangNhap} />
            </Switch>
        </HashRouter>
    );
};

export { AppRouter };