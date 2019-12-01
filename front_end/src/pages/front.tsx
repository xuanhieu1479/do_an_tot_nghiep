import React from "react";
import { Redirect } from "react-router-dom";
import { Carousel, Fade } from "react-bootstrap";
import NavBar from "../components/navbar/navbar";
import apiCaller from "../utils/apiCaller";
import FirstSlide from "../images/First Slide.jpg";
import SecondSlide from "../images/Second Slide.jpg";
import ThirdSlide from "../images/Third Slide.jpg";
import "../css/frontPageStyle.css";

interface PageFrontState {
    firstSlideOpen: boolean;
    secondSlideOpen: boolean;
    thirdSlideOpen: boolean;
}

export default class PageFront extends React.Component<any, PageFrontState> {
    constructor(props: any) {
        super(props);
        this.state = {
            firstSlideOpen: true,
            secondSlideOpen: false,
            thirdSlideOpen: false,
        }
    }

    componentDidMount() {
        apiCaller(process.env.REACT_APP_DOMAIN + 'api/updatethongke', 'GET', null);
    }

    openNextSlideText(event: any) {
        if (this.state.firstSlideOpen) {
            if (event === 1) {
                this.setState({firstSlideOpen: false, secondSlideOpen: true});
            }
            if (event === 2) {
                this.setState({firstSlideOpen: false, thirdSlideOpen: true});
            }
        }

        if (this.state.secondSlideOpen) {
            if (event === 2) {
                this.setState({secondSlideOpen: false, thirdSlideOpen: true});
            }
            if (event === 0) {
                this.setState({secondSlideOpen: false, firstSlideOpen: true});
            }
        }

        if (this.state.thirdSlideOpen) {
            if (event === 0) {
                this.setState({thirdSlideOpen: false, firstSlideOpen: true});
            }
            if (event === 1) {
                this.setState({thirdSlideOpen: false, secondSlideOpen: true});
            }
        }
    }

    render(): React.ReactNode {
        if(localStorage.getItem('access_token')) return (<Redirect to="/home" />);
        
        return (
            <div style={{height: '100vh', backgroundImage: 'url(https://cdn.wallpapersafari.com/6/86/4UsAn9.jpg)'}}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Pacifico"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Amatic+SC"></link>
                <NavBar />
                <div className="Container">
                    <Carousel
                        indicators={false}
                        interval={10000}
                        className="Carousel"
                        onSelect={this.openNextSlideText.bind(this)}
                    >
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={FirstSlide}
                            alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={SecondSlide}
                            alt="Second slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={ThirdSlide}
                            alt="Third slide"
                            />
                        </Carousel.Item>
                    </Carousel>

                    <div className="Carousel-Text">
                        <Fade in={this.state.firstSlideOpen}>
                            <p hidden={!this.state.firstSlideOpen}>
                                Welcome to the bonfire, Unkindled One.<br></br>
                                I am a Fire Keeper.<br></br>
                                I tend to the flame, and tend to thee.<br></br>
                                The Lords have left their thrones, and must be deliver'd to them.<br></br>
                                To this end, I am at thy side.
                            </p>
                        </Fade>
                        <Fade in={this.state.secondSlideOpen}>
                            <p hidden={!this.state.secondSlideOpen}>
                                Ashen one, my thanks for the eyes thou'st given.<br></br>
                                But Fire Keepers are not meant to have eyes.<br></br>
                                It is forbidden.<br></br>
                                These will reveal, through a sliver of light, frightful images of betrayal.<br></br>
                                A world without fire. Ashen one, is this truly thy wish?
                            </p>
                        </Fade>
                        <Fade in={this.state.thirdSlideOpen}>
                            <p hidden={!this.state.thirdSlideOpen}>
                                The First Flame quickly fades.<br></br>
                                Darkness will shortly settle.<br></br>
                                But one day, tiny flames will dance across the darkness.<br></br>
                                Like embers, linked by lords past.<br></br>
                                <br></br>
                                "Ashen one, hearest thou my voice, still?""
                            </p>
                        </Fade>
                    </div>
                </div>
                <div style={{
                        clear: 'both',
                        marginTop: 50,
                        textAlign: 'center',
                        fontSize: 30,
                        fontFamily: '"Amatic SC", serif',
                }}>
                    Our Lord and Liege. I prithee play the usurper. When the moment cometh to link the fire, wrest it from its mantle. 
                    The Age of Fire was founded by the old gods, sustained by the linking of the fire.<br></br>
                    But the old gods are no more, and the all-powerful fire deserveth a new heir. 
                    Our Lord of Hollows, it shall be, who weareth the true face of mankind.
                </div>
            </div>
        );
    }
}