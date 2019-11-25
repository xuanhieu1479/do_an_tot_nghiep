import React from "react";
import { Button, Modal } from "react-bootstrap";
import ButtonLogOut from "../components/navbar/dangxuat";
import apiCaller from "../utils/apiCaller";

interface PageAdminState {
    pageView: number;
    show: boolean;
}

export default class PageAdmin extends React.Component<any, PageAdminState> {
    constructor(props: any) {
        super(props);
        this.state = {
            pageView: 0,
            show: false,
        }
    }

    componentDidMount() {
        this.loadPageViews();
    }

    hideModal() {
        this.setState({show: false});
        this.props.history.push("./home")
    }

    loadPageViews() {
        try {
            apiCaller(process.env.REACT_APP_DOMAIN + 'api/pageviews', 'GET', null, localStorage.getItem('access_token')).then(
                response => {
                    const { statusCode, data } = response;
                    if (statusCode === 403) {
                        this.setState({show: true});
                    } else {
                        this.setState({pageView: data.count});
                    }                
                }
            );
        } catch(e) {
            console.log('Alabama');
        }
    }

    refresh() {
        this.loadPageViews();
    }

    render(): React.ReactNode {
        return (
            <div>
                Lượt truy cập = {this.state.pageView}
                <div>
                    <Button variant="success" onClick={this.refresh.bind(this)}>Refresh</Button>
                    <ButtonLogOut isHidden={false} />
                </div>

                <Modal show={this.state.show} onHide={this.hideModal.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Bạn không có quyền Admin</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                    <Button variant="primary" onClick={this.hideModal.bind(this)}>Biến</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}