import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/navbar";

const AppRouter = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={NavBar} />
            </Switch>
        </HashRouter>
    );
};

export { AppRouter };