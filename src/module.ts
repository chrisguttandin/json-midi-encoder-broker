export const load = (url: string) => {
    const worker = new Worker(url);

    const encode = (json): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const onMessage = ({ data }: any = {}) => {
                worker.removeEventListener('message', onMessage);

                if ('midiFile' in data) {
                    resolve(data.midiFile);
                } else {
                    reject(new Error(data.err.message));
                }
            };

            worker.addEventListener('message', onMessage);

            worker.postMessage({ json });
        });
    };

    return {
        encode
    };
};
