import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount } from 'enzyme';

import { useBasicFetch } from './index';

describe('useBasicFetch', () => {
  const TestComponent = () => {
    const { data, loading, error } = useBasicFetch();

    if (error) {
      return null;
    }
    if (loading || !data) {
      return <p>loading...</p>;
    }
    return <p>All ok!</p>;
  };

  it('should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TestComponent />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should load some data', async () => {
    const wrapper = mount(<TestComponent />);

    expect(wrapper.find(TestComponent).text()).toBe('loading...');
  });
});
