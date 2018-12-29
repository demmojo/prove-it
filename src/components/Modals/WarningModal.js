import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

const  warningModal = (props) => {

console.log("inside infoModal");

    return (
      <div className="animated fadeIn align-middle">
        <Row>
          <Col>
            <Modal isOpen={props.warning} toggle={props.toggleWarning}
              className={'modal-warning '+ props.className}>
              <ModalHeader toggle={props.toggleWarning}>Attention!</ModalHeader>
              <ModalBody>
                {props.message}
                  </ModalBody>
              <ModalFooter>
                <Button color="warning" onClick={ (e) => props.toggleWarning(e)}>Ok</Button>{' '}
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }

export default warningModal;
