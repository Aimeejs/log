import is from 'is';
import Time from 'time';
import Config from 'config';
import extend from 'extend';

class Log {
    constructor(options) {
        let self = this;
        this.is = is;
        this.extend = extend;
        this.options = {};
        this.config = new Config;
        this.defaultMsg = '-';
        this.config.init(this.options);
        this.config.set('rules', {
            dev: ':file::line :msg',
            prod: '[:time]:file::line :msg'
        });
        this.config.set('keys', {
            time: () => {
                return this.time.now()
            },
            file: () => {
                return this.config.get('filename')
            },
            line: () => {
                let number = this.config.get('line');
                this.config.set('line', '-');
                return number;
            }
        });
        this.config.set('time', 'hh:mm:ss');
        this.config.set('format', this.config.get('rules.prod'));
        !is.string(options) || this.config.set('filename', options);
        !is.plainObject(options) || this.config.merge(options);
        this.time = new Time({ format: this.config.get('time') });
        [
            'log',
            'info',
            'warn',
            'error',
            'debug'
        ].forEach((key) => {
            this[key] = function() {
                console[key](self.parse(Array.from(arguments)))
            }
        })
    }

    token(id, fn) {
        this.config.set(`keys.${id}`, fn)
        return this
    }

    line(number) {
        this.config.set('line', number)
        return this
    }

    color() {
        this.config.set('format', ':file::line :msg');
        console.log('%c[' + this.time.now() + ']', 'color:#777', this.parse(Array.from(arguments)));
    }

    parse(msg) {
        let keys = this.config.get('keys');
        let format = this.config.get('format');
        let space = this.defaultMsg;
        return format.replace(/:\w+\b/g, function(key){
            key = key.slice(1);
            switch(key) {
                case 'msg':
                return msg.join(' ');

                default:
                return keys[key] ? (keys[key]() || space) : space;
            }
        })
    }
}

export default Log;
