import React from "react";

export default class PageHome extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div>
                {localStorage.getItem('access_token')}
            </div>
        );
    }
}