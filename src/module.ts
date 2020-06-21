import { addUniqueNumber } from 'fast-unique-numbers';
import { IEncodeRequest, IEncodeResponse, IWorkerEvent } from 'json-midi-encoder-worker';
import { IMidiFile } from 'midi-json-parser-worker';

export const load = (url: string) => {
    const worker = new Worker(url);

    const ongoingRecordingRequests: Set<number> = new Set();

    const encode = (midiFile: IMidiFile): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const id = addUniqueNumber(ongoingRecordingRequests);

            const onMessage = ({ data }: IWorkerEvent) => {
                if (data.id === id) {
                    ongoingRecordingRequests.delete(id);

                    worker.removeEventListener('message', onMessage);

                    if (data.error === null) {
                        resolve((<IEncodeResponse>data).result.arrayBuffer);
                    } else {
                        reject(new Error(data.error.message));
                    }
                }
            };

            worker.addEventListener('message', onMessage);

            worker.postMessage(<IEncodeRequest>{ id, method: 'encode', params: { midiFile } });
        });
    };

    return {
        encode
    };
};
