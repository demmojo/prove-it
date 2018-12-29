import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

const  infoModal = (props) => {

console.log("inside infoModal");

    return (
      <div className="animated fadeIn align-middle">
        <Row>
          <Col>
            <Modal isOpen={props.info} toggle={props.toggleInfo}
              className={'modal-info ' + props.className}>
              <ModalHeader toggle={props.toggleInfo}>Attention!</ModalHeader>
              <ModalBody>
                {props.message}
                  </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={ (e) => props.toggleInfo(e)}>Ok</Button>{' '}
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }

export default infoModal;
