import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { useBasicFetch } from './useBasicFetch';

jest.useFakeTimers();

const checkRenderedComponent = (target: any) => {
  if (!target) {
    throw new Error('Cannot render component');
  }

  return target as HTMLElement;
};

describe('useBasicFetch', () => {
  let container: HTMLElement | null;

  const TestComponent = ({ url = '', delay = 0 }) => {
    const { data, loading, error } = useBasicFetch(url, delay);

    if (error) {
      return <p>Some Error Message</p>;
    }
    if (loading) {
      return <p>loading...</p>;
    }

    return <div className="TestComponent">{data && <p>{data}</p>}</div>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
    }

    container = null;
  });

  it('should render without crashing', () => {
    act(() => {
      ReactDOM.render(<TestComponent />, container);
    });
  });

  it('should do nothing when an URL is not provided', () => {
    act(() => {
      ReactDOM.render(<TestComponent />, container);
    });

    const el = checkRenderedComponent(container);

    expect(el.textContent).toBe('');
  });

  it('should start fetching some data after the component is mounted', () => {
    const testUrl = 'fakeUrl';

    act(() => {
      ReactDOM.render(<TestComponent url={testUrl} delay={1} />, container);
    });

    const el = checkRenderedComponent(container);
    const content = el.querySelector('p') as HTMLElement;

    expect(content).toBeTruthy();
    expect(content.textContent).toBe('loading...');
  });

  it('should return an error when the http request fails', async () => {
    const testUrl = 'fakeUrl';

    //@ts-ignore
    global.fetch = jest.fn().mockImplementationOnce(() => {
      throw new Error('Something went wrong');
    });

    await act(async () => {
      await ReactDOM.render(<TestComponent url={testUrl} />, container);
    });

    const el = checkRenderedComponent(container);
    const content = el.querySelector('p') as HTMLElement;

    //@ts-ignore
    expect(global.fetch).toHaveBeenCalledWith(testUrl);

    expect(content).toBeTruthy();
    expect(content.textContent).toBe('Some Error Message');
  });

  it('should initialize an http request', async () => {
    const testUrl = 'fakeUrl';
    const expectedData = 'Allo!';

    //@ts-ignore
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        json: () => expectedData,
      })
    );

    await act(async () => {
      await ReactDOM.render(<TestComponent url={testUrl} />, container);
    });

    const el = checkRenderedComponent(container);
    const content = el.querySelector('p') as HTMLElement;

    //@ts-ignore
    expect(global.fetch).toHaveBeenCalledWith(testUrl);

    expect(content).toBeTruthy();
    expect(content.textContent).toBe(expectedData);
  });

  it('should delay the response when a "delay" is provided', async () => {
    const testUrl = 'fakeUrl';
    const testDelay = 1000;
    const expectedData = 'Allo!';

    //@ts-ignore
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        json: () => expectedData,
      })
    );

    await act(async () => {
      await ReactDOM.render(
        <TestComponent url={testUrl} delay={testDelay} />,
        container
      );
    });

    let el = checkRenderedComponent(container);
    let content = el.querySelector('p') as HTMLElement;

    //@ts-ignore
    expect(global.fetch).not.toHaveBeenCalled();
    expect(content).toBeTruthy();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    expect(content.textContent).toBe('loading...');

    await act(async () => {
      await jest.advanceTimersByTime(testDelay);
    });

    content = el.querySelector('p') as HTMLElement;

    //@ts-ignore
    expect(global.fetch).toHaveBeenCalledWith(testUrl);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(content.textContent).toBe(expectedData);
  });
});
