import { CponeStart } from './CponeStart';
import { isReady, shutdown, Field, Mina, PrivateKey, AccountUpdate, } from 'snarkyjs';
/*
 * This file specifies how to test the `CponeStart` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */
let proofsEnabled = false;
describe('CponeStart', () => {
    let deployerAccount, zkAppAddress, zkAppPrivateKey, zkApp;
    beforeAll(async () => {
        await isReady;
        if (proofsEnabled)
            CponeStart.compile();
    });
    beforeEach(() => {
        const Local = Mina.LocalBlockchain({ proofsEnabled });
        Mina.setActiveInstance(Local);
        deployerAccount = Local.testAccounts[0].privateKey;
        zkAppPrivateKey = PrivateKey.random();
        zkAppAddress = zkAppPrivateKey.toPublicKey();
        zkApp = new CponeStart(zkAppAddress);
    });
    afterAll(() => {
        // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
        // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
        // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
        setTimeout(shutdown, 0);
    });
    async function localDeploy() {
        const txn = await Mina.transaction(deployerAccount, () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            zkApp.deploy();
        });
        await txn.prove();
        // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
        await txn.sign([zkAppPrivateKey]).send();
    }
    it('generates and deploys the `CponeStart` smart contract', async () => {
        await localDeploy();
        const num = zkApp.num.get();
        expect(num).toEqual(Field(1));
    });
    it('correctly updates the num state on the `CponeStart` smart contract', async () => {
        await localDeploy();
        // update transaction
        const txn = await Mina.transaction(deployerAccount, () => {
            zkApp.update();
        });
        await txn.prove();
        await txn.send();
        const updatedNum = zkApp.num.get();
        expect(updatedNum).toEqual(Field(3));
    });
});
//# sourceMappingURL=CponeStart.test.js.map