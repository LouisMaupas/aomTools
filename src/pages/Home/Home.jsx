import useStore from '../../store/store';
import {Button} from "antd"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userInfos } = useStore();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bienvenue sur l'application !</h1>
      <div>
              {userInfos.civilization && userInfos.majorGod ? (
        <div>
          <p>Votre civilisation favorite : {userInfos.civilization}</p>
          <p>Votre dieu majeur favori : {userInfos.majorGod}</p>
        </div>
      ) : (
        <p>Vous n'avez pas encore sélectionné de civilisation et de dieu majeur.</p>
      )}
      </div>
      <div>
        <Button onClick={()=> navigate("/counter-tool")} >Counters</Button>
      </div>
    </div>
  );
};

export default Home;
