import React from 'react';
import ReactDOM from 'react-dom';
import Carousels from './Carousel';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Carousels />, div);
  ReactDOM.unmountComponentAtNode(div);
});
