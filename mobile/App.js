import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';

import Routes from './src/routes';

export default function App() {

  useEffect(() => {
      Linking.addEventListener('/', result => {
          console.log("Ahoy");
      });
  });

  return (
      <Routes />
  );
}