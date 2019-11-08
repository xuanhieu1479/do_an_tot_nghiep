import React from 'react';
import Sidebar from "react-sidebar";
import { ListGroup } from "react-bootstrap";

const mql = window.matchMedia(`(min-width: 800px)`);

interface SideBarProps {
    mainContent: any;
    activeTab: string;
    transitions: boolean;
}

export default class SideBar extends React.Component<SideBarProps, any> {
    constructor(props: SideBarProps) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false
        };

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    static defaultProps = {
        transitions: true,
    }

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
    }

    componentWillUnmount() {
        mql.removeListener(this.mediaQueryChanged);
    }

    onSetSidebarOpen(open: boolean) {
        this.setState({ sidebarOpen: open });
    }

    mediaQueryChanged() {
        this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
    }

    render(): React.ReactNode {
        const sideBarCustomStyle = {
            root: {
                'margin-top': '56px',
            },
            content: {
                'margin-top': '40px',
                'margin-left': '40px',
            }
        }

        return (            
            <Sidebar
                sidebar= {
                    <ListGroup defaultActiveKey={this.props.activeTab}>
                        <ListGroup.Item action href="#home">
                            Task
                        </ListGroup.Item>
                        <ListGroup.Item action href="#calendar">
                            Lịch
                        </ListGroup.Item>
                        <ListGroup.Item action href="#schedule">
                            Thời gian biểu
                        </ListGroup.Item>
                    </ListGroup>
                }
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen}
                transitions={this.props.transitions}
                styles={sideBarCustomStyle}
            >
                <b>{this.props.mainContent}</b>
            </Sidebar>
        );
    }
}