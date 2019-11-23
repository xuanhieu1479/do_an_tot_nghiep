import React from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import avatar from "../../images/avatar.jpg";

interface UserAvatarProps {
    isHidden: boolean;
}

export default class UserAvatar extends React.Component<UserAvatarProps, any> {

    render(): React.ReactNode {
        return (
            <Link to="./profile">
                <Image
                    style={{width: 30, height: 30}}
                    src={avatar}
                    roundedCircle
                    hidden={this.props.isHidden}
                />
            </Link>
        );
    }
}