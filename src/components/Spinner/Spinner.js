import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import './spinner.css';

const spinner = (props) => {

    return (
        <Container>
            <Row className="row align-items-center">
                <Col className="col align-self-center">
                    <span className="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        {/* <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Loading..." style={style}/> */}
                    </span>
                </Col>
            </Row>
        </Container>
    );
}

export default spinner;