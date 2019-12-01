import React from 'react';
import Sidebar from "react-sidebar";
import { ListGroup } from "react-bootstrap";

const mql = window.matchMedia(`(min-width: 800px)`);

interface SideBarProps {
    mainContent: any;
    activeTab: string;
}

export default class SideBar extends React.Component<SideBarProps, any> {
    constructor(props: SideBarProps) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false
        };

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    UNSAFE_componentWillMount() {
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
                'marginTop': '56px',
            }
        }

        return (            
            <Sidebar
                sidebar= {
                    <ListGroup defaultActiveKey={this.props.activeTab}>
                        <ListGroup.Item action href="#home">Task</ListGroup.Item>
                        <ListGroup.Item action href="#calendar">Calendar</ListGroup.Item>
                    </ListGroup>
                }
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen.bind(this)}
                styles={sideBarCustomStyle}
            >
                <b>{this.props.mainContent}</b>
            </Sidebar>
        );
    }
}