import React, { useEffect, useState, useCallback } from "react";
import { MoralisContextValue, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { BigNumber } from "ethers";
import { ethers, ContractTransaction } from "ethers";
import {} from "@web3uikit/web3";
import { useNotification } from "@web3uikit/core";

type Props = {};
// write a function to enter the lottery

interface contractAddressesInterface {
  [key: string]: string[];
}

const LotteryEntrance = (props: Props) => {
  /* A hook that allows you to send notifications to the user. */
  const dispatch = useNotification();

  const {
    chainId: chainIdHex,
    isWeb3Enabled,
  }: { isWeb3Enabled: boolean; chainId: string | null } = useMoralis();
  const addresses: contractAddressesInterface = contractAddresses;
  const chainId: number = parseInt(chainIdHex!);
  const raffleAddress =
    chainId in contractAddresses ? addresses[chainId][0] : null;

  /* Using the useWeb3Contract hook to get the data, error, runContractFunction, isFetching, and
  isLoading from the useWeb3Contract hook. */
  /* useWeb3Contract can send functions and read state */
  const [raffleEntranceFee, setRaffleEntranceFee] = useState<string>("0");
  const [raffleNumberOfPlayers, setRaffleNumberOfPlayers] =
    useState<string>("0");
  const [raffleRecentWinner, setRaffleRecentWinner] = useState<string>("0");

  const {
    data,
    error,
    runContractFunction: enterLottery,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: raffleEntranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  });

  /**
   * It gets the entrance fee from the contract and sets it to the state.
   */
  const handleUpdateUI = useCallback(async () => {
    /* Getting the entrance fee from the contract and converting it to a string. */
    const entranceFee = ((await getEntranceFee()) as BigNumber).toString();
    /* Getting the number of players from the contract and converting it to a string. */
    const numOfPlayers = ((await getNumberOfPlayers()) as BigNumber).toString();
    /* Getting the recent winner from the contract and converting it to a string. */
    const recentWinner = ((await getRecentWinner()) as BigNumber).toString();

    setRaffleEntranceFee(entranceFee);
    setRaffleNumberOfPlayers(numOfPlayers);
    setRaffleRecentWinner(recentWinner);
    // console.log("getRecentWinner", recentWinner);
    // console.log("numOfPlayers", numOfPlayers);
    // console.log("entranceFee", entranceFee);
  }, [getEntranceFee, getNumberOfPlayers, getRecentWinner]);

  const handleNewNotification = useCallback(() => {
    dispatch({
      type: "info",
      message: "Transaction complete",
      title: "Tx Notification",
      //   icon: "bell",
      position: "topR",
    });
  }, [dispatch]);

  /* Waiting for the transaction to be mined and then calling the handleNewNotification and
    handleUpdateUI functions. */
  const handleSuccess = useCallback(
    async (tx: ContractTransaction) => {
      /* Waiting for the transaction to be mined. */

      await tx.wait(1);
      handleNewNotification();
      handleUpdateUI();
    },
    [handleNewNotification, handleUpdateUI]
  );

  const handleClick = async () => {
    /* Calling the enterLottery function from the contract, and if the transaction is successful, it
        calls the handleSuccess function */
    await enterLottery({
      /* Calling the handleSuccess function when the transaction is successfully sent to metamask. */
      onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
      onError: (error: Error) => console.log(error),
      //   onError: (error: Error) => console.log(`Error: ${error}`),
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      // read contract for raffle entrance fee
      handleUpdateUI();
    }
  }, [isWeb3Enabled, handleUpdateUI, raffleRecentWinner]);

  return (
    <div>
      {raffleAddress ? (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={handleClick}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <h3>Entrance Fee: {ethers.utils.formatUnits(raffleEntranceFee)}</h3>
          <h3>Number of players : {raffleNumberOfPlayers}</h3>
          <h3>Recent winner: {raffleRecentWinner}</h3>
        </>
      ) : (
        <h3>No address detected</h3>
      )}
    </div>
  );
};

export default LotteryEntrance;
