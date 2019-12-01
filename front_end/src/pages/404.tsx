import React from "react";
import "../css/404.css"

export default class Page404 extends React.Component {
	render(): React.ReactNode {
		return (
			<div id="notfound">
				<link href="https://fonts.googleapis.com/css?family=Montserrat:500" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css?family=Titillium+Web:700,900" rel="stylesheet" />

				<div className="notfound">
					<div className="notfound-404">
						<h1>404</h1>
					</div>
					<h2>Oops! This Page Could Not Be Found</h2>
					<p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
					<a href="./">Go To Homepage</a>
				</div>
			</div>
		);
	}
}
