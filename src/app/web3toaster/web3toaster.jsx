"use client";

import { useEffect } from "react";
import Web3 from "web3";
import { toast } from "react-hot-toast";

const Web3Toaster = () => {
  useEffect(() => {
    const web3 = new Web3("https://rpc.ankr.com/eth_holesky");
    console.log(web3);
    const showInfo = async () => {
      try {
        const blockNumber = await web3.eth.getBlockNumber();
        const networkId = await web3.eth.net.getId();
        toast(`Block: ${blockNumber}, Network ID: ${networkId}`);
      } catch (error) {
        console.log("Web3 error:", error);
        toast.error("Web3 error");
      }
    };

    const interval = setInterval(showInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default Web3Toaster;
