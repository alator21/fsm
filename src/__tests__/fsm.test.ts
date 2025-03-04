import {describe, it} from 'bun:test';
import {createTransition, StateMachine} from "../fsm.ts";

describe('fsm', () => {

	it('simple', () => {
		type CoffeeState = 'idle' | 'brewing' | 'dispensing';
		type CoffeeEvent = 'insertCoin' | 'selectCoffee' | 'finish';

		type CoffeeParams = {
			insertCoin: { amount: number };
			selectCoffee: { type: string };
			finish: {};
		};

		type CoffeeResult = {
			insertCoin: { balance: number };
			selectCoffee: { brewTime: number };
			finish: { cupsServed: number };
		};


		function createCoffeeTransition<T extends CoffeeEvent>(
			fromState: CoffeeState,
			event: T,
			toState: CoffeeState,
			action: (args: CoffeeParams[T]) => CoffeeResult[T],
		) {
			return createTransition<CoffeeState, T, CoffeeParams, CoffeeResult, T>(
				fromState,
				event,
				toState,
				action,
			);
		}

		const coffeeTransitions = [
			createCoffeeTransition(
				'idle', 'insertCoin', 'idle',
				(args) => ({balance: args.amount})
			),
			createCoffeeTransition(
				'idle', 'selectCoffee', 'brewing',
				(args) => ({brewTime: args.type === 'espresso' ? 30 : 60})
			),
			createCoffeeTransition(
				'brewing', 'finish', 'dispensing',
				() => ({cupsServed: 1})
			),
			createCoffeeTransition(
				'dispensing', 'finish', 'idle',
				() => ({cupsServed: 0})
			),
		];

		const coffeeMachine = new StateMachine<CoffeeState, CoffeeEvent, CoffeeParams, CoffeeResult>('idle', coffeeTransitions);

		console.log(coffeeMachine.dispatch('insertCoin', {amount: 2}));
		console.log(coffeeMachine.dispatch('selectCoffee', {type: 'espresso'}));
		console.log(coffeeMachine.dispatch('finish', {}));
	})
})