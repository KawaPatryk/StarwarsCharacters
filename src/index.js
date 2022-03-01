import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

import axios from 'axios';
import * as r from 'ramda';

import './style.css';

// NOTE I think that download data through page endpoint and making pagination would be much cleaner solution but in the task description it was implied that i should use singe character endpoint.
const Dashboard = () => {
  const [charactersData, setCharactersData] = useState([]);
  const [ammountOfCharacters, setAmmountOfCharacters] = useState(0);
  const [currentCharacterData, setCurrentCharacterData] = useState(0);

  useEffect(() => {
    axios.get('https://swapi.dev/api/people/').then((response) => {
      //I'm adding 1 because indexes starts from 1 insted of 0
      setCharactersData(
        response.data.results.map((character, index) => {
          return { ...character, id: index + 1 };
        })
      );
      setAmmountOfCharacters(response.data.count + 1);
      setCurrentCharacterData({ ...response.data.results[0], id: 1 });
    });
  }, []);

  const handleCharacterChange = async (id, operation) => {
    const setSingleCharacter = async (newCharacter, idToSet) => {
      newCharacter.id = idToSet;
      setCurrentCharacterData(newCharacter);
      setCharactersData((prevState) => {
        const newState = r.clone(prevState);
        newState.push(newCharacter);
        return newState;
      });
    };

    try {
      const newCharacter = (
        await axios.get(`https://swapi.dev/api/people/${id}`)
      ).data;
      setSingleCharacter(newCharacter, id);
    } catch (err) {
      const valueToAdd = operation === 'next' ? 1 : -1;
      const newCharacter = (
        await axios.get(`https://swapi.dev/api/people/${id + valueToAdd}`)
      ).data;
      setSingleCharacter(newCharacter, id + valueToAdd);
    }
  };

  const handleClick = (action) => {
    if (action === 'next') {
      const cachedCharacter = charactersData.find(
        (character) => character.id === currentCharacterData.id + 1
      );
      if (cachedCharacter) setCurrentCharacterData(cachedCharacter);
      else handleCharacterChange(currentCharacterData.id + 1, 'next');
    }
    if (action === 'previous') {
      const cachedCharacter = charactersData.find(
        (character) => character.id === currentCharacterData.id - 1
      );
      if (cachedCharacter) setCurrentCharacterData(cachedCharacter);
      else handleCharacterChange(currentCharacterData.id - 1, 'prev');
    }
  };

  return (
    <div className="viewPort">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Starwars Characters
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentCharacterData.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Height</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentCharacterData.height}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Mass</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentCharacterData.mass}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentCharacterData.gender}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hair color</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentCharacterData.hair_color}
              </dd>
            </div>
            <div
              className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              style={{ display: 'flex', columnGap: '30px' }}
            >
              <button
                onClick={() => handleClick('previous')}
                disabled={currentCharacterData.id === 1}
                className="navigationButtons grey"
              >
                Previous
              </button>
              <button
                onClick={() => handleClick('next')}
                disabled={currentCharacterData.id === ammountOfCharacters}
                className="navigationButtons white"
              >
                Next
              </button>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const App = () => <Dashboard />;

render(<App />, document.getElementById('root'));

/*

# SW APP

## About

Build a simple app that allows users to browse the Star Wars characters.
Please use provided endpoint https://swapi.dev/api/people/1.
To get information about certain characters replace 1 with another number,

https://swapi.dev/api/people/1
https://swapi.dev/api/people/2
https://swapi.dev/api/people/3

etc

## Functionlities

- as a user, I would like to click on the 'next button to see info related to the next character
- as a user, I would like to click on the 'prev' button to see info related to the previous character
- as a user, I would like to see selected info related to characters (name, height, mass, gender, hair_color )

*/
