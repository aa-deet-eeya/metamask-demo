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
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState({ account: "", balance: 0})
  const askPermission = async () => {
    setLoading(true);
    if(typeof window.ethereum !== 'undefined') {
      let web3 = new Web3(window.ethereum);
      try {
        // Request account access
        // await window.ethereum.enable();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setHeading("Requesting Account Permission")
        let accounts = await web3.eth.getAccounts();
        setHeading("MetaMask Connected 😎");
        let balance = await web3.eth.getBalance(accounts[0]);
        console.log(accounts[0] ,balance)
        setAccount({
          account: accounts[0],
          balance: +web3.utils.fromWei(balance)
        })
        setLoading(false);
        setConnected(true);
      } catch(e) {
        // User denied access
        setHeading("MetaMask Denied Permission, Please Refresh and Try Again 🥺");
        console.log(e);
        setLoading(false);
      }
    } else {
      setHeading("MetaMask Not Detected 😞");
      console.log('No web3? You should consider trying MetaMask!');
      setLoading(false);
    }
  }
  return (
    <div className="wallet-wrapper">
      {!loading && <h1>{heading}</h1>}
      { loading
      ? <div className="loading-spinner"><div></div></div>
      : !connected && <div className="wallet-btn" onClick={askPermission}>Connect to MetaMask</div>}
      { account.account && <div className="wallet-details">
        <div className="account-wrap">
          <label>Account: </label>
          <p className="account">{account.account}</p>
        </div>
        <div className="balance-wrap">
          <label>Balance:</label>
          <p>{account.balance} ETH</p>
        </div>
      </div> }
    </div>
  );
}

export default Wallet;