import { load } from '../../src/module';

describe('module', () => {

    let jsonMidiEncoder;

    afterEach(() => {
        Worker.reset();
    });

    beforeEach(() => {
        Worker = ((OriginalWorker) => { // eslint-disable-line no-global-assign
            const instances = [];

            return class ExtendedWorker extends OriginalWorker {

                constructor (url) {
                    super(url);

                    const addEventListener = this.addEventListener;

                    // This is an ugly hack to prevent the broker from handling mirrored events.
                    this.addEventListener = (index, ...args) => {
                        if (typeof index === 'number') {
                            return addEventListener.apply(this, args);
                        }
                    };

                    instances.push(this);
                }

                static addEventListener (index, ...args) {
                    return instances[index].addEventListener(index, ...args);
                }

                static get instances () {
                    return instances;
                }

                static reset () {
                    Worker = OriginalWorker; // eslint-disable-line no-global-assign
                }

            };
        })(Worker);

        const blob = new Blob([`
            self.addEventListener('message', ({ data }) => {
                self.postMessage(data);
            });
        `], { type: 'application/javascript' });

        jsonMidiEncoder = load(URL.createObjectURL(blob));
    });

    describe('encode()', () => {

        let midiFile;

        beforeEach(() => {
            midiFile = [ { some: 'JSON' }, 'data' ];
        });

        it('should send the correct message', (done) => {
            Worker.addEventListener(0, 'message', ({ data }) => {
                expect(data.id).to.be.a('number');

                expect(data).to.deep.equal({
                    id: data.id,
                    method: 'encode',
                    params: { midiFile }
                });

                done();
            });

            jsonMidiEncoder.encode(midiFile);
        });

    });

});
