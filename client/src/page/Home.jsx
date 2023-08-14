import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../context';
import { PageHOC, CustomInput, CustomButton } from '../components';


const Home = () => {
  const { contract, walletAddress, setShowAlert , setErrorMessage, gameData} = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const navigate =useNavigate();

  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName, { gasLimit: 500000 });

        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned!`,
        });

        setTimeout(() => navigate('/create-battle'), 8000);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) navigate('/create-battle');
    };

    if (contract) createPlayerToken();
  }, [contract])

  useEffect(() => {
    if(gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`)
    };

  }, [gameData]);


  return (
    walletAddress && (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}

      />

      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
    )
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game
  </>,
);