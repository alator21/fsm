type Transition<S extends string, E extends string, P, R> = {
	from: S;
	event: E;
	to: S;
	action: (args: P) => R;
};

export class StateMachine<
	S extends string,
	E extends string,
	P extends Record<E, any>,
	R extends Record<E, any>,
> {
	private currentState: S;
	private transitions: Transition<S, E, P[E], R[E]>[];

	constructor(initialState: S, transitions: Transition<S, E, P[E], R[E]>[]) {
		this.currentState = initialState;
		this.transitions = transitions;
	}

	dispatch<T extends E>(event: T, args: P[T]): R[T] {
		const transition = this.transitions.find(
			(t) => t.from === this.currentState && t.event === event,
		) as Transition<S, T, P[T], R[T]> | undefined;

		if (!transition) {
			throw new Error(
				`No transition found for event ${event} in state ${this.currentState}`,
			);
		}

		this.currentState = transition.to;
		return transition.action(args);
	}

	getState(): S {
		return this.currentState;
	}
}

export function createTransition<
	S extends string,
	E extends string,
	P extends Record<E, any>,
	R extends Record<E, any>,
>(
	from: S,
	event: E,
	to: S,
	action: (args: P[E]) => R[E],
): Transition<S, E, P[E], R[E]> {
	return {from, event, to, action};
}
