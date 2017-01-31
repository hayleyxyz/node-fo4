const yuilib = require('yuilib');

class FalloutIO extends yuilib.IO.FileIO {

    readPrefixedString() {
        var length = this.readUInt16LE();
        var value = this.read(length);
        return value.toString();
    }

    writePrefixedString(value) {
        this.writeUInt16LE(value.length);
        this.write(value);
    }

}

module.exports = FalloutIO;