export type Transition<S extends string, E extends string, P, R> = {
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
	private transitions: {
		[K in E]: Transition<S, K, P[K], R[K]>;
	}[E][]; // Ensures event-specific typing

	constructor(
		initialState: S,
		transitions: { [K in E]: Transition<S, K, P[K], R[K]> }[E][]
	) {
		this.currentState = initialState;
		this.transitions = transitions;
	}

	dispatch<T extends E>(event: T, args: P[T]): R[T] {
		const transition = this.transitions.find(
			(t) => t.from === this.currentState && t.event === event
		) as Transition<S, T, P[T], R[T]> | undefined;

		if (!transition) {
			throw new Error(
				`No transition found for event ${event} in state ${this.currentState}`
			);
		}

		this.currentState = transition.to;
		return transition.action(args);
	}

	can(event: E): boolean {
		return this.transitions.find(
			(t) => t.from === this.currentState && t.event === event
		) !== undefined;
	}

	isFinal(): boolean {
		return this.transitions.every((t) => (t.from !== this.currentState));
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
	T extends E // Ensure strict event type inference
>(
	from: S,
	event: T,
	to: S,
	action: (args: P[T]) => R[T]
): Transition<S, T, P[T], R[T]> {
	return {from, event, to, action};
}
