import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import headerStyle from "../styles/Header.module.css";

type Props = {};

const Header = (props: Props) => {
  /* connecting the metamask wallet. */
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    /* This is checking if the web3 is enabled. If it is not enabled, it will check if the window is not
   undefined. If the window is not undefined, it will check if the local storage has the item
   "connected". If it does, it will enable web3. */
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) enableWeb3();
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    /* Checking if the account has changed. If it has changed, it will check if the account is
     null. If it is null, it will remove the item "connected" from the local storage and deactivate
     web3. */
    Moralis.onAccountChanged((account) => {
      console.log(`account changed to ${account}`);
      if (account === null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3]);

  const handleClick = async () => {
    /**
     * It checks if the user has a web3 provider, if not, it prompts the user to install one
     */
    await enableWeb3();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("connected", "injected");
    }
  };

  return (
    <div>
      <button
        className={headerStyle.button}
        disabled={isWeb3EnableLoading}
        onClick={() => handleClick()}
      >
        {account
          ? `connected: ${account.slice(0, 6)}...
          ${account.slice(account.length - 4)}`
          : `Connect`}
      </button>
    </div>
  );
};

export default Header;
