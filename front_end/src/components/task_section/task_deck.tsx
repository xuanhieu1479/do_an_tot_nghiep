import React from "react";
import { Card, CardDeck } from "react-bootstrap";

export default class TaskDeck extends React.Component {
    render(): React.ReactNode {
        return (
            <CardDeck style={{height: "100%", width: "100%"}}>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Chưa hoàn thành</Card.Title>
                    A
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Hôm nay</Card.Title>
                    B
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Ngày mai</Card.Title>
                    C
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card style={{height: "90%"}}>
                    <Card.Body>
                    <Card.Title>Các task khác</Card.Title>
                    D
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
            </CardDeck>
        );
    }
}