import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { useBasicFetch } from '../.';

type Joke = {
  value: {
    id: number;
    joke: string;
  };
};

const ChuckNorrisJokes: React.FC = () => {
  const { data, fetchData, error, loading } = useBasicFetch<Joke>();
  const [jokeId, setJokeId] = useState(1);

  useEffect(() => {
    fetchData(`http://api.icndb.com/jokes/${jokeId}`, 500);
  }, [jokeId, fetchData]);

  const handleNext = () => setJokeId(jokeId + 1);

  if (error) {
    return <p>Error</p>;
  }

  const jokeData = data && data.value;

  return (
    <div className="Comments">
      {loading && <p>Loading...</p>}
      {!loading && jokeData && (
        <div>
          <p>Joke ID: {jokeData.id}</p>
          <p>{jokeData.joke}</p>
        </div>
      )}
      {!loading && jokeData && !jokeData.joke && <p>{jokeData}</p>}
      <button disabled={loading} onClick={handleNext}>
        Next Joke
      </button>
    </div>
  );
};

interface JokeCount {
  value: string;
}

const App: React.FC = () => {
  const { data, error, loading } = useBasicFetch<JokeCount>(
    'http://api.icndb.com/jokes/count'
  );

  if (error) {
    return <p>Error</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="App">
      <h2>Chuck Norris Jokes</h2>
      <p>There are {data.value} available jokes</p>

      <h4>Jokes</h4>
      <ChuckNorrisJokes />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
