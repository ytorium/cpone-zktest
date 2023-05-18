import { Field, SmartContract, State } from 'snarkyjs';
/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The CponeStart contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the CponeStart contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export declare class CponeStart extends SmartContract {
    num: State<Field>;
    init(): void;
    update(): void;
}
