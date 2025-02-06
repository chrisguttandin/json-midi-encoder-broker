import { IDefaultBrokerDefinition } from 'broker-factory';
import { IJsonMidiEncoderBrokerDefinition } from '../interfaces';

export type TJsonMidiEncoderBrokerLoader = (url: string) => IJsonMidiEncoderBrokerDefinition & IDefaultBrokerDefinition;
