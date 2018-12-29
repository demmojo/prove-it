import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppHeaderDropdown } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  render() {

    let $address = null;
    if (this.props.address) {
      $address = (
        <p> You are logged in as : {this.props.address}</p>
      )
    }

    return (
      <React.Fragment>
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Main</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="files">Files</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="upload">Upload File</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="verify">Verify File</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            {$address}
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
