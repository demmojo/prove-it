import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';

const UploadForm = (props) => {

  return (
    <div className="animated fadeIn flex-row align-items-center">
      <Card >
        <CardHeader>
          <strong>Upload</strong> Form
              </CardHeader>
        <CardBody>
          <Form id="document-uplaod-form" action="" method="post" encType="multipart/form-data" className="form-horizontal">
            <FormGroup row>
              <Col md="3">
                {/* <Label>Type</Label> */}
              </Col>
              <Col xs="12" md="9">
                <p className="form-control-static"><strong>Enter the detail in below section.</strong></p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="exampleInputName2" > User Name</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="exampleInputName2" maxLength="32" placeholder="James Bond" name="name" onChange={(event) => props.handleChange(event)} required />
                <FormText className="help-block">Please enter your name (max length is 64 chars)</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="exampleInputName3" >File Tags</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" id="exampleInputName3" maxLength="32" placeholder="Photo, Spain, Secret Facility" name="docTags" onChange={(event) => props.handleChange(event)} required />
                <FormText className="help-block">Please enter document tags (max length is 64 chars)</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="fileInput">File</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="file" id="document" name="fileName" onChange={(e) => props.handleImageChange(e)} />
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter>
          <Button type="submit" size="sm" color="primary" onClick={props.handleSubmit}><i className="fa fa-dot-circle-o"></i> Upload</Button>&nbsp; &nbsp;
            <Button type="reset" size="sm" color="danger" onClick={props.handleReset}><i className="fa fa-ban"></i> Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UploadForm;
