import React from 'react';
import MainPage from './MainPage'

import { MyProvider } from './MyContext'

const App = () => {

  return (
    <MyProvider value={'mi'}>
      <MainPage />
    </MyProvider>
  );
};

export default App;
