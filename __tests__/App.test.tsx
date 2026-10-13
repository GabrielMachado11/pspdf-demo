/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@nutrient-sdk/react-native', () => {
  const ReactActual = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: ReactActual.forwardRef((props: object, _ref: unknown) =>
      ReactActual.createElement(View, props),
    ),
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
