import React, { useEffect, useState, useContext, createContext } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants.js";

export const TransactionContext = createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  console.log({
    // provider,
    // signer,
    transactionsContract,
  });
  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [cardData, setCardData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const handleChange = (e, name) => {
    setCardData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
      console.log(`account id: ${accounts[0]}`);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const { addressTo, amount, keyword, message } = cardData;
      const transactionContract = createEthereumContract();
      const parsedAmount = ethers.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //21000 gwei
            value: parsedAmount.toString(16),
          },
        ],
      });
      const transactionHash = await transactionContract.addtoBlockchain(
        addressTo,
        parsedAmount,
        keyword,
        message
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        cardData,
        setCardData,
        handleChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
