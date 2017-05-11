import { IEncodeRequest, IEncodeResponse, IWorkerEvent } from 'json-midi-encoder-worker';
import { IMidiFile } from 'midi-json-parser-worker';

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

const generateUniqueId = (set: Set<number>) => {
    let id = Math.round(Math.random() * MAX_SAFE_INTEGER);

    while (set.has(id)) {
        id = Math.round(Math.random() * MAX_SAFE_INTEGER);
    }

    return id;
};

export const load = (url: string): { encode: (midiFile: IMidiFile) => Promise<ArrayBuffer> } => {
    const worker = new Worker(url);

    const ongoingRecordingRequests: Set<number> = new Set();

    const encode = (midiFile: IMidiFile): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const id = generateUniqueId(ongoingRecordingRequests);

            ongoingRecordingRequests.add(id);

            const onMessage = ({ data }: IWorkerEvent) => {
                if (data.id === id) {
                    ongoingRecordingRequests.delete(id);

                    worker.removeEventListener('message', onMessage);

                    if (data.error === null) {
                        resolve((<IEncodeResponse> data).result.arrayBuffer);
                    } else {
                        reject(new Error(data.error.message));
                    }
                }
            };

            worker.addEventListener('message', onMessage);

            worker.postMessage(<IEncodeRequest> { id, method: 'encode', params: { midiFile } });
        });
    };

    return {
        encode
    };
};
