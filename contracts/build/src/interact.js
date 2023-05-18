/**
 * This script can be used to interact with the CponeStart contract, after deploying it.
 *
 * We call the update() method on the contract, create a proof and send it to the chain.
 * The endpoint that we interact with is read from your config.json.
 *
 * This simulates a user interacting with the zkApp from a browser, except that here, sending the transaction happens
 * from the script and we're using your pre-funded zkApp account to pay the transaction fee. In a real web app, the user's wallet
 * would send the transaction and pay the fee.
 *
 * To run locally:
 * Build the project: `$ npm run build`
 * Run with node:     `$ node build/src/interact.js <network>`.
 */
import { Mina, PrivateKey, shutdown } from 'snarkyjs';
import fs from 'fs/promises';
import { CponeStart } from './CponeStart.js';
// check command line arg
let network = process.argv[2];
if (!network)
    throw Error(`Missing <network> argument.

Usage:
node build/src/interact.js <network>

Example:
node build/src/interact.js berkeley
`);
Error.stackTraceLimit = 1000;
let configJson = JSON.parse(await fs.readFile('config.json', 'utf8'));
let config = configJson.networks[network];
let key = JSON.parse(await fs.readFile(config.keyPath, 'utf8'));
let zkAppKey = PrivateKey.fromBase58(key.privateKey);
// set up Mina instance and contract we interact with
const Network = Mina.Network(config.url);
Mina.setActiveInstance(Network);
let zkAppAddress = zkAppKey.toPublicKey();
let zkApp = new CponeStart(zkAppAddress);
// compile the contract to create prover keys
console.log('compile the contract...');
await CponeStart.compile();
// call update() and send transaction
console.log('build transaction and create proof...');
let tx = await Mina.transaction({ feePayerKey: zkAppKey, fee: 0.1e9 }, () => {
    zkApp.update();
});
await tx.prove();
console.log('send transaction...');
let sentTx = await tx.send();
if (sentTx.hash() !== undefined) {
    console.log(`
Success! Update transaction sent.

Your smart contract state will be updated
as soon as the transaction is included in a block:
https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
`);
}
shutdown();
//# sourceMappingURL=interact.js.map