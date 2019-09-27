# useBasicFetch

> Very simple and basic but effective fetch hook

[![Edit use-basic-fetch](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/use-basic-fetch-4vrus)

## Installation

Install the package with npm

```sh
$ npm i -S use-basic-fetch
```

Or Yarn

```sh
$ yarn add use-basic-fetch
```

## Usage

```js
import { useBasicFetch } from 'use-basic-fetch';

type Joke = {
  value: {
    id: number;
    joke: string;
  };
};

const MyComponent: React.FC = () => {
  const { data, error, loading } = useBasicFetch<Joke>('http://api.icndb.com/jokes/random');

  if (error) {
    return <p>Error</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <h2>Chuck Norris Joke of the day</h2>
      {data && data.value && <p>{data.value.joke}</p>}
    </div>
  );
};
```
