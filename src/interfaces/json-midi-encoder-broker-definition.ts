import { IBrokerDefinition } from 'broker-factory';
import { IMidiFile } from 'midi-json-parser-worker';

export interface IJsonMidiEncoderBrokerDefinition extends IBrokerDefinition {
    encode(midiFile: IMidiFile): Promise<ArrayBuffer>;
}
