import { createBroker } from 'broker-factory';
import { TJsonMidiEncoderWorkerDefinition } from 'json-midi-encoder-worker';
import { IJsonMidiEncoderBrokerDefinition } from './interfaces';
import { TJsonMidiEncoderBrokerLoader, TJsonMidiEncoderBrokerWrapper } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

export const wrap: TJsonMidiEncoderBrokerWrapper = createBroker<IJsonMidiEncoderBrokerDefinition, TJsonMidiEncoderWorkerDefinition>({
    encode: ({ call }) => {
        return (midiFile) => call('encode', { midiFile });
    }
});

export const load: TJsonMidiEncoderBrokerLoader = (url: string) => {
    const worker = new Worker(url);

    return wrap(worker);
};
