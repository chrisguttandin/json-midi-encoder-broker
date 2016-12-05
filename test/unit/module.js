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

                    instances.push(this);
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

        let json;

        beforeEach(() => {
            json = [ { some: 'JSON' }, 'data' ];
        });

        it('should send the correct message', (done) => {
            Worker.instances[0].addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    json
                });

                done();
            });

            jsonMidiEncoder.encode(json);
        });

    });

});
