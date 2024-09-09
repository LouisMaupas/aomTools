import React from 'react';
import useStore from '../../store/store';

const Home = () => {
  const { userInfos } = useStore();

  return (
    <div>
      <h1>Bienvenue sur l'application !</h1>
      {userInfos.civilization && userInfos.majorGod ? (
        <div>
          <p>Votre civilisation favorite : {userInfos.civilization}</p>
          <p>Votre dieu majeur favori : {userInfos.majorGod}</p>
        </div>
      ) : (
        <p>Vous n'avez pas encore sélectionné de civilisation et de dieu majeur.</p>
      )}
    </div>
  );
};

export default Home;
