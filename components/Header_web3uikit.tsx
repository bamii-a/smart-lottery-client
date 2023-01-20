import React from "react";
import { ConnectButton } from "@web3uikit/web3";
import HeaderStyles from "../styles/Header.module.css";

type Props = {};

const Header_web3uikit = (props: Props) => {
  return (
    // <div className={HeaderStyles.nav}>
    <div className="w-90 flex justify-between items-center border-b-2 mb-12 ">
      <h1 className="text-2xl font-bold ">Decentralized Lottery</h1>
      <ConnectButton />
    </div>
  );
};

export default Header_web3uikit;
