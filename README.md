# fsm

A simple implementation of a finite-state machine using typescript


## Example

```typescript
import {StateMachine} from "./fsm";

type State = 'idle' | 'running' | 'paused';
type Event = 'start' | 'pause' | 'resume' | 'stop';

type EventParams = {
	start: { initialSpeed: number };
	pause: { reason: string };
	resume: { newSpeed: number };
	stop: { finalReport: boolean };
};

type EventResult = {
	start: { startTime: number; initialSpeed: number };
	pause: { elapsedTime: number; reason: string };
	resume: { resumeTime: number; newSpeed: number };
	stop: { totalTime: number; finalReport: string | null };
};

const transitions = [
	createTransition('idle', 'start', 'running', (args) => ({
		startTime: Date.now(),
		initialSpeed: args.initialSpeed
	})),
	createTransition('running', 'pause', 'paused', (args) => ({
		elapsedTime: Math.random() * 1000,
		reason: args.reason
	})),
	createTransition('paused', 'resume', 'running', (args) => ({
		resumeTime: Date.now(),
		newSpeed: args.newSpeed
	})),
	createTransition('running', 'stop', 'idle', (args) => ({
		totalTime: Math.random() * 5000,
		finalReport: args.finalReport ? "Final report generated" : null
	}))
];


const machine = new StateMachine<State, Event, EventParams, EventResult>('idle', transitions);


const startResult = machine.dispatch('start', {initialSpeed: 5});

const pauseResult = machine.dispatch('pause', {reason: "Low battery"});

const resumeResult = machine.dispatch('resume', {newSpeed: 7});

const stopResult = machine.dispatch('stop', {finalReport: true});

```
