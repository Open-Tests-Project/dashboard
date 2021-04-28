"use strict";

import { createMachine, interpret } from 'xstate';
import machine from 'client/pages/index/xstate/machine';

// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.
const stateMachine = createMachine(machine);

// Machine instance with internal state
// A running instance of a machine
const service = interpret(stateMachine);

// var toggleEvent = { type: 'FETCH'};
// service.send(toggleEvent)

// export service;

export default function (machineConfig) {

    machineConfig = machineConfig || {};

    return interpret(stateMachine.withConfig(machineConfig));
};
