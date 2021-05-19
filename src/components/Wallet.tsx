import React, { useState } from 'react';
import Web3 from 'web3';

declare global {
  interface Window { 
      ethereum: any;
      web3: any;
  }
}

const Wallet: React.FC = () => {
  const [heading, setHeading] = useState("");
  // const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({ account: "", balance: 0})
  const askPermission = async () => {
    if(typeof window.ethereum !== 'undefined') {
      let web3 = new Web3(window.ethereum);
      try {
        // Request account access
        // await window.ethereum.enable();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setHeading("Requesting Account Permission")
        let accounts = await web3.eth.getAccounts();
        setHeading("MetaMask Connected");
        let balance = await web3.eth.getBalance(accounts[0]);
        console.log(accounts[0] ,balance)
        setAccount({
          account: accounts[0],
          balance: +web3.utils.fromWei(balance)
        })
      } catch(e) {
        // User denied access
        setHeading("MetaMask Denied Permission, Please Refresh and Try Again");
        console.log(e);
      }
    } else {
      setHeading("MetaMask Not Detected");
      console.log('No web3? You should consider trying MetaMask!');
    }
  }
  return (
    <div>
      <h1>{heading}</h1>
      <button onClick={askPermission}>Connect to MetaMask</button>
      <div>
        <p>Account: {account.account}</p>
        <p>Balance: {account.balance} ETH</p>
      </div>
    </div>
  );
}

export default Wallet;