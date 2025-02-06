import { IDefaultBrokerDefinition } from 'broker-factory';
import { IJsonMidiEncoderBrokerDefinition } from '../interfaces';

export type TJsonMidiEncoderBrokerWrapper = (sender: MessagePort | Worker) => IJsonMidiEncoderBrokerDefinition & IDefaultBrokerDefinition;
