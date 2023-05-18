import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import type { CponeStart } from '../contracts/src/';
import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
} from 'snarkyjs';

export default function Home() {
  useEffect(() => {
    (async () => {
      await isReady;
      const { CponeStart } = await import('../contracts/build/src/');

      // Update this to use the address (public key) for your zkApp account
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to 
      // Berkeley Testnet B62qr4PN1fhwxJe6vU3xAUJXhGJMMCQDV8Z9ynpmUad4ehy7QhhyrX9
      const zkAppAddress = 'B62qr4PN1fhwxJe6vU3xAUJXhGJMMCQDV8Z9ynpmUad4ehy7QhhyrX9';
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account'
        );
      }

      const zkAppInstance = new CponeStart(PublicKey.fromBase58(zkAppAddress));
      
    })();
  }, []);

}

